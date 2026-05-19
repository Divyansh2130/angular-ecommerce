import { Router } from 'express';
import { fetchBrandsByCategory } from '../controllers/brand.controller.js';

const router = Router();

// GET /api/brands/category/:categoryId
router.get('/category/:categoryId', fetchBrandsByCategory);

export default router;
