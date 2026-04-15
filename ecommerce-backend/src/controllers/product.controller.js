import { getBestDeals } from '../services/product.service.js';

export const getBestDealProducts = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const page  = Math.max(parseInt(req.query.page)  || 1,  1);

    const data = await getBestDeals({ limit, page });

    return res.status(200).json({
      success: true,
      total: data.total,
      page: data.page,
      limit: data.limit,
      totalPages: Math.ceil(data.total / data.limit),
      products: data.products
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch best deal products' });
  }
};
