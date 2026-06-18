import { Router } from 'express';
import {
  signup,
  login,
  logout,
  getProfile
} from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// POST /api/auth/signup
router.post('/signup', signup);

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/logout
router.post('/logout', authenticate, logout);

// GET /api/auth/profile (requires authentication middleware)
router.get('/profile', authenticate, getProfile);

export default router;
