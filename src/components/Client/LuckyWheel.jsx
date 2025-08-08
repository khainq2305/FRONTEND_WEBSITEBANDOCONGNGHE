"use client";

import { useState } from "react";
import { Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PopupModal from "@/layout/Client/Header/PopupModal";

const LuckyWheel = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const getUser = () => {
    try {
      const user = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      return token && user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  };

  const isLoggedIn = !!getUser();

  return (
    <>
      {/* Nút Gift */}
      <button
        onClick={() => {
          if (!isLoggedIn) {
            setShowLoginModal(true);
          } else {
            navigate("/mini-game");
          }
        }}
        className="fixed bottom-24 left-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 text-white shadow-lg border-4 border-white flex items-center justify-center animate-bounce"
      >
        <Gift className="w-7 h-7" />
      </button>

      {/* Popup yêu cầu đăng nhập */}
      <PopupModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
};

export default LuckyWheel;
