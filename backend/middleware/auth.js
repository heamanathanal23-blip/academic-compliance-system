import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  next();
};

export const requireFaculty = (req, res, next) => {
  if (!req.user || (req.user.role !== 'faculty' && req.user.role !== 'admin')) {
    return res.status(403).json({ message: 'Access denied. Faculty role required.' });
  }
  next();
};

export const requireStudent = (req, res, next) => {
  if (!req.user || req.user.role !== 'student') {
    return res.status(403).json({ message: 'Access denied. Student role required.' });
  }
  next();
};

export const requireAdminOrFaculty = (req, res, next) => {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'faculty')) {
    return res.status(403).json({ message: 'Access denied. Admin or Faculty role required.' });
  }
  next();
};
