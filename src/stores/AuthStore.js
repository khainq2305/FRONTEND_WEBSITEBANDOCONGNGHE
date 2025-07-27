// stores/useAuthStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '@/services/client/authService';
import { buildAbilityFromPermissions } from '@/casl/ability';
import { encrypt, decrypt } from '@/utils/cryptoHelper';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: true,
      ability: null,

      // 🟢 Gọi khi load lại app
      fetchUserInfo: async () => {
        try {
          const res = await authService.getUserInfo();
          const user = res?.data?.user;

          user.roles = (user.roles || []).map((r) => ({
            id: r.id,
            name: r.name,
            description: r.description,
            canAccess: r.canAccess ?? false,
          }));

          user.permissions = user.permissions || [];

          const ability = buildAbilityFromPermissions(user.permissions);

          set({ user, ability });
        } catch (err) {
          console.error('fetchUserInfo error:', err);
          set({ user: null, ability: null });
        } finally {
          set({ loading: false });
        }
      },

      
      login: (userInfo, token) => {
        userInfo.roles = (userInfo.roles || []).map((r) => ({
          id: r.id,
          name: r.name,
          description: r.description,
          canAccess: r.canAccess ?? false,
        }));

        userInfo.permissions = userInfo.permissions || [];

        const ability = buildAbilityFromPermissions(userInfo.permissions);

        set({ user: userInfo, ability });

        
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch (err) {
          console.error('Logout error:', err);
        }
        localStorage.clear();
        sessionStorage.clear();
        set({ user: null, ability: null, loading: false });
       
      },
    }),
    {
      name: 'auth_data_v1',
      
      partialize: (state) => ({
        user: state.user,
        loading: state.loading,
      }),
      storage: {
        getItem: (name) => {
          const raw = localStorage.getItem(name);
          if (!raw) return null;

          try {
            const parsed = JSON.parse(decrypt(raw));

            if (parsed?.user?.roles) {
              parsed.user.roles = parsed.user.roles.map((r) => ({
                ...r,
                canAccess: r.canAccess ?? false,
              }));
            }

            parsed.user.permissions = parsed.user?.permissions || [];

           
            parsed.ability = buildAbilityFromPermissions(parsed.user.permissions);

            return parsed;
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
   
          const toPersist = {
            user: value.user,
            loading: value.loading,
          };

          const encrypted = encrypt(JSON.stringify(toPersist));
          localStorage.setItem(name, encrypted);
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);

export default useAuthStore;
