import User from '../models/User.js';
import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';
import { generateToken, validateEmail } from '../utils/helpers.js';
import bcryptjs from 'bcryptjs';
import { getMockUser, createMockUser, getMockUserById } from '../utils/mockData.js';

const useMockData = false;

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, department } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Please provide a valid email' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Use database
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
      department
    });

    // If student, create student record
    if (user.role === 'student') {
      await Student.create({
        userId: user._id,
        studentId: `STU${Date.now()}`,
        name,
        email,
        department: department || 'Computer Science',
        semester: 1,
        gpa: 0,
        attendance: 0,
        enrollmentYear: new Date().getFullYear()
      });
    }

    // If faculty, create faculty record
    if (user.role === 'faculty') {
      await Faculty.create({
        userId: user._id,
        facultyId: `FAC${Date.now()}`,
        name,
        email,
        department: department || 'Computer Science'
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Use database
    // Find user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    let user;

    user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    next(error);
  }
};
