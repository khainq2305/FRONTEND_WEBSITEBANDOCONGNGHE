import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "services/client/authService";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { User, LogOut, ShoppingCart, HelpCircle, Store } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) return;

        const response = await authService.getUserInfo(token);
        setUser(response.data.user);
      } catch (err) {
        console.error("❌ Lỗi lấy thông tin người dùng:", err);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      navigate('/dang-nhap');
    } catch (err) {
      console.error("❌ Lỗi đăng xuất:", err);
    }
  };

  return (
    <header className="bg-yellow-400 p-4 flex items-center justify-between text-black">
      <main className="w-full max-w-[var(--main-max-width)] mx-auto px-4">
      <div className="flex items-center">
        <img src="/logo.png" alt="Logo" className="h-10 mr-2" />
        <h2 className="font-semibold">dienthoaigiakho.vn</h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="bg-yellow-500 px-4 py-2 rounded">DANH MỤC</button>
        <input type="text" className="p-2 rounded border" placeholder="Bạn muốn tìm gì ..." />
        <button className="p-2"><i className="fas fa-search"></i></button>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Store size={20} />
            <span>Hệ Thống Showroom</span>
          </div>
          <div className="flex items-center space-x-1">
            <HelpCircle size={20} />
            <span>Thông Tin Tra cứu</span>
          </div>
          <div className="flex items-center space-x-1">
            <ShoppingCart size={20} />
            <span>Giỏ hàng</span>
          </div>
        </div>
      </div>
      </main>
    </header>
  );
};

export default Header;