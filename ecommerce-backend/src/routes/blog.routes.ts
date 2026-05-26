import { Router } from 'express';
import { fetchBlogs } from '../controllers/blog.controller.js';

const router = Router();

// GET /api/blogs or /api/blogs?category=laptops
router.get('/', fetchBlogs);

export default router;
