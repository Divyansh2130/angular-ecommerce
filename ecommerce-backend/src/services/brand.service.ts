import Product from '../models/product.model.js';
import Brand from '../models/brand.model.js';

type GetBrandsByCategoryParams = {
  categoryId: string;
  limit?: number;
  page?: number;
};

type GetBrandsByCategoryResult = {
  brands: unknown[];
  total: number;
  page: number;
  limit: number;
  categoryId: string;
};

export const getBrandsByCategory = async (
  { categoryId, limit = 50, page = 1 }: GetBrandsByCategoryParams
): Promise<GetBrandsByCategoryResult> => {
  const skip = (page - 1) * limit;

  // Get unique brand IDs from products in this category
  const brandIds = await Product.find({ category: categoryId })
    .distinct('brand')
    .lean();

  // Fetch brand details with pagination
  const [brands, total] = await Promise.all([
    Brand.find({ _id: { $in: brandIds } })
      .select('name logo categories')
      .skip(skip)
      .limit(limit)
      .lean(),
    Brand.countDocuments({ _id: { $in: brandIds } })
  ]);

  return { brands, total, page, limit, categoryId };
};
