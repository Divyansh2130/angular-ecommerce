import { Router } from 'express';
import { getBestDealProducts } from '../controllers/product.controller.js';

const router = Router();

// GET /api/products/best-deals
router.get('/best-deals', getBestDealProducts);

export default router;
