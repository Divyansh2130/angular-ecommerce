import { Router } from 'express';
import { fetchTypesByCategory } from '../controllers/type.controller.js';

const router = Router();

// GET /api/types/category/:categoryId
router.get('/category/:categoryId', fetchTypesByCategory);

export default router;
