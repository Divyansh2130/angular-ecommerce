import { Router } from 'express';
import { fetchFAQsByCategory } from '../controllers/faq.controller.js';

const router = Router();

// GET /api/faqs/:category
router.get('/:category', fetchFAQsByCategory);

export default router;
