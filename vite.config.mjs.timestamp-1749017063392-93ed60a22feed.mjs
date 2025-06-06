// vite.config.mjs
import { defineConfig, loadEnv } from "file:///F:/DU%20AN%20TOT%20NGHIEP%202025/duantotnghiep2/node_modules/vite/dist/node/index.js";
import react from "file:///F:/DU%20AN%20TOT%20NGHIEP%202025/duantotnghiep2/node_modules/@vitejs/plugin-react/dist/index.mjs";
import jsconfigPaths from "file:///F:/DU%20AN%20TOT%20NGHIEP%202025/duantotnghiep2/node_modules/vite-jsconfig-paths/dist/index.mjs";
import tailwindcss from "file:///F:/DU%20AN%20TOT%20NGHIEP%202025/duantotnghiep2/node_modules/@tailwindcss/vite/dist/index.mjs";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const API_URL = `${env.VITE_APP_BASE_NAME}`;
  const PORT = 9999;
  return {
    server: {
      open: true,
      port: PORT,
      host: true
    },
    preview: {
      open: true,
      host: true
    },
    define: {
      global: "window"
    },
    resolve: {
      alias: []
    },
    base: API_URL,
    plugins: [react(), jsconfigPaths(), tailwindcss()]
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubWpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRjpcXFxcRFUgQU4gVE9UIE5HSElFUCAyMDI1XFxcXGR1YW50b3RuZ2hpZXAyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJGOlxcXFxEVSBBTiBUT1QgTkdISUVQIDIwMjVcXFxcZHVhbnRvdG5naGllcDJcXFxcdml0ZS5jb25maWcubWpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9GOi9EVSUyMEFOJTIwVE9UJTIwTkdISUVQJTIwMjAyNS9kdWFudG90bmdoaWVwMi92aXRlLmNvbmZpZy5tanNcIjsvLyB2aXRlLmNvbmZpZy5qc1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcclxuaW1wb3J0IGpzY29uZmlnUGF0aHMgZnJvbSAndml0ZS1qc2NvbmZpZy1wYXRocyc7XHJcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tICdAdGFpbHdpbmRjc3Mvdml0ZSdcclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xyXG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgJycpO1xyXG4gIGNvbnN0IEFQSV9VUkwgPSBgJHtlbnYuVklURV9BUFBfQkFTRV9OQU1FfWA7XHJcbiAgY29uc3QgUE9SVCA9IDk5OTk7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgb3BlbjogdHJ1ZSxcclxuICAgICAgcG9ydDogUE9SVCxcclxuICAgICAgaG9zdDogdHJ1ZSxcclxuICAgIH0sXHJcbiAgICBwcmV2aWV3OiB7XHJcbiAgICAgIG9wZW46IHRydWUsXHJcbiAgICAgIGhvc3Q6IHRydWUsXHJcbiAgICB9LFxyXG4gICAgZGVmaW5lOiB7XHJcbiAgICAgIGdsb2JhbDogJ3dpbmRvdydcclxuICAgIH0sXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgIGFsaWFzOiBbXVxyXG4gICAgfSxcclxuICAgIGJhc2U6IEFQSV9VUkwsXHJcbiAgICBwbHVnaW5zOiBbcmVhY3QoKSwganNjb25maWdQYXRocygpLCB0YWlsd2luZGNzcygpXVxyXG4gIH07XHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsU0FBUyxjQUFjLGVBQWU7QUFDdEMsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sbUJBQW1CO0FBQzFCLE9BQU8saUJBQWlCO0FBQ3hCLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxNQUFNO0FBQ3hDLFFBQU0sTUFBTSxRQUFRLE1BQU0sUUFBUSxJQUFJLEdBQUcsRUFBRTtBQUMzQyxRQUFNLFVBQVUsR0FBRyxJQUFJLGtCQUFrQjtBQUN6QyxRQUFNLE9BQU87QUFFYixTQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsSUFDUjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLElBQ1I7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLFFBQVE7QUFBQSxJQUNWO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxPQUFPLENBQUM7QUFBQSxJQUNWO0FBQUEsSUFDQSxNQUFNO0FBQUEsSUFDTixTQUFTLENBQUMsTUFBTSxHQUFHLGNBQWMsR0FBRyxZQUFZLENBQUM7QUFBQSxFQUNuRDtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
