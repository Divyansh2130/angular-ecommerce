import type { Request, Response } from 'express';
import { getFAQsByCategory } from '../services/faq.service.js';

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

export const fetchFAQsByCategory = async (req: Request, res: Response) => {
  try {
    const category = String(req.params.category || '').trim();

    if (!category) {
      return res.status(400).json({ success: false, message: 'Category is required' });
    }

    const limit = Math.min(getQueryNumber(req.query.limit, 50), 100);
    const page = Math.max(getQueryNumber(req.query.page, 1), 1);

    const data = await getFAQsByCategory({ category, limit, page });

    return res.status(200).json({
      success: true,
      category: data.category,
      total: data.total,
      page: data.page,
      limit: data.limit,
      totalPages: Math.ceil(data.total / data.limit),
      faqs: data.faqs
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch FAQs for category' });
  }
};
