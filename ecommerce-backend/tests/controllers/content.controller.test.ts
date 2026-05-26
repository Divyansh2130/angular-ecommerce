import * as contentService from '../../src/services/content.service.js';
import { fetchContent } from '../../src/controllers/content.controller.js';
import { createMockReq, createMockRes } from '../helpers/http.js';

describe('fetchContent', () => {
  it('returns 200 with content', async () => {
    vi.spyOn(contentService, 'getMainContent').mockResolvedValue({ hello: 'world' } as any);

    const res = createMockRes();
    await fetchContent(createMockReq() as any, res as any);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('returns 404 when content missing', async () => {
    vi.spyOn(contentService, 'getMainContent').mockResolvedValue(null);

    const res = createMockRes();
    await fetchContent(createMockReq() as any, res as any);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('returns 500 on error', async () => {
    vi.spyOn(contentService, 'getMainContent').mockRejectedValue(new Error('x'));

    const res = createMockRes();
    await fetchContent(createMockReq() as any, res as any);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
