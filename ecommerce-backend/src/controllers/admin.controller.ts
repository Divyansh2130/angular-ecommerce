import Product from '../models/product.model.js';
import Category from '../models/category.model.js';
import Type from '../models/type.model.js';
import Brand from '../models/brand.model.js';

const parseNumber = (value) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const getInventoryOptions = async (_req, res) => {
  try {
    const [categories, types, brands] = await Promise.all([
      Category.find({}).select('_id name').sort({ name: 1 }).lean(),
      Type.find({}).select('_id name category').sort({ name: 1 }).lean(),
      Brand.find({}).select('_id name').sort({ name: 1 }).lean(),
    ]);

    return res.status(200).json({
      success: true,
      categories,
      types,
      brands,
    });
  } catch {
    return res.status(500).json({ success: false, message: 'Failed to fetch inventory options' });
  }
};

export const getInventory = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const skip = (page - 1) * limit;
    const search = String(req.query.search || '').trim();

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { slug: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name')
        .populate('type', 'name')
        .populate('brand', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      products,
    });
  } catch {
    return res.status(500).json({ success: false, message: 'Failed to fetch inventory' });
  }
};

export const createInventoryProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      categoryId,
      typeId,
      brandId,
      price,
      discountPrice,
      thumbnail,
      inStock,
      isBestDeal,
      isTrending,
    } = req.body;

    if (!name || !slug || !categoryId || price === undefined || price === null) {
      return res.status(400).json({ success: false, message: 'name, slug, categoryId and price are required' });
    }

    const doc = await Product.create({
      name,
      slug,
      description: description || '',
      category: categoryId,
      type: typeId || undefined,
      brand: brandId || undefined,
      price: Number(price),
      discountPrice: parseNumber(discountPrice),
      thumbnail: thumbnail || '',
      inStock: inStock !== false,
      isBestDeal: !!isBestDeal,
      isTrending: !!isTrending,
      images: thumbnail ? [{ url: thumbnail, alt: `${name} image` }] : [],
    });

    return res.status(201).json({ success: true, product: doc });
  } catch (error) {
    const duplicate = error?.code === 11000;
    return res
      .status(duplicate ? 409 : 500)
      .json({ success: false, message: duplicate ? 'Slug already exists' : 'Failed to create product' });
  }
};

export const updateInventoryProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      slug,
      description,
      categoryId,
      typeId,
      brandId,
      price,
      discountPrice,
      thumbnail,
      inStock,
      isBestDeal,
      isTrending,
    } = req.body;

    const update = {
      ...(name !== undefined ? { name } : {}),
      ...(slug !== undefined ? { slug } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(categoryId !== undefined ? { category: categoryId } : {}),
      ...(typeId !== undefined ? { type: typeId || undefined } : {}),
      ...(brandId !== undefined ? { brand: brandId || undefined } : {}),
      ...(price !== undefined ? { price: Number(price) } : {}),
      ...(discountPrice !== undefined ? { discountPrice: parseNumber(discountPrice) } : {}),
      ...(thumbnail !== undefined ? { thumbnail, images: thumbnail ? [{ url: thumbnail, alt: `${name || 'product'} image` }] : [] } : {}),
      ...(inStock !== undefined ? { inStock: !!inStock } : {}),
      ...(isBestDeal !== undefined ? { isBestDeal: !!isBestDeal } : {}),
      ...(isTrending !== undefined ? { isTrending: !!isTrending } : {}),
    };

    const updated = await Product.findByIdAndUpdate(id, update, { new: true }).lean();

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    return res.status(200).json({ success: true, product: updated });
  } catch (error) {
    const duplicate = error?.code === 11000;
    return res
      .status(duplicate ? 409 : 500)
      .json({ success: false, message: duplicate ? 'Slug already exists' : 'Failed to update product' });
  }
};

export const deleteInventoryProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id).lean();

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    return res.status(200).json({ success: true, message: 'Product deleted' });
  } catch {
    return res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
};
