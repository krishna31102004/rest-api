// src/api.js

// Existing imports...
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:3000';

const api = axios.create({
    baseURL: API_URL,
});

// Add a request interceptor to include the Authorization header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Check if error response exists
        if (error.response) {
            const errorMessage = error.response.data?.message || 'An unexpected error occurred';
            toast.error(`Error: ${errorMessage}`);
        } else {
            toast.error('Network error: Please check your connection.');
        }
        return Promise.reject(error);
    }
);

export const getProfile = async () => {
    try {
        const response = await api.get('/user/profile');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default api;
