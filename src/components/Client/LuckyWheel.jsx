"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PopupModal from "../../layout/Client/Header/PopupModal";
import WheelIcon from "@/assets/Client/images/99ef2555-2aca-4640-9cbb-6cf0a731f641.png";

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
    <img
      src={WheelIcon}
      alt="Lucky Wheel"
      onClick={() => {
        if (!isLoggedIn) {
          setShowLoginModal(true);
        } else {
          navigate("/mini-game");
        }
      }}
      className="fixed bottom-10 left-6 z-50 w-25 h-25 cursor-pointer animate-bounce object-contain"
    />

    <PopupModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
  </>
);

};

export default LuckyWheel;
