import axios from 'axios';

const baseURL = import.meta.env.VITE_CMS_API_URL || 'http://localhost:8000/wp-json/idibia-cms/v1';
const apiKey = import.meta.env.VITE_CMS_API_KEY || '';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    ...(apiKey && { 'Authorization': `Bearer ${apiKey}` }),
  },
});
