import Student from '../models/Student.js';
import User from '../models/User.js';
import { calculateRiskLevel } from '../utils/helpers.js';
import { checkAndCreateAlerts } from '../services/alertService.js';
import { getAllMockStudents, getMockStudentById } from '../utils/mockData.js';

const useMockData = false;

export const getStudents = async (req, res, next) => {
  try {
    const { department, riskLevel, search } = req.query;


    let query = {};

    if (department) {
      query.department = department;
    }

    if (riskLevel) {
      query.riskLevel = riskLevel;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } }
      ];
    }

    const students = await Student.find(query)
      .populate('advisorId', 'name email')
      .sort({ name: 1 });

    res.json({ students });
  } catch (error) {
    next(error);
  }
};

export const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('advisorId', 'name email');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ student });
  } catch (error) {
    next(error);
  }
};

export const createStudent = async (req, res, next) => {
  try {
    const { name, email, department, semester, gpa, attendance, enrollmentYear, advisorId } = req.body;

    // Validation
    if (!name || !email || !department) {
      return res.status(400).json({ message: 'Please provide name, email, and department' });
    }

    const student = await Student.create({
      studentId: `STU${Date.now()}`,
      name,
      email,
      department,
      semester: semester || 1,
      gpa: gpa || 0,
      attendance: attendance || 0,
      enrollmentYear: enrollmentYear || new Date().getFullYear(),
      advisorId,
      riskLevel: calculateRiskLevel(gpa || 0, attendance || 0)
    });

    // Create alerts if needed
    await checkAndCreateAlerts(student);

    res.status(201).json({
      message: 'Student created successfully',
      student
    });
  } catch (error) {
    next(error);
  }
};

export const updateStudent = async (req, res, next) => {
  try {
    const { gpa, attendance, semester, department } = req.body;
    
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Update fields
    if (gpa !== undefined) {
      if (student.gpaHistory) {
        student.gpaHistory.push({ semester: student.semester, gpa: student.gpa });
      } else {
        student.gpaHistory = [{ semester: student.semester, gpa: student.gpa }];
      }
      student.gpa = gpa;
    }

    if (attendance !== undefined) {
      if (student.attendanceHistory) {
        student.attendanceHistory.push({ semester: student.semester, attendance: student.attendance });
      } else {
        student.attendanceHistory = [{ semester: student.semester, attendance: student.attendance }];
      }
      student.attendance = attendance;
    }

    if (semester) student.semester = semester;
    if (department) student.department = department;

    // Recalculate risk level
    student.riskLevel = calculateRiskLevel(student.gpa, student.attendance);
    student.updatedAt = new Date();

    await student.save();

    // Check and create alerts
    await checkAndCreateAlerts(student);

    res.json({
      message: 'Student updated successfully',
      student
    });
  } catch (error) {
    next(error);
  }
};

export const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getStudentsByDepartment = async (req, res, next) => {
  try {
    const { department } = req.params;

    const students = await Student.find({ department })
      .populate('advisorId', 'name email')
      .sort({ name: 1 });

    res.json({
      department,
      count: students.length,
      students
    });
  } catch (error) {
    next(error);
  }
};
