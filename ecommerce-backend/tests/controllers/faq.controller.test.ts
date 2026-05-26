import * as faqService from '../../src/services/faq.service.js';
import { fetchFAQsByCategory } from '../../src/controllers/faq.controller.js';
import { createMockReq, createMockRes } from '../helpers/http.js';

describe('fetchFAQsByCategory', () => {
  it('validates category', async () => {
    const res = createMockRes();
    await fetchFAQsByCategory(createMockReq({ params: { category: '' } }) as any, res as any);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns faqs', async () => {
    vi.spyOn(faqService, 'getFAQsByCategory').mockResolvedValue({
      faqs: [{ question: 'Q' }],
      total: 1,
      page: 1,
      limit: 10,
      category: 'laptop',
    });

    const req = createMockReq({ params: { category: 'laptop' }, query: { limit: '10', page: '1' } });
    const res = createMockRes();

    await fetchFAQsByCategory(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('handles error', async () => {
    vi.spyOn(faqService, 'getFAQsByCategory').mockRejectedValue(new Error('x'));
    const req = createMockReq({ params: { category: 'laptop' } });
    const res = createMockRes();

    await fetchFAQsByCategory(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
