import express from 'express';
import { queryAssistant } from '../controllers/assistantController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/query', auth, queryAssistant);

export default router;
