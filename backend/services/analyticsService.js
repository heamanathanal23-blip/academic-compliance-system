import Student from '../models/Student.js';
import User from '../models/User.js';
import Intervention from '../models/Intervention.js';
import Faculty from '../models/Faculty.js';

export const getAnalyticsKPI = async () => {
  try {
    const students = await Student.find();
    
    const totalStudents = students.length;
    const avgGpa = students.length > 0
      ? (students.reduce((sum, s) => sum + s.gpa, 0) / students.length).toFixed(2)
      : 0;
    const avgAttendance = students.length > 0
      ? (students.reduce((sum, s) => sum + s.attendance, 0) / students.length).toFixed(1)
      : 0;
    const atRiskCount = students.filter(s => s.riskLevel === 'high').length;
    const mediumRiskCount = students.filter(s => s.riskLevel === 'medium').length;

    return {
      totalStudents,
      avgGpa: parseFloat(avgGpa),
      avgAttendance: parseFloat(avgAttendance),
      atRiskCount,
      mediumRiskCount,
      lowRiskCount: totalStudents - atRiskCount - mediumRiskCount
    };
  } catch (error) {
    throw error;
  }
};

export const getGpaTrend = async () => {
  try {
    // Sample data for 8 semesters
    const semesters = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'];
    const students = await Student.find();

    const trends = semesters.map((sem, index) => {
      const semNum = index + 1;
      const semesterStudents = students.filter(s => s.semester >= semNum);
      
      if (semesterStudents.length === 0) {
        return { semester: sem, avgGpa: 0, topPerformer: 0 };
      }

      const avgGpa = semesterStudents.reduce((sum, s) => sum + s.gpa, 0) / semesterStudents.length;
      const topGpa = Math.max(...semesterStudents.map(s => s.gpa));

      return {
        semester: sem,
        avgGpa: parseFloat(avgGpa.toFixed(2)),
        topPerformer: topGpa
      };
    });

    return trends;
  } catch (error) {
    throw error;
  }
};

export const getDepartmentPerformance = async () => {
  try {
    const students = await Student.find();
    const departments = [
      'Computer Science',
      'Electrical Engineering',
      'Mechanical Engineering',
      'Business Administration',
      'Civil Engineering'
    ];

    const performance = departments.map(dept => {
      const deptStudents = students.filter(s => s.department === dept);
      const avgGpa = deptStudents.length > 0
        ? (deptStudents.reduce((sum, s) => sum + s.gpa, 0) / deptStudents.length).toFixed(2)
        : 0;
      const studentCount = deptStudents.length;

      return {
        department: dept,
        avgGpa: parseFloat(avgGpa),
        studentCount
      };
    });

    return performance;
  } catch (error) {
    throw error;
  }
};

export const getRiskDistribution = async () => {
  try {
    const students = await Student.find();

    const lowRisk = students.filter(s => s.riskLevel === 'low').length;
    const mediumRisk = students.filter(s => s.riskLevel === 'medium').length;
    const highRisk = students.filter(s => s.riskLevel === 'high').length;

    return {
      lowRisk,
      mediumRisk,
      highRisk,
      total: students.length
    };
  } catch (error) {
    throw error;
  }
};

export const getFacultyPerformance = async (departmentFilter = null) => {
  try {
    let query = { role: 'faculty' };
    if (departmentFilter) query.department = departmentFilter;

    const faculty = await User.find(query);
    
    const performance = await Promise.all(
      faculty.map(async (f) => {
        const advisedStudents = await Student.find({ advisorId: f._id });
        
        let avgGpa = 0;
        let passRate = 0;
        let riskCount = 0;

        if (advisedStudents.length > 0) {
          avgGpa = (advisedStudents.reduce((sum, s) => sum + s.gpa, 0) / advisedStudents.length).toFixed(2);
          passRate = ((advisedStudents.filter(s => s.gpa >= 2.0).length / advisedStudents.length) * 100).toFixed(1);
          riskCount = advisedStudents.filter(s => s.riskLevel === 'high').length;
        }

        return {
          facultyId: f._id,
          name: f.name,
          department: f.department,
          studentCount: advisedStudents.length,
          avgGpa: parseFloat(avgGpa),
          passRate: parseFloat(passRate),
          riskCount
        };
      })
    );

    return performance;
  } catch (error) {
    throw error;
  }
};

export const getStudentDashboard = async (studentId) => {
  try {
    const student = await Student.findById(studentId).populate('advisorId', 'name email');
    
    if (!student) {
      throw new Error('Student not found');
    }

    const interventions = await Intervention.find({ 
      studentId,
      status: { $ne: 'resolved' }
    }).sort({ createdAt: -1 });

    return {
      student,
      interventions,
      gpaHistory: student.gpaHistory || [],
      attendanceHistory: student.attendanceHistory || []
    };
  } catch (error) {
    throw error;
  }
};
