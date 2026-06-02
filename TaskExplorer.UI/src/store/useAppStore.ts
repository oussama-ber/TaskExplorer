import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './useAuthStore';
import type { Goal, Task, User, RoutineBlock, AvailabilitySettings } from '../types';
import { goalsApi, tasksApi, routinesApi, dashboardApi, usersApi, type DashboardStats } from '../services/api';

interface AppState {
    user: User | null;
    goals: Goal[];
    tasks: Task[];
    isLoading: boolean;
    error: string | null;
    activeGoalId: string | null;
    sidebarOpen: boolean;
    viewMode: 'comfortable' | 'compact';
    dashboardStats: DashboardStats | null;

    // Fetching
    fetchUser: () => Promise<void>;
    fetchGoals: () => Promise<void>;
    fetchTasks: (goalId: string) => Promise<void>;
    fetchRoutines: () => Promise<void>;
    fetchDashboardStats: () => Promise<void>;

    // Actions
    setActiveGoal: (goalId: string) => void;
    toggleSidebar: () => void;
    setViewMode: (mode: 'comfortable' | 'compact') => void;
    toggleTaskCompletion: (taskId: string) => void;
    addTask: (task: Omit<Task, 'id'>) => void;
    addGoal: (goal: Omit<Goal, 'id' | 'totalTasks' | 'completedTasks'>) => void;

    // UI State
    isCreateGoalModalOpen: boolean;
    toggleCreateGoalModal: () => void;
    isCreateTaskModalOpen: boolean;
    toggleCreateTaskModal: () => void;
    preselectedGoalId: string | null;
    openCreateTaskModal: (goalId?: string) => void;

    // Theme
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    setTheme: (theme: 'light' | 'dark') => void;

    // Goal CRUD
    updateGoal: (id: string, updates: Partial<Goal>) => void;
    deleteGoal: (id: string) => void;
    editingGoalId: string | null;
    openEditGoalModal: (goalId: string) => void;

    // Task CRUD
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    editingTaskId: string | null;
    openEditTaskModal: (taskId: string) => void;

    // Detail Views
    viewingGoalId: string | null;
    viewingTaskId: string | null;
    openGoalDetail: (goalId: string) => void;
    closeGoalDetail: () => void;
    openTaskDetail: (taskId: string) => void;
    closeTaskDetail: () => void;

    // Routine
    routineBlocks: RoutineBlock[];
    addRoutineBlock: (block: Omit<RoutineBlock, 'id'>) => void;
    updateRoutineBlock: (id: string, updates: Partial<RoutineBlock>) => void;
    deleteRoutineBlock: (id: string) => void;
    updateAvailability: (settings: Partial<AvailabilitySettings>) => void;

    // Onboarding
    completeOnboarding: (experience: User['userExperience']) => void;
    addGoalWithTasks: (goal: Omit<Goal, 'id' | 'userId' | 'totalTasks' | 'completedTasks'>, taskTitles: string[]) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            user: null,
            goals: [],
            tasks: [],
            isLoading: false,
            error: null,
            activeGoalId: null,
            sidebarOpen: true,
            viewMode: 'comfortable',
            isCreateGoalModalOpen: false,
            isCreateTaskModalOpen: false,
            theme: 'dark',
            dashboardStats: null,
            routineBlocks: [],
            editingGoalId: null,
            editingTaskId: null,
            preselectedGoalId: null,
            viewingGoalId: null,
            viewingTaskId: null,

            fetchUser: async () => {
                try {
                    const response = await usersApi.getCurrentUser();
                    set({ user: response.data });
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                }
            },

            fetchDashboardStats: async () => {
                try {
                    const response = await dashboardApi.getStats();
                    set({ dashboardStats: response.data });
                } catch (error) {
                    console.error('Failed to fetch dashboard stats:', error);
                }
            },

