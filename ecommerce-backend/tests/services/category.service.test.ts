import Category from '../../src/models/category.model.js';
import { getCategories } from '../../src/services/category.service.js';

describe('getCategories', () => {
  it('returns paginated categories', async () => {
    const lean = vi.fn().mockResolvedValue([{ _id: '1', name: 'Laptop' }]);
    const limit = vi.fn().mockReturnValue({ lean });
    const skip = vi.fn().mockReturnValue({ limit });
    const sort = vi.fn().mockReturnValue({ skip });
    const select = vi.fn().mockReturnValue({ sort });
    vi.spyOn(Category, 'find').mockReturnValue({ select } as any);
    vi.spyOn(Category, 'countDocuments').mockResolvedValue(1 as any);

    const result = await getCategories({ limit: 10, page: 2 });

    expect(result.total).toBe(1);
    expect(result.page).toBe(2);
    expect(skip).toHaveBeenCalledWith(10);
  });
});
