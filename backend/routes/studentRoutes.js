import express from 'express';
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
} from '../controllers/studentController.js';
import { auth, requireAdmin, requireAdminOrFaculty } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getStudents);
router.get('/:id', auth, getStudentById);
router.post('/', auth, requireAdmin, createStudent);
router.put('/:id', auth, requireAdminOrFaculty, updateStudent);
router.delete('/:id', auth, requireAdmin, deleteStudent);

export default router;
