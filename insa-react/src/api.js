import axios from 'axios';

const getBackendUrl = () => {
  const currentUrl = window.location.href;
  
  if (currentUrl.includes('github.dev')) {
    const urlObj = new URL(currentUrl);
    // Properly swaps the frontend port (3001) for the backend port (3000)
    const backendHostname = urlObj.hostname.replace('-3001', '-3000');
    return `https://${backendHostname}/api`;
  }
  
  return 'http://localhost:3000/api';
};

const api = axios.create({
  baseURL: getBackendUrl(), // USE THE CALCULATED URL HERE
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('chronos_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

console.log("CHRONOS_API_LINK:", api.defaults.baseURL);

export default api;