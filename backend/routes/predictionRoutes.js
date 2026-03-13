import express from 'express';
import {
  getPredictionForStudent,
  getAllStudentPredictions
} from '../controllers/predictionController.js';
import { auth, requireAdminOrFaculty } from '../middleware/auth.js';

const router = express.Router();

router.get('/student/:studentId', auth, getPredictionForStudent);
router.get('/', auth, requireAdminOrFaculty, getAllStudentPredictions);

export default router;
