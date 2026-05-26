import Product from '../../src/models/product.model.js';
import Category from '../../src/models/category.model.js';
import Type from '../../src/models/type.model.js';
import Brand from '../../src/models/brand.model.js';
import {
  getInventoryOptions,
  getInventory,
  createInventoryProduct,
  updateInventoryProduct,
  deleteInventoryProduct,
} from '../../src/controllers/admin.controller.js';
import { createMockReq, createMockRes } from '../helpers/http.js';

describe('admin controller', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('getInventoryOptions returns options and handles errors', async () => {
    vi.spyOn(Category, 'find').mockReturnValue({ select: vi.fn().mockReturnValue({ sort: vi.fn().mockReturnValue({ lean: vi.fn().mockResolvedValue([]) }) }) } as any);
    vi.spyOn(Type, 'find').mockReturnValue({ select: vi.fn().mockReturnValue({ sort: vi.fn().mockReturnValue({ lean: vi.fn().mockResolvedValue([]) }) }) } as any);
    vi.spyOn(Brand, 'find').mockReturnValue({ select: vi.fn().mockReturnValue({ sort: vi.fn().mockReturnValue({ lean: vi.fn().mockResolvedValue([]) }) }) } as any);

    const res = createMockRes();
    await getInventoryOptions(createMockReq() as any, res as any);
    expect(res.status).toHaveBeenCalledWith(200);

    vi.spyOn(Category, 'find').mockImplementation(() => {
      throw new Error('x');
    });
    const res2 = createMockRes();
    await getInventoryOptions(createMockReq() as any, res2 as any);
    expect(res2.status).toHaveBeenCalledWith(500);
  });

  it('getInventory returns list and handles errors', async () => {
    const chain: any = {};
    chain.populate = vi.fn().mockReturnValue(chain);
    chain.sort = vi.fn().mockReturnValue(chain);
    chain.skip = vi.fn().mockReturnValue(chain);
    chain.limit = vi.fn().mockReturnValue(chain);
    chain.lean = vi.fn().mockResolvedValue([{ _id: 'p1' }]);
    vi.spyOn(Product, 'find').mockReturnValue(chain as any);
    vi.spyOn(Product, 'countDocuments').mockResolvedValue(1 as any);

    const res = createMockRes();
    await getInventory(createMockReq({ query: { search: 'lap', limit: '10', page: '1' } }) as any, res as any);
    expect(res.status).toHaveBeenCalledWith(200);

    vi.spyOn(Product, 'find').mockImplementation(() => {
      throw new Error('x');
    });
    const res2 = createMockRes();
    await getInventory(createMockReq() as any, res2 as any);
    expect(res2.status).toHaveBeenCalledWith(500);
  });

  it('createInventoryProduct validates required fields', async () => {
    const res = createMockRes();
    await createInventoryProduct(createMockReq({ body: {} }) as any, res as any);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('createInventoryProduct creates product', async () => {
    vi.spyOn(Product, 'create').mockResolvedValue({ _id: 'p1' } as any);
    const res = createMockRes();

    await createInventoryProduct(
      createMockReq({ body: { name: 'n', slug: 's', categoryId: 'c1', price: 100, thumbnail: 'img' } }) as any,
      res as any
    );

    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('createInventoryProduct handles duplicate and generic error', async () => {
    vi.spyOn(Product, 'create').mockRejectedValue({ code: 11000 });
    const dupRes = createMockRes();
    await createInventoryProduct(
      createMockReq({ body: { name: 'n', slug: 's', categoryId: 'c1', price: 100 } }) as any,
      dupRes as any
    );
    expect(dupRes.status).toHaveBeenCalledWith(409);

    vi.spyOn(Product, 'create').mockRejectedValue(new Error('x'));
    const errRes = createMockRes();
    await createInventoryProduct(
      createMockReq({ body: { name: 'n', slug: 's', categoryId: 'c1', price: 100 } }) as any,
      errRes as any
    );
    expect(errRes.status).toHaveBeenCalledWith(500);
  });

  it('updateInventoryProduct returns 404 and 200', async () => {
    vi.spyOn(Product, 'findByIdAndUpdate').mockReturnValue({ lean: vi.fn().mockResolvedValue(null) } as any);
    const notFoundRes = createMockRes();
    await updateInventoryProduct(createMockReq({ params: { id: 'p1' }, body: { name: 'n' } }) as any, notFoundRes as any);
    expect(notFoundRes.status).toHaveBeenCalledWith(404);

    vi.spyOn(Product, 'findByIdAndUpdate').mockReturnValue({ lean: vi.fn().mockResolvedValue({ _id: 'p1' }) } as any);
    const okRes = createMockRes();
    await updateInventoryProduct(createMockReq({ params: { id: 'p1' }, body: { price: 50, thumbnail: 'img' } }) as any, okRes as any);
    expect(okRes.status).toHaveBeenCalledWith(200);
  });

  it('updateInventoryProduct handles duplicate and generic errors', async () => {
    vi.spyOn(Product, 'findByIdAndUpdate').mockReturnValue({ lean: vi.fn().mockRejectedValue({ code: 11000 }) } as any);
    const dupRes = createMockRes();
    await updateInventoryProduct(createMockReq({ params: { id: 'p1' }, body: { slug: 'x' } }) as any, dupRes as any);
    expect(dupRes.status).toHaveBeenCalledWith(409);

    vi.spyOn(Product, 'findByIdAndUpdate').mockReturnValue({ lean: vi.fn().mockRejectedValue(new Error('x')) } as any);
    const errRes = createMockRes();
    await updateInventoryProduct(createMockReq({ params: { id: 'p1' }, body: { slug: 'x' } }) as any, errRes as any);
    expect(errRes.status).toHaveBeenCalledWith(500);
  });

  it('deleteInventoryProduct returns 404, 200 and 500', async () => {
    vi.spyOn(Product, 'findByIdAndDelete').mockReturnValue({ lean: vi.fn().mockResolvedValue(null) } as any);
    const notFoundRes = createMockRes();
    await deleteInventoryProduct(createMockReq({ params: { id: 'p1' } }) as any, notFoundRes as any);
    expect(notFoundRes.status).toHaveBeenCalledWith(404);

    vi.spyOn(Product, 'findByIdAndDelete').mockReturnValue({ lean: vi.fn().mockResolvedValue({ _id: 'p1' }) } as any);
    const okRes = createMockRes();
    await deleteInventoryProduct(createMockReq({ params: { id: 'p1' } }) as any, okRes as any);
    expect(okRes.status).toHaveBeenCalledWith(200);

    vi.spyOn(Product, 'findByIdAndDelete').mockImplementation(() => {
      throw new Error('x');
    });
    const errRes = createMockRes();
    await deleteInventoryProduct(createMockReq({ params: { id: 'p1' } }) as any, errRes as any);
    expect(errRes.status).toHaveBeenCalledWith(500);
  });
});
