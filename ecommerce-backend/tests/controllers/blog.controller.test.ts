import * as blogService from '../../src/services/blog.service.js';
import { fetchBlogs } from '../../src/controllers/blog.controller.js';
import { createMockReq, createMockRes } from '../helpers/http.js';

describe('fetchBlogs', () => {
  it('returns blogs list', async () => {
    vi.spyOn(blogService, 'getBlogsByCategory').mockResolvedValue({
      blogs: [{ title: 'A' }],
      total: 1,
      page: 1,
      limit: 10,
      category: 'general',
    });

    const req = createMockReq({ query: { limit: '10', page: '1' } });
    const res = createMockRes();

    await fetchBlogs(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json.mock.calls[0][0].totalPages).toBe(1);
  });

  it('returns 500 on error', async () => {
    vi.spyOn(blogService, 'getBlogsByCategory').mockRejectedValue(new Error('x'));
    const res = createMockRes();

    await fetchBlogs(createMockReq() as any, res as any);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
