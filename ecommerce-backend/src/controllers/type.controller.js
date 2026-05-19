import { getTypesByCategory } from '../services/type.service.js';

export const fetchTypesByCategory = async (req, res) => {
  try {
    const categoryId = String(req.params.categoryId || '').trim();

    if (!categoryId) {
      return res.status(400).json({ success: false, message: 'Category ID is required' });
    }

    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const page = Math.max(parseInt(req.query.page) || 1, 1);

    const data = await getTypesByCategory({ categoryId, limit, page });

    return res.status(200).json({
      success: true,
      categoryId: data.categoryId,
      total: data.total,
      page: data.page,
      limit: data.limit,
      totalPages: Math.ceil(data.total / data.limit),
      types: data.types
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch types for category' });
  }
};
