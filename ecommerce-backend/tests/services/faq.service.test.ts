import FAQ from '../../src/models/faq.model.js';
import { getFAQsByCategory } from '../../src/services/faq.service.js';

describe('getFAQsByCategory', () => {
  it('returns faq list by category', async () => {
    const lean = vi.fn().mockResolvedValue([{ question: 'Q' }]);
    const limit = vi.fn().mockReturnValue({ lean });
    const skip = vi.fn().mockReturnValue({ limit });
    const sort = vi.fn().mockReturnValue({ skip });
    const select = vi.fn().mockReturnValue({ sort });
    vi.spyOn(FAQ, 'find').mockReturnValue({ select } as any);
    vi.spyOn(FAQ, 'countDocuments').mockResolvedValue(1 as any);

    const result = await getFAQsByCategory({ category: 'laptop', limit: 10, page: 1 });

    expect(result.category).toBe('laptop');
    expect(result.total).toBe(1);
  });
});
