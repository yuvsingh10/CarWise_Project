import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});


API.interceptors.request.use((config) => {
  // Check tokens in order of priority: superadmin -> admin -> user
  const superAdminToken = localStorage.getItem('superAdminToken');
  const adminToken = localStorage.getItem('adminToken');
  const userToken = localStorage.getItem('token');
  
  // Use the first available token (priority order)
  const token = superAdminToken || adminToken || userToken;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
