const API_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

export const interventionService = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/interventions`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch interventions');
    const data = await response.json();
    return Array.isArray(data) ? data : (Array.isArray(data.interventions) ? data.interventions : []);
  },

  create: async (data) => {
    const response = await fetch(`${API_URL}/interventions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create intervention');
    return response.json();
  },

  getByStudent: async (studentId) => {
    const response = await fetch(`${API_URL}/interventions/student/${studentId}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch student interventions');
    const data = await response.json();
    return Array.isArray(data) ? data : (Array.isArray(data.interventions) ? data.interventions : []);
  },

  getByFaculty: async () => {
    const response = await fetch(`${API_URL}/interventions/faculty`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch faculty interventions');
    const data = await response.json();
    return Array.isArray(data) ? data : (Array.isArray(data.interventions) ? data.interventions : []);
  },

  update: async (id, data) => {
    const response = await fetch(`${API_URL}/interventions/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update intervention');
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/interventions/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete intervention');
    return response.json();
  }
};
