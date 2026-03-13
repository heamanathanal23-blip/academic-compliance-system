import { getStudentPrediction, getAllPredictions } from '../services/predictionService.js';
import User from '../models/User.js';

export const getPredictionForStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const prediction = await getStudentPrediction(studentId);

    res.json(prediction);
  } catch (error) {
    next(error);
  }
};

export const getAllStudentPredictions = async (req, res, next) => {
  try {
    let departmentFilter = null;

    // Faculty can only see predictions for their department
    if (req.user.role === 'faculty') {
      const user = await User.findById(req.user.userId);
      departmentFilter = user.department;
    }

    const predictions = await getAllPredictions(departmentFilter);

    res.json({
      count: predictions.length,
      predictions
    });
  } catch (error) {
    next(error);
  }
};
