import React from "react";
import { Link, useLocation } from "react-router-dom";

const AuthHeader = () => {
  const location = useLocation();
  const isLogin = location.pathname === '/dang-nhap';
  const isRegister = location.pathname === '/dang-ky';
  const isForgotPassword = location.pathname === '/quen-mat-khau';
  const isResetPassword = location.pathname === '/dat-lai-mat-khau';
  const isOtpVerification = location.pathname === '/otp-verification';

  // Kiểu dáng cho liên kết "Liên hệ với chúng tôi"
  const linkStyles = "no-underline font-bold text-[var(--primary-color)] hover:text-[var(--secondary-color)] transition-colors duration-200";

  return (
    <header
      className="bg-white w-screen shadow-md border-b-2 border-[var(--primary-color)]"
      // Header giờ đây sẽ luôn chiếm toàn bộ chiều rộng màn hình (w-screen)
      // Bỏ px-6 py-3 ở đây nếu bạn muốn padding chỉ áp dụng cho content bên trong
      // Nếu muốn background của header có padding chung, thì giữ lại px-6 py-3 ở đây
      // ví dụ: className="bg-white w-screen px-6 py-3 shadow-md border-b-2 border-[var(--primary-color)]"
    >
      {/* Thêm một div container bên trong để giới hạn chiều rộng và căn giữa nội dung */}
      <div
        className="w-full max-w-screen-xl mx-auto px-6 py-3 flex items-center justify-between"
        // w-full: Chiếm toàn bộ chiều rộng của parent (header)
        // max-w-screen-xl: Giới hạn chiều rộng tối đa của content là breakpoint xl (mặc định 1280px)
        // mx-auto: Tự động căn giữa content theo chiều ngang
        // px-6 py-3: Padding cho content bên trong (nếu bạn muốn padding tách biệt với header)
        // flex items-center justify-between: Để sắp xếp logo/tiêu đề và link liên hệ
      >
        <div className="flex items-center">
          <Link to="/" className="no-underline">
            <img
              src="src/assets/Client/images/Logo/logo.svg" // Đảm bảo đường dẫn này chính xác
              alt="Logo"
              className="h-[50px] w-auto"
            />
          </Link>
          <span className="mx-3 text-neutral-400">|</span>
          <h2 className="text-xl text-neutral-700 font-semibold">
            {isLogin ? "Đăng nhập" : isRegister ? "Đăng ký" : isForgotPassword ? "Quên mật khẩu" : isResetPassword ? "Đặt lại mật khẩu" : isOtpVerification ? "Xác thực OTP" : ""}
          </h2>
        </div>

        <Link
          to="/lien-he"
          className={linkStyles}
        >
          Liên hệ với chúng tôi
        </Link>
      </div>
    </header>
  );
};

export default AuthHeader;