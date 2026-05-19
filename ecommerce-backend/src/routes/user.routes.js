import { Router } from 'express';
import {
  signup,
  login,
  logout,
  getProfile
} from '../controllers/user.controller.js';

const router = Router();

// POST /api/auth/signup
router.post('/signup', signup);

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/logout
router.post('/logout', logout);

// GET /api/auth/profile (requires authentication middleware)
router.get('/profile', getProfile);

export default router;
