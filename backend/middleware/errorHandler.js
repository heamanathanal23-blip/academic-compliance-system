export const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors)
      .map(error => error.message)
      .join(', ');
    return res.status(400).json({ message: messages });
  }

  // Duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({ message: `${field} already exists` });
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired' });
  }

  // Default error
  res.status(err.status || 500).json({
    message: err.message || 'Server error'
  });
};
