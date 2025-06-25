import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthService } from '@/services/admin/AuthService';
import { buildAbilityFromPermissions } from '@/casl/ability';
import { encrypt, decrypt } from '@/utils/cryptoHelper';

/**
 * @hook useAuthStore
 * Quản lý trạng thái người dùng (user, loading, ability)
 *
 * @method fetchUserInfo Gọi khi load lại web để lấy thông tin người dùng hiện tại từ API
 * @method login Đăng nhập và cập nhật trạng thái
 * @method logout Đăng xuất, xoá localStorage và reset state
 */

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: true,
      ability: null,

      fetchUserInfo: async () => {
        const existingUser = get().user;
        if (existingUser) {
          const ability = buildAbilityFromPermissions(existingUser.permissions || []);
          set({ ability, loading: false });
          return;
        }

        try {
          const res = await AuthService.getUserInfo();
          const user = res?.data?.data;

          user.roles = user.roles?.map((r) => ({
            id: r.id,
            name: r.name,
            description: r.description,
            canAccess: r.canAccess ?? false
          }));

          const ability = buildAbilityFromPermissions(user.permissions || []);
          set({ user, ability });
        } catch (err) {
          set({ user: null, ability: null });
        } finally {
          set({ loading: false });
        }
      },

      login: (userInfo, token) => {
        console.log('token', token);
        userInfo.roles = userInfo.roles?.map((r) => ({
          id: r.id,
          name: r.name,
          description: r.description,
          canAccess: r.canAccess ?? false
        }));

        const ability = buildAbilityFromPermissions(userInfo.permissions || []);
        set({ user: userInfo, ability });
        if (token) {
          localStorage.setItem('token', token);
        }
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
      name: 'auth_data_v1',
      partialize: (state) => state,
      storage: {
        getItem: (name) => {
          const raw = localStorage.getItem(name);
          if (!raw) return null;
          try {
            const parsed = JSON.parse(decrypt(raw));
            // Patch lại roles nếu thiếu canAccess
            if (parsed?.user?.roles) {
              parsed.user.roles = parsed.user.roles.map((r) => ({
                ...r,
                canAccess: r.canAccess ?? false
              }));
            }
            return parsed;
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
