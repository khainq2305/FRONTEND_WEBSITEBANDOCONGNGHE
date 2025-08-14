// src/components/Admin/LoaderVip
import React, { useEffect } from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../../../assets/Admin/animations/loader.json"; 

const LoaderAdmin = ({ fullscreen }) => {
  useEffect(() => {
    if (fullscreen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto"; 
    };
  }, [fullscreen]);

  return (
  <div
    style={{
      position: "fixed", // luôn luôn fixed
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: fullscreen
        ? "rgba(255, 255, 255, 0.85)"
        : "transparent",
      zIndex: 9999,
      width: "100%",
      height: "100vh", // chiều cao toàn màn hình
    }}
  >
    <Lottie
      animationData={loadingAnimation}
      style={{ height: 100, width: 100 }}
      loop
      autoplay
    />

    <p
      style={{
        marginTop: "15px",
        fontSize: "1rem",
        color: "#333333",
      }}
    >
      Chờ một chút nhé...
    </p>
  </div>
);

};

export default LoaderAdmin;