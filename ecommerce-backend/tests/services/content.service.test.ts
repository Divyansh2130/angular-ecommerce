import Content from '../../src/models/content.model.js';
import { getMainContent } from '../../src/services/content.service.js';

describe('getMainContent', () => {
  it('returns content data when present', async () => {
    vi.spyOn(Content, 'findOne').mockReturnValue({ lean: vi.fn().mockResolvedValue({ data: { a: 1 } }) } as any);

    const data = await getMainContent();

    expect(data).toEqual({ a: 1 });
  });

  it('returns null when no record', async () => {
    vi.spyOn(Content, 'findOne').mockReturnValue({ lean: vi.fn().mockResolvedValue(null) } as any);

    const data = await getMainContent();

    expect(data).toBeNull();
  });
});
