import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  currentGPA: Number,
  currentAttendance: Number,
  predictedRisk: {
    type: String,
    enum: ['low', 'medium', 'high']
  },
  riskProbability: {
    type: Number,
    min: 0,
    max: 100
  },
  predictedGPA: Number,
  predictedAttendance: Number,
  factors: [{
    name: String,
    impact: String // positive, negative
  }],
  recommendations: [String],
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
predictionSchema.index({ studentId: 1 });
predictionSchema.index({ predictedRisk: 1 });

const Prediction = mongoose.model('Prediction', predictionSchema);

export default Prediction;
