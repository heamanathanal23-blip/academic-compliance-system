import Student from '../models/Student.js';
import Alert from '../models/Alert.js';
import { detectRisk } from './riskDetectionService.js';

export const createAlertIfNeeded = async (studentId, reason, severity, description) => {
  try {
    const alert = new Alert({
      studentId,
      reason,
      severity,
      description
    });
    await alert.save();
    return alert;
  } catch (error) {
    console.error('Error creating alert:', error);
    throw error;
  }
};

export const checkAndCreateAlerts = async (student) => {
  try {
    const alerts = [];

    // Check attendance
    if (student.attendance < 70) {
      const alert = await createAlertIfNeeded(
        student._id,
        'Low Attendance',
        'high',
        `Student attendance at ${student.attendance}%. Urgent intervention needed.`
      );
      alerts.push(alert);
    }

    // Check GPA drop
    if (student.gpaHistory && student.gpaHistory.length >= 2) {
      const currentGPA = student.gpa;
      const previousGPA = student.gpaHistory[student.gpaHistory.length - 2]?.gpa;
      
      if (previousGPA && (previousGPA - currentGPA) >= 0.5) {
        const alert = await createAlertIfNeeded(
          student._id,
          'GPA Drop',
          'high',
          `GPA dropped from ${previousGPA} to ${currentGPA}.`
        );
        alerts.push(alert);
      }
    }

    // Check predicted risk
    const riskLevel = detectRisk(student.gpa, student.attendance);
    if (riskLevel === 'high') {
      const alert = await createAlertIfNeeded(
        student._id,
        'High Risk Prediction',
        'critical',
        `Student classified as high risk. Immediate intervention required.`
      );
      alerts.push(alert);
    }

    return alerts;
  } catch (error) {
    console.error('Error checking and creating alerts:', error);
    throw error;
  }
};

export const getUnresolvedAlerts = async (studentId = null) => {
  try {
    const query = { resolved: false };
    if (studentId) {
      query.studentId = studentId;
    }

    const alerts = await Alert.find(query)
      .populate('studentId', 'name email studentId')
      .sort({ createdAt: -1 });

    return alerts;
  } catch (error) {
    console.error('Error fetching alerts:', error);
    throw error;
  }
};

export const resolveAlert = async (alertId, userId) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      alertId,
      {
        resolved: true,
        resolvedAt: new Date(),
        acknowledgedBy: userId,
        acknowledgedAt: new Date()
      },
      { new: true }
    );

    return alert;
  } catch (error) {
    console.error('Error resolving alert:', error);
    throw error;
  }
};
