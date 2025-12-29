import express from 'express';
import { unifiedLogin, getProfile } from '../controller/auth.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// Unified login for all users
router.post('/login', unifiedLogin);

// Get profile for authenticated user
router.get('/profile', verifyToken, getProfile);

export default router;