import {
  getAnalyticsKPI,
  getGpaTrend,
  getDepartmentPerformance,
  getRiskDistribution,
  getFacultyPerformance,
  getStudentDashboard
} from '../services/analyticsService.js';

export const analyticsKPI = async (req, res, next) => {
  try {
    const kpi = await getAnalyticsKPI();
    res.json({ kpi });
  } catch (error) {
    next(error);
  }
};

export const gpaTrend = async (req, res, next) => {
  try {
    const trends = await getGpaTrend();
    res.json({ trends });
  } catch (error) {
    next(error);
  }
};

export const departmentPerformance = async (req, res, next) => {
  try {
    const performance = await getDepartmentPerformance();
    res.json({ performance });
  } catch (error) {
    next(error);
  }
};

export const riskDistribution = async (req, res, next) => {
  try {
    const distribution = await getRiskDistribution();
    res.json({ distribution });
  } catch (error) {
    next(error);
  }
};

export const facultyPerformance = async (req, res, next) => {
  try {
    const { department } = req.query;
    const performance = await getFacultyPerformance(department);
    res.json({ performance });
  } catch (error) {
    next(error);
  }
};

export const studentDashboard = async (req, res, next) => {
  try {
    const dashboard = await getStudentDashboard(req.params.id);
    res.json(dashboard);
  } catch (error) {
    next(error);
  }
};
