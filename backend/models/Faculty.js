import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
  facultyId: {
    type: String,
    unique: true,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
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
  courses: [{
    type: String
  }],
  studentsAdvised: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  averageStudentGPA: {
    type: Number,
    default: 0
  },
  passRate: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Faculty = mongoose.model('Faculty', facultySchema);

export default Faculty;
