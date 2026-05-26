import * as typeService from '../../src/services/type.service.js';
import { fetchTypesByCategory } from '../../src/controllers/type.controller.js';
import { createMockReq, createMockRes } from '../helpers/http.js';

describe('fetchTypesByCategory', () => {
  it('validates category id', async () => {
    const res = createMockRes();
    await fetchTypesByCategory(createMockReq({ params: { categoryId: '' } }) as any, res as any);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns types', async () => {
    vi.spyOn(typeService, 'getTypesByCategory').mockResolvedValue({
      types: [{ name: 'T' }],
      total: 1,
      page: 1,
      limit: 10,
      categoryId: 'c1',
    });

    const req = createMockReq({ params: { categoryId: 'c1' }, query: { limit: '10', page: '1' } });
    const res = createMockRes();

    await fetchTypesByCategory(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('handles error', async () => {
    vi.spyOn(typeService, 'getTypesByCategory').mockRejectedValue(new Error('x'));
    const req = createMockReq({ params: { categoryId: 'c1' } });
    const res = createMockRes();

    await fetchTypesByCategory(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
