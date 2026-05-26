import Product from '../../src/models/product.model.js';
import Type from '../../src/models/type.model.js';
import { getTypesByCategory } from '../../src/services/type.service.js';

describe('getTypesByCategory', () => {
  it('returns types for category', async () => {
    const distinctLean = vi.fn().mockResolvedValue(['t1']);
    const distinct = vi.fn().mockReturnValue({ lean: distinctLean });
    vi.spyOn(Product, 'find').mockReturnValue({ distinct } as any);

    const lean = vi.fn().mockResolvedValue([{ _id: 't1', name: 'Gaming' }]);
    const limit = vi.fn().mockReturnValue({ lean });
    const skip = vi.fn().mockReturnValue({ limit });
    const select = vi.fn().mockReturnValue({ skip });
    vi.spyOn(Type, 'find').mockReturnValue({ select } as any);
    vi.spyOn(Type, 'countDocuments').mockResolvedValue(1 as any);

    const result = await getTypesByCategory({ categoryId: 'c1', limit: 10, page: 2 });

    expect(result.total).toBe(1);
    expect(result.page).toBe(2);
  });
});
