const API_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

export const facultyService = {
  getAll: async (filters: any = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, String(value));
    });

    const response = await fetch(`${API_URL}/faculty?${params}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch faculty');
    const data = await response.json();
    return Array.isArray(data) ? data : (Array.isArray(data.faculty) ? data.faculty : []);
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/faculty/${id}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch faculty');
    return response.json();
  },

  create: async (data: any) => {
    const response = await fetch(`${API_URL}/faculty`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create faculty');
    return response.json();
  },

  update: async (id: string, data: any) => {
    const response = await fetch(`${API_URL}/faculty/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update faculty');
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/faculty/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete faculty');
    return response.json();
  }
};