            fetchGoals: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await goalsApi.getAll();
                    set({ goals: response.data, isLoading: false });
                    if (response.data.length > 0 && !get().activeGoalId) {
                        set({ activeGoalId: response.data[0].id });
                    }
                } catch (err: any) {
                    set({ error: err.message, isLoading: false });
                }
            },

            fetchTasks: async (goalId: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await tasksApi.getByGoal(goalId);
                    set({ tasks: response.data, isLoading: false });
                } catch (err: any) {
                    set({ error: err.message, isLoading: false });
                }
            },

            fetchRoutines: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await routinesApi.getAll();
                    set({ routineBlocks: response.data, isLoading: false });
                } catch (err: any) {
                    set({ error: err.message, isLoading: false });
                }
            },

            setActiveGoal: (id) => {
                set({ activeGoalId: id });
                get().fetchTasks(id);
            },

            toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
            setViewMode: (mode) => set({ viewMode: mode }),
            toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
            setTheme: (theme) => set({ theme }),

            toggleCreateGoalModal: () => set((state) => ({
                isCreateGoalModalOpen: !state.isCreateGoalModalOpen,
                editingGoalId: !state.isCreateGoalModalOpen ? null : state.editingGoalId
            })),

            toggleCreateTaskModal: () => set((state) => ({
                isCreateTaskModalOpen: !state.isCreateTaskModalOpen,
                editingTaskId: !state.isCreateTaskModalOpen ? null : state.editingTaskId,
                preselectedGoalId: null
            })),

            openCreateTaskModal: (goalId) => set({
                isCreateTaskModalOpen: true,
                editingTaskId: null,
                preselectedGoalId: goalId || null
            }),

            toggleTaskCompletion: async (taskId) => {
                const task = get().tasks.find(t => t.id === taskId);
                if (!task) return;

                const updatedTask = { ...task, completed: !task.completed };
                try {
                    await tasksApi.update(taskId, updatedTask);
                    set((state) => ({
                        tasks: state.tasks.map(t => t.id === taskId ? updatedTask : t)
                    }));
                    get().fetchGoals();
                } catch (err: any) {
                    set({ error: err.message });
                }
            },

            addTask: async (newTask) => {
                try {
                    await tasksApi.create(newTask as Task);
                    await get().fetchTasks(newTask.goalId);
                    await get().fetchGoals();
                } catch (err: any) {
                    set({ error: err.message });
                }
            },

            addGoal: async (newGoal) => {
                try {
                    await goalsApi.create(newGoal);
                    await get().fetchGoals();
                } catch (err: any) {
                    set({ error: err.message });
                }
            },

            updateGoal: async (id, updates) => {
                const goal = get().goals.find(g => g.id === id);
                if (!goal) return;
                const updatedGoal = { ...goal, ...updates };
                try {
                    await goalsApi.update(id, updatedGoal);
                    await get().fetchGoals();
                } catch (err: any) {
                    set({ error: err.message });
                }
            },

            deleteGoal: async (id) => {
                try {
                    await goalsApi.delete(id);
                    set((state) => ({
                        goals: state.goals.filter(g => g.id !== id),
                        tasks: state.tasks.filter(t => t.goalId !== id),
                        activeGoalId: state.activeGoalId === id ? null : state.activeGoalId
                    }));
                } catch (err: any) {
                    set({ error: err.message });
                }
            },

            openEditGoalModal: (goalId) => set({ isCreateGoalModalOpen: true, editingGoalId: goalId }),

            updateTask: async (id, updates) => {
                const task = get().tasks.find(t => t.id === id);
                if (!task) return;
                const updatedTask = { ...task, ...updates };
                try {
                    await tasksApi.update(id, updatedTask);
                    await get().fetchTasks(task.goalId);
                    await get().fetchGoals();
                } catch (err: any) {
                    set({ error: err.message });
                }
            },

            deleteTask: async (id) => {
                const task = get().tasks.find(t => t.id === id);
                if (!task) return;
                try {
                    await tasksApi.delete(id);
                    await get().fetchTasks(task.goalId);
                    await get().fetchGoals();
                } catch (err: any) {
                    set({ error: err.message });
                }
            },

            openEditTaskModal: (taskId) => set({ isCreateTaskModalOpen: true, editingTaskId: taskId }),

            openGoalDetail: (goalId) => set({ viewingGoalId: goalId }),
            closeGoalDetail: () => set({ viewingGoalId: null }),
            openTaskDetail: (taskId) => set({ viewingTaskId: taskId }),
            closeTaskDetail: () => set({ viewingTaskId: null }),

            addRoutineBlock: async (block) => {
                try {
                    await routinesApi.create(block);
                    await get().fetchRoutines();
                } catch (err: any) {
                    set({ error: err.message });
                }
            },

            updateRoutineBlock: (id, updates) => set((state) => ({
                routineBlocks: state.routineBlocks.map(b => b.id === id ? { ...b, ...updates } : b)
            })),

            deleteRoutineBlock: (id) => set((state) => ({
                routineBlocks: state.routineBlocks.filter(b => b.id !== id)
            })),

            updateAvailability: (settings) => set((state) => {
                if (!state.user) return state;
                return {
                    user: {
                        ...state.user,
                        availability: {
                            ...(state.user.availability || {
                                sleepStart: '23:00',
                                sleepEnd: '07:00',
                                age: 25,
                                breakTimeMinutes: 30,
                            }),
                            ...settings
                        }
                    }
                };
            }),

            completeOnboarding: async (experience) => {
                if (!get().user) return;
                try {
                    await usersApi.completeOnboarding();
                    set((state) => ({
                        user: state.user ? { ...state.user, onboardingCompleted: true, userExperience: experience } : null
                    }));
                    // Sync with useAuthStore
                    const authUser = useAuthStore.getState().user;
                    if (authUser) {
                        useAuthStore.setState({
                            user: { ...authUser, onboardingCompleted: true }
                        });
                    }
                } catch (err: any) {
                    console.log(err);
                    set({ error: err.message });
                }
            },

            addGoalWithTasks: async (goalData, taskTitles) => {
                try {
                    const goalPayload = { ...goalData } as any;
                    delete goalPayload.id;
                    delete goalPayload.userId;
                    const response = await goalsApi.create(goalPayload);
                    const goalId = response.data;
                    for (const title of taskTitles) {
                        await tasksApi.create({
                            goalId,
                            title,
                            completed: false,
                            priority: 'MEDIUM',
                            category: goalData.tag || 'General',
                            notificationsEnabled: true,
                            isEnabled: true,
                            tag: goalData.tag
                        });
                    }
                    await get().fetchGoals();
                    // Set the new goal as active and load its tasks into the store
                    set({ activeGoalId: goalId });
                    await get().fetchTasks(goalId);
                } catch (err: any) {
                    set({ error: err.message });
                }
            },
        }),
        {
            name: 'task-explorer-storage',
            partialize: (state) => ({
                theme: state.theme,
                viewMode: state.viewMode,
                sidebarOpen: state.sidebarOpen,
            }),
        }
    )
);
