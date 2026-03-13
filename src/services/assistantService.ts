const API_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

export const assistantService = {
  query: async (query: string) => {
    const response = await fetch(`${API_URL}/assistant/query`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ query })
    });
    return response.json();
  }
};
