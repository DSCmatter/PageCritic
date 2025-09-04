// src/context/AuthContext.tsx

import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import apiClient from '../api/axios';
import { AuthContext } from './AuthContext.ts';

export interface AuthContextType {
    user: { id: string; username: string; email: string } | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string) => Promise<void>;
    logout: () => void;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<{ id: string; username: string; email: string } | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));

    const fetchUser = async (userToken: string) => {
        try {
            const response = await apiClient.get('/auth/me', {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });
            setUser(response.data);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            logout();
        }
    };

    useEffect(() => {
        if (token) {
            fetchUser(token);
        } else {
            logout();
        }
    }, []);

    const login = async (userToken: string) => {
        localStorage.setItem('token', userToken);
        setToken(userToken);
        await fetchUser(userToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
    };

    const value = { user, token, isAuthenticated, login, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};