import { Router } from 'express';
import { fetchContent } from '../controllers/content.controller.js';

const router = Router();

// GET /api/content
router.get('/', fetchContent);

export default router;
