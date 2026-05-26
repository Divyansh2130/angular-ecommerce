import Category from '../models/category.model.js';

export const getCategories = async ({ limit = 50, page = 1 } = {}) => {
  const skip = (page - 1) * limit;

  const [categories, total] = await Promise.all([
    Category.find({})
      .select('name thumbnail logo')
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Category.countDocuments({}),
  ]);

  return { categories, total, page, limit };
};
