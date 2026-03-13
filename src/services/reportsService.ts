const API_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

export const reportsService = {
  getAll: async (filters: any = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, String(value));
    });

    const response = await fetch(`${API_URL}/reports?${params}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch reports');
    const data = await response.json();
    return Array.isArray(data) ? data : (Array.isArray(data.reports) ? data.reports : []);
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/reports/${id}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch report');
    return response.json();
  },

  generate: async (data: any) => {
    const response = await fetch(`${API_URL}/reports/generate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to generate report');
    return response.json();
  },

  download: async (id: string) => {
    const response = await fetch(`${API_URL}/reports/${id}/download`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to download report');
    return response.blob();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/reports/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete report');
    return response.json();
  }
};
