import dotenv from 'dotenv';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import connectDB from '../src/config/db.js';
import Category from '../src/models/category.model.js';
import Type from '../src/models/type.model.js';
import Brand from '../src/models/brand.model.js';
import Product from '../src/models/product.model.js';
import FAQ from '../src/models/faq.model.js';
import Blog from '../src/models/blog.model.js';
import Content from '../src/models/content.model.js';

type CategorySeed = {
  name: string;
  image?: string;
};

type SpecSeed = {
  label: string;
  value: string;
};

type ReviewSeed = {
  ratings: number;
  username: string;
  review: string;
  likes?: number;
};

type ProductSeed = {
  title: string;
  subtitle?: string;
  description?: string;
  longDescription?: string;
  category?: string;
  categorySlug?: string;
  brand?: string;
  sectionTags?: string[];
  originalPrice: number;
  price: number;
  rating?: number;
  reviews?: number;
  ratingBreakdown?: Record<string, unknown>;
  ratingsAndReviews?: ReviewSeed[];
  featureBullets?: string[];
  specs?: SpecSeed[];
  image: string;
  gallery?: string[];
  inStock?: boolean;
  slug?: string;
};

type ContentTypeSeed = {
  name: string;
  image?: string;
};

type BrandSeed = {
  name: string;
  icon?: string;
};

type FAQSeed = {
  question: string;
  answer: string;
};

type BlogSeed = {
  title: string;
  image?: string;
  highlight?: string;
  footerTitle?: string;
  footerDesc?: string;
};

type UIContentSeed = {
  categoryTypesMap?: Record<string, ContentTypeSeed[]>;
  laptopBrands?: BrandSeed[];
  categoryFaqsMap?: Record<string, FAQSeed[]>;
  homeBlogs?: BlogSeed[];
  categoryBlogsMap?: Record<string, BlogSeed[]>;
};

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, '..', '..');
const dataDir = path.join(workspaceRoot, 'angular-ecommerce', 'public', 'assets', 'data');

const slugify = (value = ''): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const readJson = async <T>(fileName: string): Promise<T> => {
  const filePath = path.join(dataDir, fileName);
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw) as T;
};

const toBlogSlug = (title: string, suffix = ''): string => {
  const base = slugify(title || 'blog');
  return suffix ? `${base}-${suffix}` : base;
};

