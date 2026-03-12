import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../constants/config';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
});

api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('jwt_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await SecureStore.deleteItemAsync('jwt_token');
            await SecureStore.deleteItemAsync('user_data');
        }
        return Promise.reject(error);
    }
);

export default api;