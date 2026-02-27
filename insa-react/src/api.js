import axios from 'axios';

const getBackendUrl = () => {
  const currentUrl = window.location.href;
  const urlObj = new URL(currentUrl);

  
  if (currentUrl.includes('github.dev')) {
    const backendHostname = urlObj.hostname.replace('-3001', '-3000');
    return `https://${backendHostname}/api`;
  }


  if (!currentUrl.includes('localhost')) {
    return `${urlObj.origin}/api`;
  }


  return 'http://localhost:3000/api';
};

const api = axios.create({
  baseURL: getBackendUrl(), 
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