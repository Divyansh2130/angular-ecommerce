import Product from '../../src/models/product.model.js';
import {
  getAllProducts,
  getBestDeals,
  getTrendingProductsList,
  getBestDealsByCategory,
  getTrendingProductsByCategory,
  getProductsByTypeAndCategory,
} from '../../src/services/product.service.js';

const createFindChain = (rows: any[]) => {
  const chain: any = {};
  chain.populate = vi.fn().mockReturnValue(chain);
  chain.select = vi.fn().mockReturnValue(chain);
  chain.sort = vi.fn().mockReturnValue(chain);
  chain.skip = vi.fn().mockReturnValue(chain);
  chain.limit = vi.fn().mockReturnValue(chain);
  chain.lean = vi.fn().mockResolvedValue(rows);
  return chain;
};

describe('product service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('getAllProducts returns paginated products', async () => {
    const chain = createFindChain([{ name: 'p1' }]);
    vi.spyOn(Product, 'find').mockReturnValue(chain as any);
    vi.spyOn(Product, 'countDocuments').mockResolvedValue(1 as any);

    const res = await getAllProducts({ limit: 20, page: 1 });

    expect(res.total).toBe(1);
    expect(res.products).toHaveLength(1);
  });

  it('getBestDeals returns list', async () => {
    const chain = createFindChain([{ name: 'd1' }]);
    vi.spyOn(Product, 'find').mockReturnValue(chain as any);
    vi.spyOn(Product, 'countDocuments').mockResolvedValue(1 as any);

    const res = await getBestDeals({ limit: 10, page: 1 });

    expect(res.total).toBe(1);
  });

  it('getTrendingProductsList returns list', async () => {
    const chain = createFindChain([{ name: 't1' }]);
    vi.spyOn(Product, 'find').mockReturnValue(chain as any);
    vi.spyOn(Product, 'countDocuments').mockResolvedValue(1 as any);

    const res = await getTrendingProductsList({ limit: 10, page: 1 });

    expect(res.products[0]).toEqual({ name: 't1' });
  });

  it('getBestDealsByCategory returns category', async () => {
    const chain = createFindChain([{ name: 'x' }]);
    vi.spyOn(Product, 'find').mockReturnValue(chain as any);
    vi.spyOn(Product, 'countDocuments').mockResolvedValue(2 as any);

    const res = await getBestDealsByCategory({ category: 'laptop', limit: 5, page: 2 });

    expect(res.category).toBe('laptop');
    expect(res.page).toBe(2);
  });

  it('getTrendingProductsByCategory returns category', async () => {
    const chain = createFindChain([{ name: 'x' }]);
    vi.spyOn(Product, 'find').mockReturnValue(chain as any);
    vi.spyOn(Product, 'countDocuments').mockResolvedValue(2 as any);

    const res = await getTrendingProductsByCategory({ category: 'laptop', limit: 5, page: 1 });

    expect(res.category).toBe('laptop');
  });

  it('getProductsByTypeAndCategory returns ids', async () => {
    const chain = createFindChain([{ name: 'x' }]);
    vi.spyOn(Product, 'find').mockReturnValue(chain as any);
    vi.spyOn(Product, 'countDocuments').mockResolvedValue(2 as any);

    const res = await getProductsByTypeAndCategory({ categoryId: 'c1', typeId: 't1', limit: 5, page: 1 });

    expect(res.categoryId).toBe('c1');
    expect(res.typeId).toBe('t1');
  });
});
