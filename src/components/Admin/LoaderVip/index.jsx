// src/components/common/Loader/index.jsx
import React, { useEffect } from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../../../assets/Admin/animations/loader.json"; // Đảm bảo đường dẫn này đúng

const LoaderAdmin = ({ fullscreen }) => {
  useEffect(() => {
    if (fullscreen) {
      document.body.style.overflow = "hidden"; // Khóa cuộn khi Loader fullscreen xuất hiện
    }

    return () => {
      document.body.style.overflow = "auto"; // Mở lại cuộn khi Loader biến mất
    };
  }, [fullscreen]);

  return (
    <div
      style={{
        position: fullscreen ? "fixed" : "relative",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column", // THAY ĐỔI: Để Lottie và chữ xếp chồng lên nhau
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: fullscreen ? "rgba(255, 255, 255, 0.85)" : "transparent", // Có thể tăng độ mờ của nền một chút
        zIndex: fullscreen ? 9999 : 1, // Đảm bảo z-index đủ cao cho fullscreen
        width: fullscreen ? "100%" : "auto",
        height: fullscreen ? "100vh" : "auto",
      }}
    >
      <Lottie
        animationData={loadingAnimation}
        style={{ height: 100, width: 100 }} // Thêm width để nhất quán, bạn có thể điều chỉnh kích thước
        loop={true}      // Đảm bảo lặp lại
        autoplay={true}  // Đảm bảo tự chạy
      />
      {/* THÊM MỚI: Dòng chữ chờ */}
      <p
        style={{
          marginTop: "15px", // Khoảng cách giữa Lottie và chữ
          fontSize: "1rem",  // Kích thước chữ (có thể dùng '1em', '16px', etc.)
          color: "#333333",  // Màu chữ tối để dễ đọc trên nền sáng
          // fontWeight: 500, // Tùy chọn: làm chữ đậm hơn một chút
        }}
      >
        Chờ một chút nhé...
      </p>
    </div>
  );
};

export default LoaderAdmin;