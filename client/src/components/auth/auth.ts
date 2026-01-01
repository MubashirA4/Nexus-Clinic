// src/components/auth/auth.ts
import { useState, useEffect } from 'react';

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
    age?: number;
    gender?: string;
    address?: string;
    image?: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    login: (token: string, userData: User, rememberMe?: boolean) => void;
    logout: () => void;
}

export const useAuth = (): AuthState => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on component mount
        const checkAuth = () => {
            const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
            const userData = localStorage.getItem('userData') || sessionStorage.getItem('userData');

            if (token && userData) {
                try {
                    const parsedUser = JSON.parse(userData) as User;
                    setIsAuthenticated(true);
                    setUser(parsedUser);
                } catch (error) {
                    console.error('Error parsing user data:', error);
                    // Clear invalid data
                    localStorage.removeItem('userData');
                    sessionStorage.removeItem('userData');
                }
            }
            setLoading(false);
        };

        checkAuth();

        // Listen for storage changes (for logout from other tabs)
        const handleStorageChange = () => {
            checkAuth();
        };

        window.addEventListener('storage', handleStorageChange);
        // Also listen for an in-tab auth change event (fired after login/logout in the same tab)
        window.addEventListener('authChanged', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('authChanged', handleStorageChange);
        };
    }, []); // end useEffect

    const login = (token: string, userData: User, rememberMe = false) => {
        if (rememberMe) {
            localStorage.setItem('authToken', token);
            localStorage.setItem('userData', JSON.stringify(userData));
        } else {
            sessionStorage.setItem('authToken', token);
            sessionStorage.setItem('userData', JSON.stringify(userData));
        }
        setIsAuthenticated(true);
        setUser(userData);
        // Notify other listeners/tabs
        window.dispatchEvent(new Event('authChanged'));
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('userData');
        setIsAuthenticated(false);
        setUser(null);
        // Notify other listeners/tabs
        window.dispatchEvent(new Event('authChanged'));
        window.location.href = '/login'; // Redirect to login page
    };

    return {
        isAuthenticated,
        user,
        loading,
        login,
        logout
    };
};