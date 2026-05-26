import Blog from '../models/blog.model.js';

type GetBlogsByCategoryParams = {
  category?: string | null;
  limit?: number;
  page?: number;
};

type GetBlogsByCategoryResult = {
  blogs: unknown[];
  total: number;
  page: number;
  limit: number;
  category: string;
};

export const getBlogsByCategory = async (
  { category = null, limit = 10, page = 1 }: GetBlogsByCategoryParams = {}
): Promise<GetBlogsByCategoryResult> => {
  const skip = (page - 1) * limit;
  const normalizedCategory = category?.trim() || null;

  // If category is provided, filter by category; otherwise fetch general blogs (null/undefined category)
  const query = normalizedCategory
    ? { category: normalizedCategory, isPublished: true }
    : { category: { $in: [null, '', undefined] }, isPublished: true };

  const [blogs, total] = await Promise.all([
    Blog.find(query)
      .select('title slug content category thumbnail author tags createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Blog.countDocuments(query)
  ]);

  return { blogs, total, page, limit, category: normalizedCategory || 'general' };
};
