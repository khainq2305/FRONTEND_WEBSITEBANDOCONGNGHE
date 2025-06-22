export default function App() {
  const fetchUserInfo = useAuthStore((s) => s.fetchUserInfo);

  useEffect(() => {
    fetchUserInfo(); // gọi khi app mount
  }, []);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <SystemSettingProvider> {/* ✅ bọc bên ngoài các component dùng context */}
        <ThemeCustomization>
          <ScrollTop>
            <Toastify />
            <RouterProvider router={router} />
          </ScrollTop>
        </ThemeCustomization>
      </SystemSettingProvider>
    </GoogleOAuthProvider>
  );
}
