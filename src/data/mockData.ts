export type RiskLevel = "low" | "medium" | "high";

export interface Student {
  id: string;
  name: string;
  department: string;
  semester: number;
  gpa: number;
  attendance: number;
  risk: RiskLevel;
  email: string;
  enrollmentYear: number;
}

export interface GpaTrend {
  semester: string;
  avgGpa: number;
  topPerformer: number;
}

export interface DepartmentStat {
  department: string;
  avgGpa: number;
  studentCount: number;
}

export const students: Student[] = [
  { id: "STU001", name: "Aisha Khan", department: "Computer Science", semester: 6, gpa: 3.82, attendance: 94, risk: "low", email: "aisha.k@univ.edu", enrollmentYear: 2022 },
  { id: "STU002", name: "Rahul Mehta", department: "Electrical Engineering", semester: 4, gpa: 2.41, attendance: 68, risk: "high", email: "rahul.m@univ.edu", enrollmentYear: 2023 },
  { id: "STU003", name: "Sara Ahmed", department: "Computer Science", semester: 6, gpa: 3.55, attendance: 88, risk: "low", email: "sara.a@univ.edu", enrollmentYear: 2022 },
  { id: "STU004", name: "James Wilson", department: "Mechanical Engineering", semester: 2, gpa: 2.98, attendance: 76, risk: "medium", email: "james.w@univ.edu", enrollmentYear: 2024 },
  { id: "STU005", name: "Priya Sharma", department: "Business Administration", semester: 8, gpa: 3.91, attendance: 97, risk: "low", email: "priya.s@univ.edu", enrollmentYear: 2021 },
  { id: "STU006", name: "Omar Hassan", department: "Civil Engineering", semester: 4, gpa: 1.85, attendance: 52, risk: "high", email: "omar.h@univ.edu", enrollmentYear: 2023 },
  { id: "STU007", name: "Emily Chen", department: "Computer Science", semester: 2, gpa: 3.67, attendance: 91, risk: "low", email: "emily.c@univ.edu", enrollmentYear: 2024 },
  { id: "STU008", name: "David Brown", department: "Electrical Engineering", semester: 6, gpa: 2.73, attendance: 71, risk: "medium", email: "david.b@univ.edu", enrollmentYear: 2022 },
  { id: "STU009", name: "Fatima Ali", department: "Business Administration", semester: 4, gpa: 3.45, attendance: 86, risk: "low", email: "fatima.a@univ.edu", enrollmentYear: 2023 },
  { id: "STU010", name: "Alex Turner", department: "Mechanical Engineering", semester: 6, gpa: 2.12, attendance: 59, risk: "high", email: "alex.t@univ.edu", enrollmentYear: 2022 },
  { id: "STU011", name: "Nadia Patel", department: "Computer Science", semester: 4, gpa: 3.28, attendance: 83, risk: "low", email: "nadia.p@univ.edu", enrollmentYear: 2023 },
  { id: "STU012", name: "Carlos Rivera", department: "Civil Engineering", semester: 8, gpa: 2.65, attendance: 73, risk: "medium", email: "carlos.r@univ.edu", enrollmentYear: 2021 },
  { id: "STU013", name: "Lily Wang", department: "Business Administration", semester: 2, gpa: 3.76, attendance: 92, risk: "low", email: "lily.w@univ.edu", enrollmentYear: 2024 },
  { id: "STU014", name: "Mohammed Yusuf", department: "Electrical Engineering", semester: 8, gpa: 1.94, attendance: 48, risk: "high", email: "mohammed.y@univ.edu", enrollmentYear: 2021 },
  { id: "STU015", name: "Sophie Martin", department: "Mechanical Engineering", semester: 4, gpa: 3.11, attendance: 80, risk: "medium", email: "sophie.m@univ.edu", enrollmentYear: 2023 },
  { id: "STU016", name: "Ryan O'Brien", department: "Computer Science", semester: 8, gpa: 3.95, attendance: 98, risk: "low", email: "ryan.o@univ.edu", enrollmentYear: 2021 },
  { id: "STU017", name: "Zara Hussain", department: "Civil Engineering", semester: 2, gpa: 2.88, attendance: 77, risk: "medium", email: "zara.h@univ.edu", enrollmentYear: 2024 },
  { id: "STU018", name: "Tom Nguyen", department: "Business Administration", semester: 6, gpa: 2.35, attendance: 63, risk: "high", email: "tom.n@univ.edu", enrollmentYear: 2022 },
  { id: "STU019", name: "Isabella Garcia", department: "Electrical Engineering", semester: 2, gpa: 3.42, attendance: 85, risk: "low", email: "isabella.g@univ.edu", enrollmentYear: 2024 },
  { id: "STU020", name: "Arjun Singh", department: "Mechanical Engineering", semester: 8, gpa: 3.58, attendance: 90, risk: "low", email: "arjun.s@univ.edu", enrollmentYear: 2021 },
];

export const gpaTrends: GpaTrend[] = [
  { semester: "Sem 1", avgGpa: 3.02, topPerformer: 3.85 },
  { semester: "Sem 2", avgGpa: 2.95, topPerformer: 3.88 },
  { semester: "Sem 3", avgGpa: 3.08, topPerformer: 3.91 },
  { semester: "Sem 4", avgGpa: 3.12, topPerformer: 3.87 },
  { semester: "Sem 5", avgGpa: 3.05, topPerformer: 3.93 },
  { semester: "Sem 6", avgGpa: 3.18, topPerformer: 3.95 },
  { semester: "Sem 7", avgGpa: 3.22, topPerformer: 3.92 },
  { semester: "Sem 8", avgGpa: 3.15, topPerformer: 3.90 },
];

export const departmentStats: DepartmentStat[] = [
  { department: "Computer Science", avgGpa: 3.65, studentCount: 5 },
  { department: "Electrical Engineering", avgGpa: 2.63, studentCount: 4 },
  { department: "Mechanical Engineering", avgGpa: 2.95, studentCount: 4 },
  { department: "Business Administration", avgGpa: 3.37, studentCount: 4 },
  { department: "Civil Engineering", avgGpa: 2.46, studentCount: 3 },
];

export const getKPIs = () => {
  const totalStudents = students.length;
  const avgGpa = +(students.reduce((s, st) => s + st.gpa, 0) / totalStudents).toFixed(2);
  const avgAttendance = +(students.reduce((s, st) => s + st.attendance, 0) / totalStudents).toFixed(1);
  const atRiskCount = students.filter(s => s.risk === "high").length;
  return { totalStudents, avgGpa, avgAttendance, atRiskCount };
};
