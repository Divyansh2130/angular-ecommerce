import { getCategories } from '../services/category.service.js';

const slugify = (value = '') =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const fetchCategories = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const page = Math.max(parseInt(req.query.page) || 1, 1);

    const data = await getCategories({ limit, page });

    const categories = data.categories.map((category) => ({
      ...category,
      id: category._id,
      slug: slugify(category.name),
      image: category.thumbnail || category.logo || '',
    }));

    return res.status(200).json({
      success: true,
      total: data.total,
      page: data.page,
      limit: data.limit,
      totalPages: Math.ceil(data.total / data.limit),
      categories,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
};
