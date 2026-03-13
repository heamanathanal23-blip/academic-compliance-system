import { getUnresolvedAlerts, resolveAlert } from '../services/alertService.js';
import Alert from '../models/Alert.js';

export const getAllAlerts = async (req, res, next) => {
  try {
    const { resolved } = req.query;
    let query = {};

    if (resolved !== undefined) {
      query.resolved = resolved === 'true';
    }

    // Faculty and students can only see alerts for their scope
    if (req.user.role === 'faculty') {
      // Faculty would see alerts for their advised students
      query.facultyId = req.user.userId;
    } else if (req.user.role === 'student') {
      // Student sees only their alerts
      const Student = (await import('../models/Student.js')).default;
      const student = await Student.findOne({ userId: req.user.userId });
      if (student) {
        query.studentId = student._id;
      }
    }

    const alerts = await Alert.find(query)
      .populate('studentId', 'name email studentId')
      .sort({ createdAt: -1 });

    res.json({
      count: alerts.length,
      alerts
    });
  } catch (error) {
    next(error);
  }
};

export const getUnresolvedAlertsList = async (req, res, next) => {
  try {
    const alerts = await getUnresolvedAlerts();
    res.json({
      count: alerts.length,
      alerts
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentAlerts = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const alerts = await Alert.find({ studentId })
      .populate('studentId', 'name email studentId')
      .sort({ createdAt: -1 });

    res.json({
      count: alerts.length,
      alerts
    });
  } catch (error) {
    next(error);
  }
};

export const resolveAlertById = async (req, res, next) => {
  try {
    const { alertId } = req.params;

    const alert = await resolveAlert(alertId, req.user.userId);

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.json({
      message: 'Alert resolved successfully',
      alert
    });
  } catch (error) {
    next(error);
  }
};
