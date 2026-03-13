const API_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

export const predictionService = {
  getForStudent: async (studentId) => {
    const response = await fetch(`${API_URL}/predictions/student/${studentId}`, {
      headers: getHeaders()
    });
    return response.json();
  },

  getAll: async () => {
    const response = await fetch(`${API_URL}/predictions`, {
      headers: getHeaders()
    });
    return response.json();
  }
};
