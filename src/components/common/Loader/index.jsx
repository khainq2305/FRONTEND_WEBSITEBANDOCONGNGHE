// src/components/common/Loader/index.jsx
import React, { useEffect } from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../../../assets/Client/animations/loader.json";

const Loader = ({ fullscreen }) => {
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
        position: fullscreen ? "fixed" : "relative",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: fullscreen ? "rgba(255, 255, 255, 0.8)" : "transparent",
        zIndex: fullscreen ? 9999 : 1,
        width: fullscreen ? "100%" : "auto",
        height: fullscreen ? "100vh" : "auto",
      }}
    >
      <Lottie animationData={loadingAnimation} style={{ height: 100 }} loop autoplay />
    </div>
  );
};

export default Loader;
