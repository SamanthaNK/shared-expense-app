import { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext({});

const TOKEN_KEY = 'jwt_token';
const ONBOARDING_KEY = 'has_seen_onboarding';

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const bootstrap = async () => {
            try {
                const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
                const seenOnboarding = await SecureStore.getItemAsync(ONBOARDING_KEY);
                if (storedToken) setToken(storedToken);
                if (seenOnboarding === 'true') setHasSeenOnboarding(true);
            } catch (e) {
                console.warn('Failed to load auth state from storage', e);
            } finally {
                setIsLoading(false);
            }
        };
        bootstrap();
    }, []);

    const login = async (newToken) => {
        await SecureStore.setItemAsync(TOKEN_KEY, newToken);
        setToken(newToken);
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        setToken(null);
    };

    const completeOnboarding = async () => {
        await SecureStore.setItemAsync(ONBOARDING_KEY, 'true');
        setHasSeenOnboarding(true);
    };

    const resetOnboarding = async () => {
        await SecureStore.deleteItemAsync(ONBOARDING_KEY);
        setHasSeenOnboarding(false);
    };

    return (
        <AuthContext.Provider value={{ token, isLoading, hasSeenOnboarding, login, logout, completeOnboarding, resetOnboarding }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);