import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  reason: {
    type: String,
    required: true,
    enum: [
      'Low Attendance',
      'GPA Drop',
      'High Risk Prediction',
      'Failing Grade Risk',
      'Excessive Absences',
      'Other'
    ]
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  description: String,
  resolved: {
    type: Boolean,
    default: false
  },
  resolvedAt: Date,
  acknowledgedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  acknowledgedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
alertSchema.index({ studentId: 1 });
alertSchema.index({ severity: 1 });
alertSchema.index({ resolved: 1 });

const Alert = mongoose.model('Alert', alertSchema);

export default Alert;
