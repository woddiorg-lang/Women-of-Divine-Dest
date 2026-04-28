import { create } from 'zustand';

export type Role = 'student' | 'tutor' | 'admin';
export type Pathway = 'GMN' | 'NNN' | 'None';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  pathway?: Pathway;
  country: string;
  streak: number;
  points: number;
  bio?: string;
  specializations?: string[];
  createdAt: number;
  avatarUrl?: string;
  completedRootingModules?: string[];
  completedBlueprintLessons?: string[];
  completedSkills?: string[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
}));

