import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Student from './models/Student.js';
import Faculty from './models/Faculty.js';
import { connectDB } from './config/db.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Student.deleteMany({});
    await Faculty.deleteMany({});

    console.log('Creating test users and data...');

    // Create Admin User
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@university.edu',
      password: 'password123',
      role: 'admin',
      department: 'Administration'
    });

    console.log('✓ Admin created:', adminUser.email);

    // Create Faculty Users
    const csFacultyUser = await User.create({
      name: 'Dr. Sarah Williams',
      email: 'faculty@university.edu',
      password: 'password123',
      role: 'faculty',
      department: 'Computer Science'
    });

    const eeFacultyUser = await User.create({
      name: 'Prof. James Chen',
      email: 'ee.faculty@university.edu',
      password: 'password123',
      role: 'faculty',
      department: 'Electrical Engineering'
    });

    console.log('✓ Faculty created:', csFacultyUser.email, eeFacultyUser.email);

    // Create Faculty Records
    await Faculty.create({
      facultyId: 'FAC001',
      userId: csFacultyUser._id,
      name: 'Dr. Sarah Williams',
      email: 'faculty@university.edu',
      department: 'Computer Science',
      courses: ['CS101', 'CS201', 'CS301']
    });

    await Faculty.create({
      facultyId: 'FAC002',
      userId: eeFacultyUser._id,
      name: 'Prof. James Chen',
      email: 'ee.faculty@university.edu',
      department: 'Electrical Engineering',
      courses: ['EE101', 'EE201']
    });

    // Create Student Users and Records
    const studentUsers = [
      { name: 'Aisha Khan', email: 'aisha@university.edu', department: 'Computer Science', semester: 6, gpa: 3.82, attendance: 94 },
      { name: 'Rahul Mehta', email: 'rahul@university.edu', department: 'Electrical Engineering', semester: 4, gpa: 2.41, attendance: 68 },
      { name: 'Sara Ahmed', email: 'sara@university.edu', department: 'Computer Science', semester: 6, gpa: 3.55, attendance: 88 },
      { name: 'James Wilson', email: 'james@university.edu', department: 'Mechanical Engineering', semester: 2, gpa: 2.98, attendance: 76 },
      { name: 'Priya Sharma', email: 'priya@university.edu', department: 'Business Administration', semester: 8, gpa: 3.91, attendance: 97 },
      { name: 'Omar Hassan', email: 'omar@university.edu', department: 'Civil Engineering', semester: 4, gpa: 1.85, attendance: 52 },
      { name: 'Emily Chen', email: 'emily@university.edu', department: 'Computer Science', semester: 2, gpa: 3.67, attendance: 91 },
      { name: 'David Brown', email: 'david@university.edu', department: 'Electrical Engineering', semester: 6, gpa: 2.73, attendance: 71 },
      { name: 'Fatima Ali', email: 'fatima@university.edu', department: 'Business Administration', semester: 4, gpa: 3.45, attendance: 86 },
      { name: 'student@university.edu', email: 'student@university.edu', department: 'Computer Science', semester: 3, gpa: 3.5, attendance: 85 }
    ];

    const createdStudents = [];

    for (const studentData of studentUsers) {
      const user = await User.create({
        name: studentData.name,
        email: studentData.email,
        password: 'password123',
        role: 'student',
        department: studentData.department
      });

      // Calculate risk level
      let riskLevel = 'low';
      if (studentData.gpa >= 3.0 && studentData.attendance > 80) {
        riskLevel = 'low';
      } else if (studentData.gpa >= 2.5 && studentData.attendance >= 70) {
        riskLevel = 'medium';
      } else {
        riskLevel = 'high';
      }

      const student = await Student.create({
        studentId: `STU${String(Date.now()).slice(-6)}`,
        userId: user._id,
        name: studentData.name,
        email: studentData.email,
        department: studentData.department,
        semester: studentData.semester,
        gpa: studentData.gpa,
        attendance: studentData.attendance,
        riskLevel,
        enrollmentYear: 2022,
        advisorId: studentData.department === 'Computer Science' ? csFacultyUser._id : 
                  studentData.department === 'Electrical Engineering' ? eeFacultyUser._id : null
      });

      createdStudents.push(student);
    }

    console.log(`✓ ${createdStudents.length} students created`);

    // Update faculty advised students
    await Faculty.findOneAndUpdate(
      { userId: csFacultyUser._id },
      {
        studentsAdvised: createdStudents
          .filter(s => s.department === 'Computer Science')
          .map(s => s._id)
      }
    );

    await Faculty.findOneAndUpdate(
      { userId: eeFacultyUser._id },
      {
        studentsAdvised: createdStudents
          .filter(s => s.department === 'Electrical Engineering')
          .map(s => s._id)
      }
    );

    console.log('✓ Faculty-student relationships set up');

    console.log('\n✅ Database seeded successfully!\n');

    console.log('Test Credentials:');
    console.log('================');
    console.log('\nAdmin:');
    console.log('  Email: admin@university.edu');
    console.log('  Password: password123');

    console.log('\nFaculty (Computer Science):');
    console.log('  Email: faculty@university.edu');
    console.log('  Password: password123');

    console.log('\nFaculty (Electrical Engineering):');
    console.log('  Email: ee.faculty@university.edu');
    console.log('  Password: password123');

    console.log('\nStudent:');
    console.log('  Email: student@university.edu');
    console.log('  Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
