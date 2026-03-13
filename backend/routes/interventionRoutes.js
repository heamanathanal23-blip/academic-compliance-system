import express from 'express';
import {
  createIntervention,
  getInterventionsByStudent,
  getInterventionsByFaculty,
  updateIntervention,
  deleteIntervention
} from '../controllers/interventionController.js';
import { auth, requireFaculty, requireAdminOrFaculty } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, requireFaculty, createIntervention);
router.get('/student/:studentId', auth, getInterventionsByStudent);
router.get('/faculty', auth, requireFaculty, getInterventionsByFaculty);
router.put('/:interventionId', auth, requireFaculty, updateIntervention);
router.delete('/:interventionId', auth, requireFaculty, deleteIntervention);

export default router;
