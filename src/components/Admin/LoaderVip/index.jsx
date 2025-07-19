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
        position: fullscreen ? "fixed" : "relative",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column", 
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: fullscreen ? "rgba(255, 255, 255, 0.85)" : "transparent", 
        zIndex: fullscreen ? 9999 : 1, 
        width: fullscreen ? "100%" : "auto",
        height: fullscreen ? "100vh" : "auto",
      }}
    >
      <Lottie
        animationData={loadingAnimation}
        style={{ height: 100, width: 100 }} 
        loop={true}     
        autoplay={true}  
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