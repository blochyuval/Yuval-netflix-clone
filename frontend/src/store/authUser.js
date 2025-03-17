import { create } from 'zustand'
import axios from 'axios'
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
  user: null,
  isSigningUp: false,
  isCheckingAuth: true,
  isLogingOut: false,
  isLogin: false,
  signUp: async(credentials) => {
    set({ isSigningUp: true });
    try {
      const response = await axios.post('/api/v1/auth/signUp', credentials);
      set({user: response.data.user, isSigningUp: false});
      toast.success('Account created successfully');
      
    } catch (error) {
      toast.error(error.response.data.message || 'Signup failed');
      set({isSigningUp: false, user: null});
    }
    
  },
  login: async(credentials) => {
    set({isLogin: true})
    try {
      const response = await axios.post('/api/v1/auth/login', credentials);
      set({ user: response.data.user, isLogin: false });
      toast.success('Logged in successfully');
    } catch (error) {
      set({isLogin: false, user: null});
      toast.error(error.response.data.message || 'Login failed');
    }
  },
  logout: async() => {
    set({ isLogingOut: true});
    try {
      const response = await axios.post('api/v1/auth/logout');
      set({user: null, isLogingOut: false})
      toast.success(response.data.message || 'Logged out successfully');
      
    } catch (error) {
      toast.error(error.response.data.message || 'Logout failed');
      set({isLogingOut: false})
    }
  },
  authCheck: async() => {
    set({ isCheckingAuth: true });
    try {
      const response = await axios.get('/api/v1/auth/authCheck');

      set({ user: response.data.user, isCheckingAuth: false });

    } catch (error) {
      set({ isCheckingAuth: false, user: null });
    }
  }
}))