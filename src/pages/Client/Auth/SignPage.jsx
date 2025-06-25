// AuthPage.jsx
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authService } from 'services/client/authService';
import Loader from 'components/common/Loader';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';

import GradientButton from '../../../components/Client/GradientButton';

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === '/dang-nhap';

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isValid }
  } = useForm({
    mode: 'onChange'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) navigate('/');
  }, [navigate]);

  useEffect(() => {
    if (isLoading) {
      const originalOverflow = document.body.style.overflow;

      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isLoading]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      if (isLogin) {
        const response = await authService.login(data);
        const { token } = response.data;
        if (data.remember) {
          localStorage.setItem('token', token);
        } else {
          sessionStorage.setItem('token', token);
        }
        navigate('/');
      } else {
        const response = await authService.register(data);
        const { otpToken } = response.data;
        navigate('/register-email-sent', {
          state: {
            email: data.email,
            fullName: data.fullName,
            password: data.password,
            otpToken
          }
        });
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err?.response?.data?.message || 'Email hoặc mật khẩu không chính xác.');
    } finally {
      setIsLoading(false);
    }
  };

  // const handleGoogleLogin = async (credentialResponse) => {
  //   try {
  //     setIsLoading(true);
  //     const response = await authService.loginWithGoogle({ token: credentialResponse.credential }, { withCredentials: true });
  //     console.log('🔎 Đăng nhập Google response:', response.data);

  //     const { token, user } = response.data;

  //     if (user.fullName) {
  //       localStorage.setItem('token', token);
  //       localStorage.setItem('user', JSON.stringify(user));
  //     }
  //     navigate('/');
  //   } catch (err) {
  //     console.error('Đăng nhập Google thất bại:', err);
  //     alert(err?.response?.data?.message || 'Đăng nhập Google thất bại!');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        const response = await authService.loginWithGoogle({ token: tokenResponse.access_token }, { withCredentials: true });
        const { token, user } = response.data;
        if (user.fullName) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
        }
        navigate('/');
      } catch (err) {
        console.error('Đăng nhập Google thất bại:', err);
        alert(err?.response?.data?.message || 'Đăng nhập Google thất bại!');
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => alert('Đăng nhập Google thất bại!')
  });

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {isLoading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
        >
          <div className="flex flex-col items-center">
            <Loader />
            <p className="text-white text-lg font-semibold mt-2">Đang xử lý...</p>
          </div>
        </div>
      )}

      <div
        className="hidden bg-primary-gradient lg:flex w-1/2 relative overflow-hidden text-white flex-col justify-center items-center p-10"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 90% 54%, 69% 100%, 0 100%, 0% 50%)'
        }}
      >
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-center p-10">
          <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-color)' }}>
            {isLogin ? 'Bạn đã có tài khoản?' : 'Bạn mới đến?'}
          </h2>
          <p className="text-lg max-w-xs mb-4" style={{ color: 'var(--text-color)' }}>
            {isLogin
              ? 'Đăng nhập để tiếp tục khám phá các tính năng tuyệt vời của chúng tôi.'
              : 'Hãy đăng ký để tham gia cộng đồng của chúng tôi và khám phá những điều thú vị!'}
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center w-full p-6 sm:p-10 md:p-16 lg:w-1/2">
        <div className="bg-light shadow-md rounded-lg p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-center text-primary">{isLogin ? 'Đăng nhập' : 'Đăng ký'}</h2>
          {errorMessage && (
            <div className="flex items-center gap-2 mt-3 mb-3 text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
              <AlertCircle className="w-5 h-5" />
              <p>{errorMessage}</p>
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!isLogin && (
              <div className="flex flex-col gap-0.5">
                <label className="block text-sm font-medium text-text-color">Họ và Tên</label>
                <input
                  {...register('fullName', { required: 'Vui lòng nhập họ và tên.' })}
                  placeholder="Họ và Tên"
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
                    errors.fullName
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-primary focus:ring-primary'
                  }`}
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-0.5">{errors.fullName.message}</p>}
              </div>
            )}

            <div className="flex flex-col gap-0.5">
              <label className="block text-sm font-medium text-text-color">Email</label>
              <input
                {...register('email', {
                  required: 'Vui lòng nhập email.',
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: 'Email không hợp lệ.'
                  }
                })}
                placeholder="Email"
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
                  errors.email
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-primary focus:ring-primary'
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-0.5">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-0.5 relative">
              <label className="block text-sm font-medium">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Vui lòng nhập mật khẩu.',
                    ...(!isLogin && {
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                        message: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.'
                      }
                    })
                  })}
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 pr-10 ${
                    errors.password
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-primary focus:ring-primary'
                  }`}
                  placeholder="Mật khẩu"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-0.5">{errors.password.message}</p>}
            </div>

            {!isLogin && (
              <div className="flex flex-col gap-0.5 relative mt-4">
                <label className="block text-sm font-medium">Xác nhận mật khẩu</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword', {
                      required: 'Vui lòng nhập lại mật khẩu.',
                      validate: (value) => value === watch('password') || 'Mật khẩu không khớp.'
                    })}
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 pr-10 ${
                      errors.confirmPassword
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-primary focus:ring-primary'
                    }`}
                    placeholder="Xác nhận mật khẩu"
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-0.5">{errors.confirmPassword.message}</p>}
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input type="checkbox" {...register('remember')} className="focus:ring-primary text-primary" />
                  <label className="text-sm text-text-color">Ghi nhớ đăng nhập</label>
                </div>
                <Link to="/quen-mat-khau" className="text-primary text-sm font-semibold">
                  Quên mật khẩu?
                </Link>
              </div>
            )}

            <GradientButton type="submit" disabled={!isValid || isLoading} className="w-full" size="compact">
              {isLogin ? 'Đăng nhập' : 'Đăng ký'}
            </GradientButton>
          </form>

          <div className="mt-4 text-center text-neutral-color">
            {isLogin ? (
              <p>
                Bạn chưa có tài khoản?{' '}
                <Link to="/dang-ky" className="text-primary font-semibold">
                  Đăng ký ngay
                </Link>
              </p>
            ) : (
              <p>
                Bạn đã có tài khoản?{' '}
                <Link to="/dang-nhap" className="text-primary font-semibold">
                  Đăng nhập ngay
                </Link>
              </p>
            )}
          </div>

          <div className="relative flex items-center py-5">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink text-neutral-color mx-4">Hoặc đăng nhập bằng</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={() => googleLogin()}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 shadow"
            >
              <img src="src/assets/Client/images/auth/Google__G__logo.svg.webp" alt="Google" className="w-7 h-7 object-cover" />
            </button>

            <button
              onClick={() => facebookLogin()}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 shadow"
            >
              <img src="src/assets/Client/images/auth/2021_Facebook_icon.svg.webp" alt="Facebook" className="w-7 h-7 object-cover" />
            </button>

            <button
              onClick={() => appleLogin()}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 shadow"
            >
              <img src="src/assets/Client/images/auth/747.png" alt="Apple" className="w-7 h-7 object-cover" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
