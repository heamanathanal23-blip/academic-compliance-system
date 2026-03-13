// In-memory mock data store for development
const mockData = {
  users: [
    {
      _id: '1',
      name: 'Admin User',
      email: 'admin@university.edu',
      password: '$2b$10$K8Z9xN2yL5pM6qR1tS7uD.e7f8gH9iJ0kL1mN2oP3qR4sT5uV6wX',
      role: 'admin',
      department: 'Administration',
      createdAt: new Date()
    },
    {
      _id: '2',
      name: 'Faculty Member',
      email: 'faculty@university.edu',
      password: '$2b$10$K8Z9xN2yL5pM6qR1tS7uD.e7f8gH9iJ0kL1mN2oP3qR4sT5uV6wX',
      role: 'faculty',
      department: 'Computer Science',
      createdAt: new Date()
    },
    {
      _id: '3',
      name: 'Test Student',
      email: 'student@university.edu',
      password: '$2b$10$K8Z9xN2yL5pM6qR1tS7uD.e7f8gH9iJ0kL1mN2oP3qR4sT5uV6wX',
      role: 'student',
      department: 'Computer Science',
      createdAt: new Date()
    }
  ],
  students: [
    {
      _id: '10',
      studentId: 'STU001',
      userId: '3',
      name: 'Test Student',
      email: 'student@university.edu',
      department: 'Computer Science',
      semester: 4,
      gpa: 3.5,
      attendance: 88,
      riskLevel: 'low',
      enrollmentYear: 2022,
      advisorId: '2',
      gpaHistory: [3.2, 3.3, 3.4, 3.5],
      attendanceHistory: [85, 86, 87, 88],
      createdAt: new Date()
    }
  ]
};

export const getMockUser = (email) => {
  return mockData.users.find(u => u.email === email);
};

export const getMockUserById = (id) => {
  return mockData.users.find(u => u._id === id);
};

export const createMockUser = (userData) => {
  const newUser = {
    _id: String(mockData.users.length + 1),
    ...userData,
    createdAt: new Date()
  };
  mockData.users.push(newUser);
  return newUser;
};

export const getAllMockStudents = (filters = {}) => {
  let students = [...mockData.students];
  
  if (filters.department) {
    students = students.filter(s => s.department === filters.department);
  }
  
  if (filters.riskLevel) {
    students = students.filter(s => s.riskLevel === filters.riskLevel);
  }
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    students = students.filter(s => 
      s.name.toLowerCase().includes(searchLower) ||
      s.email.toLowerCase().includes(searchLower) ||
      s.studentId.toLowerCase().includes(searchLower)
    );
  }
  
  return students;
};

export const getMockStudentById = (id) => {
  return mockData.students.find(s => s._id === id);
};

export const getMockStudents = () => mockData.students;
export const getMockUsers = () => mockData.users;
export const getMockData = () => mockData;
