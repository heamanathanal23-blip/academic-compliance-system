import jwt from 'jsonwebtoken';

export const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

export const validateEmail = (email) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

export const calculateRiskLevel = (gpa, attendance) => {
  if (gpa >= 3.0 && attendance > 80) {
    return 'low';
  } else if (gpa >= 2.5 && attendance >= 70) {
    return 'medium';
  } else {
    return 'high';
  }
};
