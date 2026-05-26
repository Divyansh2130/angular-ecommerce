import Product from '../../src/models/product.model.js';
import Brand from '../../src/models/brand.model.js';
import { getBrandsByCategory } from '../../src/services/brand.service.js';

describe('getBrandsByCategory', () => {
  it('returns brands for category', async () => {
    const distinctLean = vi.fn().mockResolvedValue(['b1']);
    const distinct = vi.fn().mockReturnValue({ lean: distinctLean });
    vi.spyOn(Product, 'find').mockReturnValue({ distinct } as any);

    const lean = vi.fn().mockResolvedValue([{ _id: 'b1', name: 'Brand1' }]);
    const limit = vi.fn().mockReturnValue({ lean });
    const skip = vi.fn().mockReturnValue({ limit });
    const select = vi.fn().mockReturnValue({ skip });
    vi.spyOn(Brand, 'find').mockReturnValue({ select } as any);
    vi.spyOn(Brand, 'countDocuments').mockResolvedValue(1 as any);

    const result = await getBrandsByCategory({ categoryId: 'c1', limit: 10, page: 1 });

    expect(result.total).toBe(1);
    expect(result.categoryId).toBe('c1');
  });
});
