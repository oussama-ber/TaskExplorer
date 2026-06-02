import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import type { Goal, Task, RoutineBlock, User } from '../types';

const API_BASE_URL = 'http://localhost:5255/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Request interceptor: add token to every request
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Response interceptor: handle 401 errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await useAuthStore.getState().refreshAccessToken();
                const newToken = useAuthStore.getState().accessToken;
                processQueue(null, newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                // Dispatch event for SessionTimeoutModal
                window.dispatchEvent(new CustomEvent('session-expired'));
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: {
        id: string;
        email: string;
        name: string;
        onboardingCompleted: boolean;
    };
}

export const authApi = {
    login: (credentials: any) => api.post<AuthResponse>('/auth/login', credentials),
    refreshToken: (tokens: { accessToken: string; refreshToken: string }) =>
        api.post<AuthResponse>('/auth/refresh-token', tokens),
};

export const goalsApi = {
    getAll: () => api.get<Goal[]>('/goals'),
    create: (goal: Omit<Goal, 'id' | 'totalTasks' | 'completedTasks'>) =>
        api.post<string>('/goals', goal),
    update: (id: string, goal: Goal) => api.put(`/goals/${id}`, goal),
    delete: (id: string) => api.delete(`/goals/${id}`),
};

export const tasksApi = {
    getByGoal: (goalId: string) => api.get<Task[]>(`/tasks/goal/${goalId}`),
    create: (task: Omit<Task, 'id'>) => api.post<string>('/tasks', task),
    update: (id: string, task: Task) => api.put(`/tasks/${id}`, task),
    delete: (id: string) => api.delete(`/tasks/${id}`),
};

export const routinesApi = {
    getAll: () => api.get<RoutineBlock[]>('/routines'),
    create: (routine: Omit<RoutineBlock, 'id'>) =>
        api.post<string>('/routines', routine),
};

export interface DashboardStats {
    dailyTaskCount: number;
    weeklyTaskCount: number;
    monthlyTaskCount: number;
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    completionPercentage: number;
    weeklyActivity: Array<{ name: string; completed: number; added: number }>;
    workCapacity: Array<{ name: string; value: number; color: string }>;
    currentGoalProgress: {
        goalTitle: string;
        completedTasks: number;
        totalTasks: number;
        percentage: number;
    } | null;
}

export const dashboardApi = {
    getStats: () => api.get<DashboardStats>('/dashboard/stats'),
};

export const usersApi = {
    getCurrentUser: () => api.get<User>('/users/me'),
    completeOnboarding: () => api.post<boolean>('/users/complete-onboarding'),
};

export default api;
