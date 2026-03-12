import api from './api';

export const registerUser = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
};

export const loginUser = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

export const logoutUser = async () => {
    try {
        await api.post('/auth/logout');
    } catch { }
};

export const forgotPassword = async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
};