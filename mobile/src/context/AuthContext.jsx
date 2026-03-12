import { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext({});

const TOKEN_KEY = 'jwt_token';
const USER_KEY = 'user_data';
const ONBOARDING_KEY = 'has_seen_onboarding';

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const bootstrap = async () => {
            try {
                const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
                const storedUser = await SecureStore.getItemAsync(USER_KEY);
                const seenOnboarding = await SecureStore.getItemAsync(ONBOARDING_KEY);

                if (storedToken) setToken(storedToken);
                if (storedUser) setUser(JSON.parse(storedUser));
                if (seenOnboarding === 'true') setHasSeenOnboarding(true);
            } catch (e) {
                console.warn('Failed to restore auth state:', e);
            } finally {
                setIsLoading(false);
            }
        };
        bootstrap();
    }, []);

    const login = async (newToken, userData) => {
        await SecureStore.setItemAsync(TOKEN_KEY, newToken);
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(USER_KEY);
        setToken(null);
        setUser(null);
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
        <AuthContext.Provider value={{
            token,
            user,
            isLoading,
            hasSeenOnboarding,
            login,
            logout,
            completeOnboarding,
            resetOnboarding,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);