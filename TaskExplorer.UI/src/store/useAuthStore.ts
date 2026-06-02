import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../services/api';
import type { User } from '../types';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    login: (credentials: any) => Promise<void>;
    register: (data: { email: string; password: string; fullName: string }) => Promise<void>;
    logout: () => void;
    setTokens: (accessToken: string, refreshToken: string) => void;
    refreshAccessToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (credentials) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authApi.login(credentials);
                    const { accessToken, refreshToken, user: userInfo } = response.data;

                    // Map userInfo to User type if needed, for now assuming basic fields
                    const userObj = {
                        id: userInfo.id,
                        email: userInfo.email,
                        name: userInfo.name,
                        onboardingCompleted: userInfo.onboardingCompleted,
                    } as User;

                    set({
                        accessToken,
                        refreshToken,
                        user: userObj,
                        isAuthenticated: true,
                        isLoading: false,
                    });

                    console.log("user from store", get().user);

                } catch (error: any) {
                    set({
                        error: error.response?.data?.message || 'Login failed',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            register: async (data) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authApi.register(data);
                    const { accessToken, refreshToken, user: userInfo } = response.data;

                    const userObj = {
                        id: userInfo.id,
                        email: userInfo.email,
                        name: userInfo.name,
                        onboardingCompleted: userInfo.onboardingCompleted,
                    } as User;

                    set({
                        accessToken,
                        refreshToken,
                        user: userObj,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error: any) {
                    set({
                        error: error.response?.data?.message || 'Registration failed',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            logout: () => {
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                });
            },

            setTokens: (accessToken, refreshToken) => {
                set({ accessToken, refreshToken });
            },

            refreshAccessToken: async () => {
                const { accessToken, refreshToken } = get();
                if (!accessToken || !refreshToken) return;

                try {
                    const response = await authApi.refreshToken({ accessToken, refreshToken });
                    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
                    set({
                        accessToken: newAccessToken,
                        refreshToken: newRefreshToken,
                    });
                } catch (error) {
                    get().logout();
                    throw error;
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
