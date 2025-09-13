import axios from 'axios';

// Replace the API_BASE_URL line with:
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Lead API calls
export const leadAPI = {
  // Get all leads
  getAll: () => api.get('/leads'),
  
  // Get a single lead by ID
  getById: (id) => api.get(`/leads/${id}`),
  
  // Create a new lead
  create: (leadData) => api.post('/leads', leadData),
  
  // Update a lead
  update: (id, leadData) => api.patch(`/leads/${id}`, leadData),
  
  // Delete a lead
  delete: (id) => api.delete(`/leads/${id}`),
};

export default api;