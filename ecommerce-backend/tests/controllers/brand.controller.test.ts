import * as brandService from '../../src/services/brand.service.js';
import { fetchBrandsByCategory } from '../../src/controllers/brand.controller.js';
import { createMockReq, createMockRes } from '../helpers/http.js';

describe('fetchBrandsByCategory', () => {
  it('validates category id', async () => {
    const res = createMockRes();
    await fetchBrandsByCategory(createMockReq({ params: { categoryId: '' } }) as any, res as any);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns brands', async () => {
    vi.spyOn(brandService, 'getBrandsByCategory').mockResolvedValue({
      brands: [{ name: 'B' }],
      total: 1,
      page: 1,
      limit: 10,
      categoryId: 'c1',
    });
    const req = createMockReq({ params: { categoryId: 'c1' }, query: { limit: '10', page: '1' } });
    const res = createMockRes();

    await fetchBrandsByCategory(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('handles error', async () => {
    vi.spyOn(brandService, 'getBrandsByCategory').mockRejectedValue(new Error('x'));
    const req = createMockReq({ params: { categoryId: 'c1' } });
    const res = createMockRes();

    await fetchBrandsByCategory(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
