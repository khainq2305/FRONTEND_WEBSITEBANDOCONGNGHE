// src/pages/Client/Auth/VerifyEmailPage.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { authService } from "services/client/authService";
import { toast } from "react-toastify";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      if (!token) {
        toast.error("Thiếu token xác thực!");
        navigate("/dang-nhap");
        return;
      }

      try {
        const response = await authService.verifyEmail(token);
        if (response.data.alreadyVerified) {
          toast.info("✅ Tài khoản của bạn đã được xác thực. Vui lòng đăng nhập.");
        } else {
          toast.success("✅ Xác thực email thành công! Vui lòng đăng nhập.");
        }
        navigate("/dang-nhap");
      } catch (error) {
        toast.error("Xác thực email thất bại hoặc liên kết đã hết hạn.");
        navigate("/dang-ky");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [navigate, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {loading ? (
        <div className="text-lg font-semibold">Đang xác thực email...</div>
      ) : (
        <div className="text-lg font-semibold">Đã xử lý xong.</div>
      )}
    </div>
  );
};

export default VerifyEmailPage;
