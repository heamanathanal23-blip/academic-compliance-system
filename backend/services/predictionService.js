import Student from '../models/Student.js';
import Prediction from '../models/Prediction.js';
import { calculatePredictedRisk, generateRiskRecommendations, detectRisk } from './riskDetectionService.js';

export const generatePredictionForStudent = async (studentId) => {
  try {
    const student = await Student.findById(studentId);

    if (!student) {
      throw new Error('Student not found');
    }

    const prediction = calculatePredictedRisk(
      student.gpa,
      student.attendance,
      student.gpaHistory,
      student.attendanceHistory
    );

    const currentRisk = detectRisk(student.gpa, student.attendance);
    const factors = [];

    if (student.gpa < 2.5) {
      factors.push({ name: 'Low GPA', impact: 'negative' });
    }
    if (student.attendance < 70) {
      factors.push({ name: 'Poor Attendance', impact: 'negative' });
    }
    if (student.gpa >= 3.5) {
      factors.push({ name: 'Strong GPA', impact: 'positive' });
    }
    if (student.attendance >= 90) {
      factors.push({ name: 'Excellent Attendance', impact: 'positive' });
    }

    // Determine predicted risk level
    let predictedRisk = 'low';
    if (prediction.riskProbability > 60) {
      predictedRisk = 'high';
    } else if (prediction.riskProbability > 40) {
      predictedRisk = 'medium';
    }

    const recommendations = generateRiskRecommendations(
      prediction.predictedGPA,
      prediction.predictedAttendance,
      predictedRisk
    );

    const predictionRecord = {
      studentId,
      currentGPA: student.gpa,
      currentAttendance: student.attendance,
      predictedRisk,
      riskProbability: prediction.riskProbability,
      predictedGPA: prediction.predictedGPA,
      predictedAttendance: prediction.predictedAttendance,
      factors,
      recommendations
    };

    // Save prediction
    const savedPrediction = await Prediction.findOneAndUpdate(
      { studentId },
      predictionRecord,
      { upsert: true, new: true }
    );

    return savedPrediction;
  } catch (error) {
    console.error('Error generating prediction:', error);
    throw error;
  }
};

export const getStudentPrediction = async (studentId) => {
  try {
    const prediction = await Prediction.findOne({ studentId }).populate('studentId', 'name email studentId');
    
    if (!prediction) {
      return await generatePredictionForStudent(studentId);
    }

    return prediction;
  } catch (error) {
    console.error('Error fetching prediction:', error);
    throw error;
  }
};

export const getAllPredictions = async (departmentFilter = null) => {
  try {
    let query = {};
    
    if (departmentFilter) {
      const students = await Student.find({ department: departmentFilter }).select('_id');
      const studentIds = students.map(s => s._id);
      query.studentId = { $in: studentIds };
    }

    const predictions = await Prediction.find(query)
      .populate('studentId', 'name email studentId department')
      .sort({ riskProbability: -1 });

    return predictions;
  } catch (error) {
    console.error('Error fetching predictions:', error);
    throw error;
  }
};

export const updateHighRiskStudents = async () => {
  try {
    const students = await Student.find();
    
    const predictions = await Promise.all(
      students.map(student => generatePredictionForStudent(student._id))
    );

    return predictions;
  } catch (error) {
    console.error('Error updating predictions:', error);
    throw error;
  }
};
