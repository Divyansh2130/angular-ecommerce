import type { Request, Response } from 'express';
import { getTypesByCategory } from '../services/type.service.js';

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

export const fetchTypesByCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = String(req.params.categoryId || '').trim();

    if (!categoryId) {
      return res.status(400).json({ success: false, message: 'Category ID is required' });
    }

    const limit = Math.min(getQueryNumber(req.query.limit, 50), 100);
    const page = Math.max(getQueryNumber(req.query.page, 1), 1);

    const data = await getTypesByCategory({ categoryId, limit, page });

    return res.status(200).json({
      success: true,
      categoryId: data.categoryId,
      total: data.total,
      page: data.page,
      limit: data.limit,
      totalPages: Math.ceil(data.total / data.limit),
      types: data.types
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch types for category' });
  }
};
