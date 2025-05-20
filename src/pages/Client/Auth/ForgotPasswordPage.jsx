import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "services/client/authService"; // Assuming this path is correct
import { ChevronLeft, XCircle } from "lucide-react";
import Loader from "components/common/Loader"; // Assuming this path is correct

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lockTime, setLockTime] = useState(0);

  // ✅ Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(email);
  };

  // ✅ Handle password reset request submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLockTime(0);

    if (!email.trim()) {
      setError("Vui lòng nhập email của bạn!");
      return;
    }

    if (!validateEmail(email)) {
      setError("Định dạng email không hợp lệ!");
      return;
    }

    setLoading(true);

    try {
      // Replace with your actual API call if different
      const response = await authService.forgotPassword({ email });
      navigate("/forgot-password-notice", { state: { email } });
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Lỗi xảy ra!";

      // ✅ If error is due to account lock or rate limit
      if (err?.response?.status === 429) {
        const lockDuration = parseInt(errorMessage.match(/\d+/)?.[0] || 0);
        setLockTime(lockDuration * 1000); // Assuming lockDuration is in seconds
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Countdown for lock time
  useEffect(() => {
    let interval;
    if (lockTime > 0) {
      interval = setInterval(() => {
        setLockTime((prev) => (prev > 1000 ? prev - 1000 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [lockTime]);

  // ✅ Format lock time (hours, minutes, seconds)
  const formatLockTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours} giờ ${minutes} phút ${seconds} giây`;
    } else if (minutes > 0) {
      return `${minutes} phút ${seconds} giây`;
    } else {
      return `${seconds} giây`;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4"> {/* Changed background to light gray for contrast like image */}
      {loading && <Loader fullscreen />} {/* ✅ Fullscreen Loader */}

      <div
        className="bg-white shadow-xl rounded-lg p-8 w-full text-center relative" // Increased shadow
        style={{
          maxWidth: "480px", // Slightly wider to match image proportion
          padding: "60px 32px", // Adjusted padding
          borderRadius: "8px", // Slightly less rounded
          // boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)" // Custom shadow if Tailwind's isn't enough
        }}
      >
        {/* ✅ Back button */}
        <div className="flex items-center justify-start mb-8 relative"> {/* Adjusted margin and alignment */}
          <button
            onClick={() => navigate(-1)} // Go back to previous page
            className="text-[var(--primary-color)] absolute left-0 top-1/2 transform -translate-y-1/2 hover:opacity-80"
            aria-label="Quay lại"
          >
            <ChevronLeft size={32} strokeWidth={2.5} />
          </button>
          <h2 className="text-xl font-semibold text-gray-700 w-full text-center ml-8"> {/* Adjusted text color and centering */}
            Đặt lại mật khẩu
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5"> {/* Increased space */}
          <div className="flex flex-col items-center">
            <input
              type="email" // Changed type to "email" for better semantics and potential browser validation
              placeholder="Email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 border rounded-md text-sm 
                ${ error ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]" } 
                focus:outline-none focus:ring-1 transition-colors duration-200 ease-in-out`}
              disabled={loading || lockTime > 0}
              style={{ fontSize: '0.95rem' }} // Slightly larger placeholder/input text
            />
            {error && !lockTime && ( // Only show general error if not locked
              <div className="text-red-500 text-xs mt-2 text-left w-full flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-red-500" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-md text-white text-base font-semibold transition-opacity duration-200 ease-in-out
              ${ loading || lockTime > 0
                ? "bg-[var(--primary-color)] opacity-50 cursor-not-allowed"
                : "bg-[var(--primary-color)] hover:opacity-85"
            }`}
            disabled={loading || lockTime > 0}
            style={{ letterSpacing: '0.5px' }}
          >
            {lockTime > 0
              ? `THỬ LẠI SAU (${formatLockTime(lockTime)})`
              : loading
              ? "ĐANG GỬI..."
              : "TIẾP THEO"}
          </button>

          {/* ✅ Lock message display */}
          {lockTime > 0 && (
            <div className="mt-3 p-3 text-left text-red-700 bg-red-50 border border-red-300 rounded-md flex items-start gap-2 w-full mx-auto text-sm">
              <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Yêu cầu tạm khóa.</p>
                <p className="text-xs">
                  Bạn đã yêu cầu quá nhiều lần. Vui lòng thử lại sau{" "}
                  <strong>{formatLockTime(lockTime)}</strong>.
                </p>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;