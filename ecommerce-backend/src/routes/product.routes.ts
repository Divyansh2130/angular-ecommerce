import { Router } from 'express';
import {
	getProducts,
	getBestDealProducts,
	getBestDealProductsByCategory,
	getProductsByTypeAndCategory,
	getTrendingProductsByCategoryController,
	getTrendingProducts
} from '../controllers/product.controller.js';

const router = Router();

// GET /api/products
router.get('/', getProducts);

// GET /api/products/best-deals
router.get('/best-deals', getBestDealProducts);

// GET /api/products/trending
router.get('/trending', getTrendingProducts);

// GET /api/products/best-deals/category/:category
router.get('/best-deals/category/:category', getBestDealProductsByCategory);

// GET /api/products/trending/category/:category
router.get('/trending/category/:category', getTrendingProductsByCategoryController);

// GET /api/products/category/:categoryId/type/:typeId
router.get('/category/:categoryId/type/:typeId', getProductsByTypeAndCategory);

export default router;
