import { getBlogsByCategory } from '../services/blog.service.js';

export const fetchBlogs = async (req, res) => {
  try {
    const category = String(req.query.category || '').trim() || null;

    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const page = Math.max(parseInt(req.query.page) || 1, 1);

    const data = await getBlogsByCategory({ category, limit, page });

    return res.status(200).json({
      success: true,
      category: data.category,
      total: data.total,
      page: data.page,
      limit: data.limit,
      totalPages: Math.ceil(data.total / data.limit),
      blogs: data.blogs
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch blogs' });
  }
};