const run = async () => {
  await connectDB();

  const [categoriesJson, productsJson, contentJson] = await Promise.all([
    readJson<CategorySeed[]>('categories.json'),
    readJson<ProductSeed[]>('products.json'),
    readJson<UIContentSeed>('ui-content.json'),
  ]);

  await Promise.all([
    Product.deleteMany({}),
    Type.deleteMany({}),
    Brand.deleteMany({}),
    Category.deleteMany({}),
    FAQ.deleteMany({}),
    Blog.deleteMany({}),
    Content.deleteMany({}),
  ]);

  const categoryDocs = await Category.insertMany(
    categoriesJson.map((category) => ({
      name: category.name,
      thumbnail: category.image || '',
      logo: category.image || '',
    }))
  );

  const categoryBySlug = new Map<string, any>();
  for (const category of categoryDocs) {
    categoryBySlug.set(slugify(category.name), category);
  }

  const typesToInsert: Array<{ category: string; name: string; image: string }> = [];
  for (const [categorySlug, types] of Object.entries(contentJson.categoryTypesMap || {})) {
    for (const type of types) {
      typesToInsert.push({
        category: categorySlug,
        name: type.name,
        image: type.image || '',
      });
    }
  }
  const typeDocs = await Type.insertMany(typesToInsert);

  const typeByCategory = new Map<string, any[]>();
  for (const type of typeDocs) {
    const key = slugify(type.category);
    if (!typeByCategory.has(key)) {
      typeByCategory.set(key, []);
    }
    typeByCategory.get(key).push(type);
  }

  const uniqueBrandNames = [
    ...new Set(productsJson.map((product) => (product.brand || '').trim()).filter(Boolean)),
  ] as string[];
  const laptopBrandIconMap = new Map(
    (contentJson.laptopBrands || [])
      .filter((brand) => brand.name && brand.icon)
      .map((brand) => [brand.name.toLowerCase(), brand.icon])
  );

  const brandDocs = await Brand.insertMany(
    uniqueBrandNames.map((name) => ({
      name,
      logo: laptopBrandIconMap.get(name.toLowerCase()) || '',
      categories: [],
    }))
  );
  const brandByName = new Map(brandDocs.map((brand) => [brand.name.toLowerCase(), brand]));

  const resolveTypeForProduct = (product: ProductSeed, categorySlug: string) => {
    const types = typeByCategory.get(categorySlug) || [];
    if (types.length === 0) {
      return undefined;
    }

    const haystack = `${product.title || ''} ${product.subtitle || ''} ${product.description || ''}`.toLowerCase();
    const matched = types.find((type) => haystack.includes(String(type.name).toLowerCase().replace(/s$/g, '')));
    return matched?._id || types[types.length - 1]._id;
  };

  const productDocs = productsJson.map((product: ProductSeed) => {
    const categorySlug = product.categorySlug || slugify(product.category || 'laptop');
    const category = categoryBySlug.get(categorySlug);

    if (!category) {
      throw new Error(`Category not found for slug: ${categorySlug}`);
    }

    const brand = product.brand ? brandByName.get(product.brand.toLowerCase()) : undefined;
    const sectionTags = product.sectionTags || [];
    const price = product.originalPrice || product.price;

    return {
      name: product.title,
      slug: product.slug || slugify(product.title),
      description: product.longDescription || product.description || '',
      category: category._id,
      type: resolveTypeForProduct(product, categorySlug),
      brand: brand?._id,
      price,
      discountPrice: product.price < price ? product.price : undefined,
      currency: 'INR',
      images: (product.gallery || []).map((url) => ({ url, alt: `${product.title} gallery image` })),
      thumbnail: product.image,
      isTrending: sectionTags.includes('trending'),
      isBestDeal:
        sectionTags.includes('best-seller') || sectionTags.includes('laptop-deals') || sectionTags.includes('special-offer'),
      rating: product.rating || 0,
      totalReviews: product.reviews || 0,
      ratingBreakdown: product.ratingBreakdown || undefined,
      ratingsAndReviews: (product.ratingsAndReviews || []).map((review) => ({
        ratings: review.ratings,
        username: review.username,
        timestamp: new Date(),
        review: review.review,
        likes: review.likes || 0,
      })),
      inStock: product.inStock !== false,
      productInformation: product.featureBullets || [],
      specifications: Object.fromEntries((product.specs || []).map((spec) => [spec.label, spec.value])),
    };
  });

  await Product.insertMany(productDocs);

  const faqDocs: Array<{ question: string; answer: string; category: string; order: number }> = [];
  for (const [categoryName, faqs] of Object.entries(contentJson.categoryFaqsMap || {})) {
    const categorySlug = slugify(categoryName);
    for (let index = 0; index < faqs.length; index += 1) {
      const faq = faqs[index];
      faqDocs.push({
        question: faq.question,
        answer: faq.answer,
        category: categorySlug,
        order: index,
      });
    }
  }
  await FAQ.insertMany(faqDocs);

  const blogDocs: Array<{
    title: string;
    slug: string;
    content: string;
    category: string | null;
    thumbnail: string;
    author: string;
    tags: string[];
    isPublished: boolean;
  }> = [];
  let blogCounter = 0;

  for (const blog of contentJson.homeBlogs || []) {
    blogCounter += 1;
    blogDocs.push({
      title: blog.title,
      slug: toBlogSlug(blog.title, `home-${blogCounter}`),
      content: `${blog.footerTitle || ''}\n\n${blog.footerDesc || ''}`.trim(),
      category: null,
      thumbnail: blog.image || '',
      author: 'Mock Seed',
      tags: blog.highlight ? [blog.highlight] : [],
      isPublished: true,
    });
  }

  for (const [categoryName, blogs] of Object.entries(contentJson.categoryBlogsMap || {})) {
    const categorySlug = slugify(categoryName);
    for (const blog of blogs) {
      blogCounter += 1;
      blogDocs.push({
        title: blog.title,
        slug: toBlogSlug(blog.title, `${categorySlug}-${blogCounter}`),
        content: `${blog.footerTitle || ''}\n\n${blog.footerDesc || ''}`.trim(),
        category: categorySlug,
        thumbnail: blog.image || '',
        author: 'Mock Seed',
        tags: blog.highlight ? [blog.highlight] : [],
        isPublished: true,
      });
    }
  }

  await Blog.insertMany(blogDocs);

  await Content.create({
    key: 'main',
    data: contentJson,
  });

  console.log('Mock data seeded successfully.');
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
