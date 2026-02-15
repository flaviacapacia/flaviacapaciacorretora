import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const imoveisAPI = {
  listar: () => api.get('/api/imoveis'),
  buscar: (id) => api.get(`/api/imoveis/${id}`),
};

export const blogAPI = {
  listar: () => api.get('/api/blog'),
  tendencias: () => api.get('/api/blog/trends'),
};

export const adsAPI = {
  gerar: (data) => api.post('/api/ads/generate', data),
  preview: (adId) => api.post('/api/ads/preview', { ad_id: adId }),
  publicar: (adId) => api.post('/api/ads/publish', { ad_id: adId }),
  listar: () => api.get('/api/ads'),
  buscar: (id) => api.get(`/api/ads/${id}`),
  performance: (id) => api.get(`/api/ads/${id}/performance`),
};

export default api;
