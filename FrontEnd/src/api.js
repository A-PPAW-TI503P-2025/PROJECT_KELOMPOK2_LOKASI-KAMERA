// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Tambahkan token otomatis jika ada di local storage (untuk nanti request perlu auth)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;