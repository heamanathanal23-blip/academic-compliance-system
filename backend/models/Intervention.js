import mongoose from 'mongoose';

const interventionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  issue: {
    type: String,
    required: [true, 'Please describe the issue'],
    enum: [
      'Low GPA',
      'Poor Attendance',
      'Academic Struggle',
      'Behavioral Issue',
      'Health Concern',
      'Other'
    ]
  },
  description: {
    type: String,
    required: true
  },
  actionTaken: {
    type: String,
    required: [true, 'Please describe the action taken'],
    enum: [
      'Counseling Session',
      'Tutoring Arranged',
      'Course Change',
      'Study Plan Created',
      'Referral to Support Services',
      'Other'
    ]
  },
  actionDetails: {
    type: String
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved'],
    default: 'open'
  },
  followUpDate: Date,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Intervention = mongoose.model('Intervention', interventionSchema);

export default Intervention;
