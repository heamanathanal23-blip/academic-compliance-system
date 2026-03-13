const API_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

export const alertService = {
  getAlerts: async (filters?: any) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined) params.append(key, String(value));
      });
    }
    const response = await fetch(`${API_URL}/alerts?${params}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch alerts');
    const data = await response.json();
    return Array.isArray(data.alerts) ? data.alerts : (Array.isArray(data) ? data : []);
  },

  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) params.append(key, String(value));
    });

    const response = await fetch(`${API_URL}/alerts?${params}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch alerts');
    const data = await response.json();
    return Array.isArray(data.alerts) ? data.alerts : (Array.isArray(data) ? data : []);
  },

  getUnresolved: async () => {
    const response = await fetch(`${API_URL}/alerts/unresolved`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch unresolved alerts');
    const data = await response.json();
    return Array.isArray(data.alerts) ? data.alerts : (Array.isArray(data) ? data : []);
  },

  getByStudent: async (studentId: string) => {
    const response = await fetch(`${API_URL}/alerts/student/${studentId}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch student alerts');
    return response.json();
  },

  resolve: async (alertId: string) => {
    const response = await fetch(`${API_URL}/alerts/${alertId}/resolve`, {
      method: 'PUT',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to resolve alert');
    return response.json();
  }
};
