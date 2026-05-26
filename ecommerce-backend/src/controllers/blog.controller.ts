import type { Request, Response } from 'express';
import { getBlogsByCategory } from '../services/blog.service.js';

const getQueryString = (value: unknown): string => {
  if (Array.isArray(value)) {
    return String(value[0] ?? '');
  }

  return String(value ?? '');
};

const getQueryNumber = (value: unknown, fallback: number): number => {
  const parsed = parseInt(getQueryString(value), 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export const fetchBlogs = async (req: Request, res: Response) => {
  try {
    const category = getQueryString(req.query.category).trim() || null;

    const limit = Math.min(getQueryNumber(req.query.limit, 10), 50);
    const page = Math.max(getQueryNumber(req.query.page, 1), 1);

    const data = await getBlogsByCategory({ category, limit, page });

    return res.status(200).json({
      success: true,
      category: data.category,
      total: data.total,
      page: data.page,
      limit: data.limit,
      totalPages: Math.ceil(data.total / data.limit),
      blogs: data.blogs
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch blogs' });
  }
};
