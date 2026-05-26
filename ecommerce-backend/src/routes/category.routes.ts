import { Router } from 'express';
import { fetchCategories } from '../controllers/category.controller.js';

const router = Router();

// GET /api/categories
router.get('/', fetchCategories);

export default router;
