import express from 'express';
import {
  getAllAlerts,
  getUnresolvedAlertsList,
  getStudentAlerts,
  resolveAlertById
} from '../controllers/alertController.js';
import { auth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getAllAlerts);
router.get('/unresolved', auth, requireAdmin, getUnresolvedAlertsList);
router.get('/student/:studentId', auth, getStudentAlerts);
router.put('/:alertId/resolve', auth, resolveAlertById);

export default router;
