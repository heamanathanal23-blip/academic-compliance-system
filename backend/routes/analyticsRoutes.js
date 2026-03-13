import express from 'express';
import {
  analyticsKPI,
  gpaTrend,
  departmentPerformance,
  riskDistribution,
  facultyPerformance,
  studentDashboard
} from '../controllers/analyticsController.js';
import { auth, requireAdminOrFaculty } from '../middleware/auth.js';

const router = express.Router();

router.get('/kpi', auth, analyticsKPI);
router.get('/gpa-trend', auth, gpaTrend);
router.get('/department-performance', auth, departmentPerformance);
router.get('/risk-distribution', auth, riskDistribution);
router.get('/faculty-performance', auth, requireAdminOrFaculty, facultyPerformance);
router.get('/student-dashboard/:studentId', auth, studentDashboard);

export default router;
