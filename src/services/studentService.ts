const API_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

export const studentService = {
  getStudents: async (filters: any = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, String(value));
    });

    const response = await fetch(`${API_URL}/students?${params}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch students');
    const data = await response.json();
    return Array.isArray(data) ? data : (Array.isArray(data.students) ? data.students : []);
  },

  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, String(value));
    });

    const response = await fetch(`${API_URL}/students?${params}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch students');
    const data = await response.json();
    return Array.isArray(data) ? data : (Array.isArray(data.students) ? data.students : []);
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/students/${id}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch student');
    return response.json();
  },

  create: async (data: any) => {
    const response = await fetch(`${API_URL}/students`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create student');
    return response.json();
  },

  update: async (id: string, data: any) => {
    const response = await fetch(`${API_URL}/students/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update student');
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/students/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete student');
    return response.json();
  },

  search: async (query: string) => {
    return studentService.getAll({ search: query });
  }
};
