import express from 'express';
import { postAnalyze, getDoctors, postBook, getHistory } from '../controller/chat.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// Public analyze endpoint (optional authenticated)
router.post('/chat/analyze', postAnalyze);

// Get doctors by specialization
router.get('/chat/doctors', getDoctors);

// Book an appointment (requires auth)
router.post('/chat/book', verifyToken, postBook);

// Get chat history (requires auth)
router.get('/chat/history', verifyToken, getHistory);

export default router;