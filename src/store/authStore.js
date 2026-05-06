import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoggedIn: false,

      login: (token, user) => set({
        token,
        user,
        isLoggedIn: true,
      }),

      logout: () => set({
        token: null,
        user: null,
        isLoggedIn: false,
      }),

      updateUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage', // localStorage 키 이름
      partialize: (state) => ({ token: state.token, user: state.user, isLoggedIn: state.isLoggedIn }),
    }
  )
);

export default useAuthStore;