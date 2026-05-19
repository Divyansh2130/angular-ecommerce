import { getFAQsByCategory } from '../services/faq.service.js';

export const fetchFAQsByCategory = async (req, res) => {
  try {
    const category = String(req.params.category || '').trim();

    if (!category) {
      return res.status(400).json({ success: false, message: 'Category is required' });
    }

    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const page = Math.max(parseInt(req.query.page) || 1, 1);

    const data = await getFAQsByCategory({ category, limit, page });

    return res.status(200).json({
      success: true,
      category: data.category,
      total: data.total,
      page: data.page,
      limit: data.limit,
      totalPages: Math.ceil(data.total / data.limit),
      faqs: data.faqs
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch FAQs for category' });
  }
};
