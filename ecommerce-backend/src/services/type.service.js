import Product from '../models/product.model.js';
import Type from '../models/type.model.js';

export const getTypesByCategory = async ({ categoryId, limit = 50, page = 1 } = {}) => {
  const skip = (page - 1) * limit;

  // Get unique type IDs from products in this category
  const typeIds = await Product.find({ category: categoryId })
    .distinct('type')
    .lean();

  // Fetch type details with pagination
  const [types, total] = await Promise.all([
    Type.find({ _id: { $in: typeIds } })
      .select('name image category')
      .skip(skip)
      .limit(limit)
      .lean(),
    Type.countDocuments({ _id: { $in: typeIds } })
  ]);

  return { types, total, page, limit, categoryId };
};
