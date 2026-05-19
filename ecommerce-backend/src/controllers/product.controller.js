import {
  getBestDeals,
  getBestDealsByCategory,
  getProductsByTypeAndCategory,
  getTrendingProductsByCategory,
  getTrendingProductsList
} from '../services/product.service.js';

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

export const getTrendingProducts = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const page  = Math.max(parseInt(req.query.page)  || 1,  1);

    const data = await getTrendingProductsList({ limit, page });

    return res.status(200).json({
      success: true,
      total: data.total,
      page: data.page,
      limit: data.limit,
      totalPages: Math.ceil(data.total / data.limit),
      products: data.products
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch trending products' });
  }
};

export const getBestDealProductsByCategory = async (req, res) => {
  try {
    const category = String(req.params.category || '').trim();

    if (!category) {
      return res.status(400).json({ success: false, message: 'Category is required' });
    }

    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const page  = Math.max(parseInt(req.query.page) || 1, 1);

    const data = await getBestDealsByCategory({ category, limit, page });

    return res.status(200).json({
      success: true,
      category: data.category,
      total: data.total,
      page: data.page,
      limit: data.limit,
      totalPages: Math.ceil(data.total / data.limit),
      products: data.products
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch category best deal products' });
  }
};

export const getTrendingProductsByCategoryController = async (req, res) => {
  try {
    const category = String(req.params.category || '').trim();

    if (!category) {
      return res.status(400).json({ success: false, message: 'Category is required' });
    }

    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const page = Math.max(parseInt(req.query.page) || 1, 1);

    const data = await getTrendingProductsByCategory({ category, limit, page });

    return res.status(200).json({
      success: true,
      category: data.category,
      total: data.total,
      page: data.page,
      limit: data.limit,
      totalPages: Math.ceil(data.total / data.limit),
      products: data.products
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch category trending products' });
  }
};

export const getProductsByTypeAndCategory = async (req, res) => {
  try {
    const categoryId = String(req.params.categoryId || '').trim();
    const typeId = String(req.params.typeId || '').trim();

    if (!categoryId || !typeId) {
      return res.status(400).json({ success: false, message: 'Category ID and Type ID are required' });
    }

    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const page = Math.max(parseInt(req.query.page) || 1, 1);

    const data = await getProductsByTypeAndCategory({ categoryId, typeId, limit, page });

    return res.status(200).json({
      success: true,
      categoryId: data.categoryId,
      typeId: data.typeId,
      total: data.total,
      page: data.page,
      limit: data.limit,
      totalPages: Math.ceil(data.total / data.limit),
      products: data.products
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch products by type and category' });
  }
};
