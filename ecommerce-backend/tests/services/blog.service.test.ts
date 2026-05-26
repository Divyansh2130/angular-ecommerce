import Blog from '../../src/models/blog.model.js';
import { getBlogsByCategory } from '../../src/services/blog.service.js';

describe('getBlogsByCategory', () => {
  it('returns general blogs when category not provided', async () => {
    const lean = vi.fn().mockResolvedValue([{ title: 'A' }]);
    const limit = vi.fn().mockReturnValue({ lean });
    const skip = vi.fn().mockReturnValue({ limit });
    const sort = vi.fn().mockReturnValue({ skip });
    const select = vi.fn().mockReturnValue({ sort });
    vi.spyOn(Blog, 'find').mockReturnValue({ select } as any);
    vi.spyOn(Blog, 'countDocuments').mockResolvedValue(3 as any);

    const result = await getBlogsByCategory({ limit: 5, page: 1 });

    expect(result.category).toBe('general');
    expect(result.total).toBe(3);
  });

  it('returns category blogs when category provided', async () => {
    const lean = vi.fn().mockResolvedValue([{ title: 'B' }]);
    const limit = vi.fn().mockReturnValue({ lean });
    const skip = vi.fn().mockReturnValue({ limit });
    const sort = vi.fn().mockReturnValue({ skip });
    const select = vi.fn().mockReturnValue({ sort });
    vi.spyOn(Blog, 'find').mockReturnValue({ select } as any);
    vi.spyOn(Blog, 'countDocuments').mockResolvedValue(1 as any);

    const result = await getBlogsByCategory({ category: 'laptop', limit: 5, page: 2 });

    expect(result.category).toBe('laptop');
    expect(result.page).toBe(2);
  });
});
