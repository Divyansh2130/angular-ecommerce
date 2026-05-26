import * as productService from '../../src/services/product.service.js';
import {
  getProducts,
  getBestDealProducts,
  getTrendingProducts,
  getBestDealProductsByCategory,
  getTrendingProductsByCategoryController,
  getProductsByTypeAndCategory,
} from '../../src/controllers/product.controller.js';
import { createMockReq, createMockRes } from '../helpers/http.js';

describe('product controller', () => {
  const listPayload = {
    products: [{ id: 1 }],
    total: 2,
    page: 1,
    limit: 10,
  };

  it('getProducts success and error', async () => {
    vi.spyOn(productService, 'getAllProducts').mockResolvedValue(listPayload as any);
    const res = createMockRes();
    await getProducts(createMockReq({ query: { limit: '10', page: '1' } }) as any, res as any);
    expect(res.status).toHaveBeenCalledWith(200);

    vi.spyOn(productService, 'getAllProducts').mockRejectedValue(new Error('x'));
    const res2 = createMockRes();
    await getProducts(createMockReq() as any, res2 as any);
    expect(res2.status).toHaveBeenCalledWith(500);
  });

  it('getBestDealProducts and trending return success', async () => {
    vi.spyOn(productService, 'getBestDeals').mockResolvedValue(listPayload as any);
    const res1 = createMockRes();
    await getBestDealProducts(createMockReq() as any, res1 as any);
    expect(res1.status).toHaveBeenCalledWith(200);

    vi.spyOn(productService, 'getTrendingProductsList').mockResolvedValue(listPayload as any);
    const res2 = createMockRes();
    await getTrendingProducts(createMockReq() as any, res2 as any);
    expect(res2.status).toHaveBeenCalledWith(200);
  });

  it('category endpoints validate params and success', async () => {
    const badRes = createMockRes();
    await getBestDealProductsByCategory(createMockReq({ params: { category: '' } }) as any, badRes as any);
    expect(badRes.status).toHaveBeenCalledWith(400);

    vi.spyOn(productService, 'getBestDealsByCategory').mockResolvedValue({ ...listPayload, category: 'laptop' } as any);
    const okRes = createMockRes();
    await getBestDealProductsByCategory(createMockReq({ params: { category: 'laptop' } }) as any, okRes as any);
    expect(okRes.status).toHaveBeenCalledWith(200);

    vi.spyOn(productService, 'getTrendingProductsByCategory').mockResolvedValue({ ...listPayload, category: 'laptop' } as any);
    const okRes2 = createMockRes();
    await getTrendingProductsByCategoryController(createMockReq({ params: { category: 'laptop' } }) as any, okRes2 as any);
    expect(okRes2.status).toHaveBeenCalledWith(200);
  });

  it('getProductsByTypeAndCategory validates and returns success', async () => {
    const badRes = createMockRes();
    await getProductsByTypeAndCategory(createMockReq({ params: { categoryId: '', typeId: '' } }) as any, badRes as any);
    expect(badRes.status).toHaveBeenCalledWith(400);

    vi.spyOn(productService, 'getProductsByTypeAndCategory').mockResolvedValue({
      ...listPayload,
      categoryId: 'c1',
      typeId: 't1',
    } as any);
    const okRes = createMockRes();
    await getProductsByTypeAndCategory(
      createMockReq({ params: { categoryId: 'c1', typeId: 't1' }, query: { limit: '10', page: '1' } }) as any,
      okRes as any
    );
    expect(okRes.status).toHaveBeenCalledWith(200);
  });
});
