import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "services/client/authService";
import { ChevronLeft } from "lucide-react";
import { toast } from "react-toastify";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // ✅ Lỗi dưới input

  // ✅ Kiểm tra email hợp lệ
  const validateEmail = (email) => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(email);
  };

  // ✅ Gửi yêu cầu đặt lại mật khẩu
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");

    if (!email.trim()) {
      setError("❌ Vui lòng nhập email của bạn!");
      return;
    }

    if (!validateEmail(email)) {
      setError("❌ Định dạng email không hợp lệ!");
      return;
    }

    setLoading(true);

    try {
      await authService.forgotPassword({ email });
      toast.success("✅ Đã gửi liên kết đặt lại mật khẩu đến email của bạn.");
      navigate("/forgot-password-notice", { state: { email } });
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "❌ Lỗi xảy ra!";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white px-4">
      <div 
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center relative"
        style={{
          maxWidth: "420px",
          padding: "32px",
          borderRadius: "12px",
          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.1)"
        }}
      >
        <div className="flex items-center justify-center mb-6 relative">
          <button
            onClick={() => navigate(-1)}
            className="text-red-500 absolute left-4 top-1/2 transform -translate-y-1/2"
          >
            <ChevronLeft size={28} />
          </button>
          <h2 className="text-2xl font-semibold">Quên mật khẩu</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center">
            <input
              type="text"
              placeholder="Email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full max-w-xs px-4 py-3 border rounded-md text-sm ${
                error ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-red-500 transition-all`}
              disabled={loading}
            />
            {error && (
              <p className="text-red-500 text-sm mt-1 text-left w-full max-w-xs">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full max-w-xs py-3 rounded-md text-white text-base font-semibold ${
              loading
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
            disabled={loading}
          >
            {loading ? "Đang gửi..." : "TIẾP THEO"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
