const API_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

export const analyticsService = {
  getKPI: async () => {
    const response = await fetch(`${API_URL}/analytics/kpi`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch KPI data');
    const data = await response.json();
    return data.kpi || data;
  },

  getGpaTrend: async () => {
    const response = await fetch(`${API_URL}/analytics/gpa-trend`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch GPA trend');
    const data = await response.json();
    return data.trends || data;
  },

  getDepartmentPerformance: async () => {
    const response = await fetch(`${API_URL}/analytics/department-performance`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch department performance');
    const data = await response.json();
    return data.performance || data;
  },

  getRiskDistribution: async () => {
    const response = await fetch(`${API_URL}/analytics/risk-distribution`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch risk distribution');
    const data = await response.json();
    return data.distribution || data;
  },

  getFacultyPerformance: async (department = '') => {
    const params = department ? `?department=${department}` : '';
    const response = await fetch(`${API_URL}/analytics/faculty-performance${params}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch faculty performance');
    const data = await response.json();
    return data.performance || data;
  },

  getStudentDashboard: async (studentId: string) => {
    const response = await fetch(`${API_URL}/analytics/student-dashboard/${studentId}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch student dashboard');
    const data = await response.json();
    return data;
  }
};
