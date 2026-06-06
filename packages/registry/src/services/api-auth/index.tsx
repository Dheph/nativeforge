import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Implement actual Custom API Auth logic here
// import { api } from '../lib/api';

interface User {
  id: string;
  email?: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  
  signIn: async (email, pass) => {
    set({ isLoading: true, error: null });
    try {
      console.log('API signIn', email);
      // const response = await api.post('/auth/login', { email, password: pass });
      // const token = response.data.token;
      // await AsyncStorage.setItem('auth_token', token);
      set({ user: { id: 'dummy_api', email }, isLoading: false });
    } catch (e: any) {
      set({ error: e.message || 'Login failed', isLoading: false });
    }
  },

  signUp: async (email, pass) => {
    set({ isLoading: true, error: null });
    try {
      console.log('API signUp', email);
      set({ user: { id: 'dummy_api', email }, isLoading: false });
    } catch (e: any) {
      set({ error: e.message || 'Signup failed', isLoading: false });
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log('API signOut');
      await AsyncStorage.removeItem('auth_token');
      set({ user: null, isLoading: false });
    } catch (e: any) {
      set({ error: e.message || 'Signout failed', isLoading: false });
    }
  },

  resetPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      console.log('API resetPassword', email);
      set({ isLoading: false });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },

  signInWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log('API signInWithGoogle');
      set({ isLoading: false });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },

  signInWithApple: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log('API signInWithApple');
      set({ isLoading: false });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },

  signInWithGithub: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log('API signInWithGithub');
      set({ isLoading: false });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },

  clearError: () => set({ error: null })
}));
