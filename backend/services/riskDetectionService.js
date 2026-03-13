import { calculateRiskLevel } from '../utils/helpers.js';

export const detectRisk = (gpa, attendance) => {
  return calculateRiskLevel(gpa, attendance);
};

export const generateRiskRecommendations = (gpa, attendance, riskLevel) => {
  const recommendations = [];

  if (attendance < 70) {
    recommendations.push('Improve attendance rate immediately - aim for 85%+');
  } else if (attendance < 80) {
    recommendations.push('Attendance needs improvement - target 85%+');
  }

  if (gpa < 2.5) {
    recommendations.push('Critical GPA - seek tutoring and academic counseling');
  } else if (gpa < 3.0) {
    recommendations.push('GPA below target - consider study groups and office hours');
  }

  if (riskLevel === 'high') {
    recommendations.push('Schedule meeting with academic advisor');
    recommendations.push('Consider reduced course load');
  }

  if (recommendations.length === 0) {
    recommendations.push('Maintain current academic performance');
  }

  return recommendations;
};

export const calculatePredictedRisk = (currentGPA, currentAttendance, gpaHistory = [], attendanceHistory = []) => {
  let gpaChangePercentage = 0;
  let attendanceChangePercentage = 0;
  let riskProbability = 0;

  // Calculate GPA trend
  if (gpaHistory.length >= 2) {
    const previousGPA = gpaHistory[gpaHistory.length - 2]?.gpa || currentGPA;
    gpaChangePercentage = ((currentGPA - previousGPA) / previousGPA) * 100;
  }

  // Calculate attendance trend
  if (attendanceHistory.length >= 2) {
    const previousAttendance = attendanceHistory[attendanceHistory.length - 2]?.attendance || currentAttendance;
    attendanceChangePercentage = ((currentAttendance - previousAttendance) / previousAttendance) * 100;
  }

  // Calculate risk probability (0-100)
  let baseRisk = 0;

  if (currentGPA < 2.5) baseRisk += 40;
  else if (currentGPA < 3.0) baseRisk += 20;

  if (currentAttendance < 70) baseRisk += 40;
  else if (currentAttendance < 80) baseRisk += 20;

  // Trend impact
  if (gpaChangePercentage < -5) baseRisk += 15;
  if (attendanceChangePercentage < -5) baseRisk += 15;

  riskProbability = Math.min(baseRisk, 95);

  // Predict GPA change
  const predictedGPAChange = (gpaChangePercentage / 100) * currentGPA;
  const predictedGPA = Math.max(0, Math.min(4.0, currentGPA + predictedGPAChange));

  // Predict attendance change (smaller fluctuation)
  const predictedAttendanceChange = (attendanceChangePercentage / 100) * currentAttendance * 0.5;
  const predictedAttendance = Math.max(0, Math.min(100, currentAttendance + predictedAttendanceChange));

  return {
    riskProbability: Math.round(riskProbability),
    predictedGPA: Math.round(predictedGPA * 100) / 100,
    predictedAttendance: Math.round(predictedAttendance)
  };
};
