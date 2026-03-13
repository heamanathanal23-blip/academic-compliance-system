import Intervention from '../models/Intervention.js';
import Student from '../models/Student.js';

export const createIntervention = async (req, res, next) => {
  try {
    const { studentId, issue, description, actionTaken, actionDetails, followUpDate, notes } = req.body;

    // Validate required fields
    if (!studentId || !issue || !description || !actionTaken) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const intervention = new Intervention({
      studentId,
      facultyId: req.user.userId,
      issue,
      description,
      actionTaken,
      actionDetails,
      followUpDate,
      notes,
      status: 'open'
    });

    await intervention.save();
    await intervention.populate('studentId', 'name email studentId');

    res.status(201).json({
      message: 'Intervention created successfully',
      intervention
    });
  } catch (error) {
    next(error);
  }
};

export const getInterventionsByStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const interventions = await Intervention.find({ studentId })
      .populate('facultyId', 'name email')
      .populate('studentId', 'name email studentId')
      .sort({ createdAt: -1 });

    res.json({
      count: interventions.length,
      interventions
    });
  } catch (error) {
    next(error);
  }
};

export const getInterventionsByFaculty = async (req, res, next) => {
  try {
    const interventions = await Intervention.find({ facultyId: req.user.userId })
      .populate('facultyId', 'name email')
      .populate('studentId', 'name email studentId')
      .sort({ createdAt: -1 });

    res.json({
      count: interventions.length,
      interventions
    });
  } catch (error) {
    next(error);
  }
};

export const updateIntervention = async (req, res, next) => {
  try {
    const { interventionId } = req.params;
    const { status, actionTaken, actionDetails, followUpDate, notes } = req.body;

    const intervention = await Intervention.findById(interventionId);

    if (!intervention) {
      return res.status(404).json({ message: 'Intervention not found' });
    }

    // Only faculty who created the intervention can update it
    if (intervention.facultyId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (status) intervention.status = status;
    if (actionTaken) intervention.actionTaken = actionTaken;
    if (actionDetails) intervention.actionDetails = actionDetails;
    if (followUpDate) intervention.followUpDate = followUpDate;
    if (notes) intervention.notes = notes;

    intervention.updatedAt = new Date();

    await intervention.save();
    await intervention.populate('studentId', 'name email studentId');

    res.json({
      message: 'Intervention updated successfully',
      intervention
    });
  } catch (error) {
    next(error);
  }
};

export const deleteIntervention = async (req, res, next) => {
  try {
    const { interventionId } = req.params;

    const intervention = await Intervention.findById(interventionId);

    if (!intervention) {
      return res.status(404).json({ message: 'Intervention not found' });
    }

    // Only faculty who created the intervention can delete it
    if (intervention.facultyId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Intervention.findByIdAndDelete(interventionId);

    res.json({
      message: 'Intervention deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
