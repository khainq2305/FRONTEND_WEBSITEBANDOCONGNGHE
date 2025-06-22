import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthService } from '@/services/admin/AuthService';
import { defineAbilitiesFor } from '@/casl/ability';
import { encrypt, decrypt } from '@/utils/cryptoHelper';
const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: true,
      ability: null,

      fetchUserInfo: async () => {
        if (get().user) {
          set({ loading: false });
          return;
        }

        try {
          const res = await AuthService.getUserInfo();
          const user = res.data.user;

          const ability = defineAbilitiesFor(user.permissions);
          set({ user, ability });
        } catch {
          set({ user: null, ability: null });
        } finally {
          set({ loading: false });
        }
      },

      login: (userInfo) => {
        const ability = defineAbilitiesFor(userInfo.permissions || []);
        set({ user: userInfo, ability });
      },

      logout: async () => {
        try {
          await AuthService.logout();
        } catch (err) {
          console.error('Logout error:', err);
        }
        localStorage.clear();
        sessionStorage.clear();
        set({ user: null, ability: null, loading: false });
        window.location.reload();
      }
    }),
    {
      name: 't332@%@#%',
      partialize: (state) => ({ user: state.user }), // chỉ persist user
      storage: {
        getItem: (name) => {
          const raw = localStorage.getItem(name);
          if (!raw) return null;
          try {
            return JSON.parse(decrypt(raw));
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          const encrypted = encrypt(JSON.stringify(value));
          localStorage.setItem(name, encrypted);
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        }
      }
    }
  )
);

export default useAuthStore;
