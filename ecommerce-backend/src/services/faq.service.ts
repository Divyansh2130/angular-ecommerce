import FAQ from '../models/faq.model.js';

type GetFAQsByCategoryParams = {
  category: string;
  limit?: number;
  page?: number;
};

type GetFAQsByCategoryResult = {
  faqs: unknown[];
  total: number;
  page: number;
  limit: number;
  category: string;
};

export const getFAQsByCategory = async (
  { category, limit = 50, page = 1 }: GetFAQsByCategoryParams
): Promise<GetFAQsByCategoryResult> => {
  const skip = (page - 1) * limit;

  const [faqs, total] = await Promise.all([
    FAQ.find({ category })
      .select('question answer category order')
      .sort({ order: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    FAQ.countDocuments({ category })
  ]);

  return { faqs, total, page, limit, category };
};
