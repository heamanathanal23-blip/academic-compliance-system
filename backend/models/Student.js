import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    unique: true,
    required: [true, 'Please provide a student ID']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide a name']
  },
  email: {
    type: String,
    required: true
  },
  department: {
    type: String,
    enum: [
      'Computer Science',
      'Electrical Engineering',
      'Mechanical Engineering',
      'Business Administration',
      'Civil Engineering'
    ]
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  gpa: {
    type: Number,
    required: true,
    min: 0,
    max: 4.0
  },
  attendance: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },
  enrollmentYear: {
    type: Number,
    required: true
  },
  advisorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  gpaHistory: [{
    semester: Number,
    gpa: Number,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  attendanceHistory: [{
    semester: Number,
    attendance: Number,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
studentSchema.index({ department: 1 });
studentSchema.index({ riskLevel: 1 });
studentSchema.index({ email: 1 });

const Student = mongoose.model('Student', studentSchema);

export default Student;
