import Product from '../models/product.model.js';

export const getBestDeals = async ({ limit = 10, page = 1 } = {}) => {
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find({ isBestDeal: true })
      .select('name slug thumbnail price discountPrice currency rating totalReviews ratingBreakdown isTrending isBestDeal inStock')
      .sort({ rating: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments({ isBestDeal: true })
  ]);

  return { products, total, page, limit };
};
