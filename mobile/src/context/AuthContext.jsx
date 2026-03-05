import { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check if a token already exists when app opens
    useEffect(() => {
        const loadToken = async () => {
            const stored = await SecureStore.getItemAsync('jwt_token');
            if (stored) setToken(stored);
            setIsLoading(false);
        };
        loadToken();
    }, []);

    const login = async (newToken) => {
        await SecureStore.setItemAsync('jwt_token', newToken);
        setToken(newToken);
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync('jwt_token');
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);