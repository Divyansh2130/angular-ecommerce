import Product from '../models/product.model.js';

type ListParams = {
  limit?: number;
  page?: number;
};

type CategoryListParams = ListParams & {
  category: string;
};

type TypeCategoryListParams = ListParams & {
  categoryId: string;
  typeId: string;
};

type ProductListResult = {
  products: unknown[];
  total: number;
  page: number;
  limit: number;
};

type CategoryProductListResult = ProductListResult & {
  category: string;
};

type TypeCategoryProductListResult = ProductListResult & {
  categoryId: string;
  typeId: string;
};

export const getAllProducts = async ({ limit = 200, page = 1 }: ListParams = {}): Promise<ProductListResult> => {
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find({})
      .populate('brand', 'name logo categories')
      .populate('category', 'name thumbnail logo')
      .populate('type', 'name image category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments({})
  ]);

  return { products, total, page, limit };
};

export const getBestDeals = async ({ limit = 10, page = 1 }: ListParams = {}): Promise<ProductListResult> => {
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find({ isBestDeal: true })
      .select('name slug thumbnail price discountPrice currency rating totalReviews ratingBreakdown isTrending isBestDeal inStock brand')
      .populate('brand', 'name logo categories')
      .sort({ rating: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments({ isBestDeal: true })
  ]);

  return { products, total, page, limit };
};

export const getTrendingProductsList = async ({ limit = 10, page = 1 }: ListParams = {}): Promise<ProductListResult> => {
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find({ isTrending: true })
      .select('name slug thumbnail price discountPrice currency rating totalReviews ratingBreakdown isTrending isBestDeal inStock brand')
      .populate('brand', 'name logo categories')
      .sort({ rating: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments({ isTrending: true })
  ]);

  return { products, total, page, limit };
};

export const getBestDealsByCategory = async (
  { category, limit = 10, page = 1 }: CategoryListParams
): Promise<CategoryProductListResult> => {
  const skip = (page - 1) * limit;
  const query = { isBestDeal: true, category };

  const [products, total] = await Promise.all([
    Product.find(query)
      .select('name slug thumbnail price discountPrice currency rating totalReviews ratingBreakdown isTrending isBestDeal inStock category brand')
      .populate('brand', 'name logo categories')
      .sort({ rating: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(query)
  ]);

  return { products, total, page, limit, category };
};

export const getTrendingProductsByCategory = async (
  { category, limit = 10, page = 1 }: CategoryListParams
): Promise<CategoryProductListResult> => {
  const skip = (page - 1) * limit;
  const query = { isTrending: true, category };

  const [products, total] = await Promise.all([
    Product.find(query)
      .select('name slug thumbnail price discountPrice currency rating totalReviews ratingBreakdown isTrending isBestDeal inStock category brand')
      .populate('brand', 'name logo categories')
      .sort({ rating: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(query)
  ]);

  return { products, total, page, limit, category };
};

export const getProductsByTypeAndCategory = async (
  { categoryId, typeId, limit = 10, page = 1 }: TypeCategoryListParams
): Promise<TypeCategoryProductListResult> => {
  const skip = (page - 1) * limit;
  const query = { category: categoryId, type: typeId };

  const [products, total] = await Promise.all([
    Product.find(query)
      .select('name slug thumbnail price discountPrice currency rating totalReviews ratingBreakdown isTrending isBestDeal inStock category brand type')
      .populate('brand', 'name logo categories')
      .populate('type', 'name image category')
      .sort({ rating: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(query)
  ]);

  return { products, total, page, limit, categoryId, typeId };
};
