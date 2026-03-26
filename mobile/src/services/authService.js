import api from './api';

export const registerUser = async (name, email, password, captchaToken) => {
    const response = await api.post('/auth/register', {
        name,
        email,
        password,
        captchaToken,
    });
    return response.data;
};

export const loginUser = async (email, password, captchaToken) => {
    const response = await api.post('/auth/login', {
        email,
        password,
        captchaToken,
    });
    return response.data;
};

export const logoutUser = async () => {
    try {
        await api.post('/auth/logout');
    } catch { /* ignore — token is already deleted locally */ }
};

export const forgotPassword = async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
};

export const resetPassword = async (token, newPassword) => {
    const response = await api.post('/auth/reset-password', {
        token,
        newPassword,
    });
    return response.data;
};