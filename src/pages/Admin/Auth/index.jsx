import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Loader from 'components/common/Loader';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import GradientButton from '../../../components/Client/GradientButton';
import { AuthService } from '@/services/admin/AuthService';
import useAuthStore from '@/stores/AuthStore';
import { toast } from 'react-toastify';

const LoginAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === '/dang-nhap-dashboard';

  const { login, user, loading } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm({ mode: 'onChange' });

  // 👉 Redirect nếu đã login
  useEffect(() => {
    if (!loading && user) {
      navigate('/admin');
    }
  }, [user, loading]);

  // 👉 Chặn scroll khi loading
  useEffect(() => {
    document.body.style.overflow = isLoading ? 'hidden' : 'auto';
    return () => (document.body.style.overflow = 'auto');
  }, [isLoading]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      // Đăng nhập (cookie được lưu server-side)
      const lgin = await AuthService.login(data);

      if (lgin) {
        const res = await AuthService.getUserInfo();
        login(res.data.user);
      } else {
        toast.error('chưa có đăng nhập')
      }
      // Lấy thông tin user từ server sau khi login thành công
      // const res = await AuthService.getUserInfo();
      // login(res.data.user);

      toast.success('Đăng nhập thành công!');
      navigate('/admin');
    } catch (err) {
      const message = err?.response?.data?.message || 'Đăng nhập thất bại!';
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Loader Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <Loader />
        </div>
      )}

      {/* Panel bên trái */}
      <div className="hidden lg:flex w-1/2 bg-primary-gradient text-white p-10 items-center justify-center relative"
        style={{ clipPath: 'polygon(0 0, 100% 0, 90% 54%, 69% 100%, 0 100%, 0% 50%)' }}
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-color)' }}>
            {isLogin ? 'Bạn đã có tài khoản?' : 'Bạn mới đến?'}
          </h2>
          <p className="text-lg max-w-xs" style={{ color: 'var(--text-color)' }}>
            {isLogin
              ? 'Đăng nhập để tiếp tục trải nghiệm hệ thống.'
              : 'Hãy tạo tài khoản để khám phá thêm tính năng.'}
          </p>
        </div>
      </div>

      {/* Form bên phải */}
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-6">
        <div className="bg-white shadow rounded-lg p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-primary mb-4">
            {isLogin ? 'Đăng nhập Admin' : 'Đăng ký'}
          </h2>

          {/* Lỗi hiển thị */}
          {errorMessage && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                {...register('email', {
                  required: 'Vui lòng nhập email.',
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: 'Email không hợp lệ.'
                  }
                })}
                placeholder="email@example.com"
                className={`w-full px-4 py-2 border rounded ${
                  errors.email ? 'border-red-500' : 'border-primary'
                } focus:outline-none`}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            {/* Mật khẩu */}
            <div className="relative">
              <label className="block text-sm font-medium">Mật khẩu</label>
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: 'Vui lòng nhập mật khẩu.'
                })}
                placeholder="••••••••"
                className={`w-full px-4 py-2 border rounded ${
                  errors.password ? 'border-red-500' : 'border-primary'
                } focus:outline-none pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            {/* Ghi nhớ & quên mật khẩu */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...register('remember')} />
                Ghi nhớ đăng nhập
              </label>
              <Link to="/quen-mat-khau" className="text-primary text-sm">
                Quên mật khẩu?
              </Link>
            </div>

            <GradientButton type="submit" disabled={!isValid || isLoading} className="w-full" size="compact">
              {isLogin ? 'Đăng nhập' : 'Đăng ký'}
            </GradientButton>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;
