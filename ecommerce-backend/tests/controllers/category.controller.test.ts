import * as categoryService from '../../src/services/category.service.js';
import { fetchCategories } from '../../src/controllers/category.controller.js';
import { createMockReq, createMockRes } from '../helpers/http.js';

describe('fetchCategories', () => {
  it('returns mapped categories', async () => {
    vi.spyOn(categoryService, 'getCategories').mockResolvedValue({
      categories: [{ _id: '1', name: 'Gaming Laptop', thumbnail: 'img', logo: '' } as any],
      total: 1,
      page: 1,
      limit: 10,
    });

    const req = createMockReq({ query: { limit: '10', page: '1' } });
    const res = createMockRes();

    await fetchCategories(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json.mock.calls[0][0].categories[0].slug).toBe('gaming-laptop');
  });

  it('returns 500 on failure', async () => {
    vi.spyOn(categoryService, 'getCategories').mockRejectedValue(new Error('x'));

    const res = createMockRes();
    await fetchCategories(createMockReq() as any, res as any);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
