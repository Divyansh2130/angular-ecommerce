import Blog from '../models/blog.model.js';

export const getBlogsByCategory = async ({ category, limit = 10, page = 1 } = {}) => {
  const skip = (page - 1) * limit;
  
  // If category is provided, filter by category; otherwise fetch general blogs (null/undefined category)
  const query = category ? { category, isPublished: true } : { category: { $in: [null, '', undefined] }, isPublished: true };

  const [blogs, total] = await Promise.all([
    Blog.find(query)
      .select('title slug content category thumbnail author tags createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Blog.countDocuments(query)
  ]);

  return { blogs, total, page, limit, category: category || 'general' };
};
