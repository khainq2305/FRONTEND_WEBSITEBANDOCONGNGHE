import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { authService } from 'services/client/authService';
import Loader from 'components/common/Loader';
import { GoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === '/dang-nhap';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      if (isLogin) {
        await authService.login(data);
        alert('✅ Đăng nhập thành công!');
        navigate('/');
      } else {
        await authService.register(data);
        alert('🎉 Đăng ký thành công! Vui lòng kiểm tra email.');
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'Lỗi!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async (response) => {
    const { accessToken, userID } = response;
    if (!accessToken || !userID) return alert("Thiếu accessToken hoặc userID");

    try {
      await authService.loginWithFacebook({ accessToken, userID }, { withCredentials: true });
      alert('✅ Đăng nhập Facebook thành công!');
      navigate('/');
    } catch (err) {
      alert(err?.response?.data?.message || 'Đăng nhập Facebook thất bại!');
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      setIsLoading(true);
      await authService.loginWithGoogle(
        { token: credentialResponse.credential },
        { withCredentials: true }
      );
      alert('✅ Đăng nhập Google thành công!');
      navigate('/');
    } catch (err) {
      alert(err?.response?.data?.message || 'Đăng nhập Google thất bại!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      {isLoading && <Loader />}
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? 'Đăng nhập' : 'Đăng ký'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register('email', {
                required: 'Email là bắt buộc',
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Email không hợp lệ',
                },
              })}
              placeholder="Email"
              className="w-full px-4 py-2 border rounded"
            />
            <p className="text-red-500 text-sm">{errors.email?.message}</p>
          </div>

          <div>
            <input
              type="password"
              {...register('password', {
                required: 'Mật khẩu là bắt buộc',
                pattern: isLogin
                  ? undefined
                  : {
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^+=])[A-Za-z\d@$!%*?&#^+=]{8,}$/,
                      message: 'Mật khẩu yếu: 8+ ký tự, hoa, thường, số, ký tự đặc biệt',
                    },
              })}
              placeholder="Mật khẩu"
              className="w-full px-4 py-2 border rounded"
            />
            <p className="text-red-500 text-sm">{errors.password?.message}</p>
          </div>

          {isLogin && (
            <div className="flex items-center justify-between text-sm text-gray-600">
              <label className="flex items-center space-x-2">
                <input type="checkbox" {...register('remember')} />
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <a href="/forgot-password" className="text-blue-500 hover:underline">
                Quên mật khẩu?
              </a>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-orange-500 text-white font-bold py-2 rounded hover:bg-orange-600 transition"
          >
            {isLoading ? 'Đang xử lý...' : isLogin ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </form>

        <div className="mt-4 text-sm text-center">
          {isLogin ? (
            <>
              Bạn chưa có tài khoản?{' '}
              <Link to="/dang-ky" className="text-blue-500 hover:underline">
                Đăng ký
              </Link>
            </>
          ) : (
            <>
              Bạn đã có tài khoản?{' '}
              <Link to="/dang-nhap" className="text-blue-500 hover:underline">
                Đăng nhập
              </Link>
            </>
          )}
        </div>

        <div className="mt-6 text-center text-gray-600">Hoặc đăng nhập bằng</div>
        <div className="flex space-x-4 justify-center mt-4">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => alert('Đăng nhập Google thất bại!')}
          />
          <FacebookLogin
            appId="791326279879749"
            autoLoad={false}
            fields="name,email,picture"
            callback={handleFacebookLogin}
            onFailure={() => alert('Facebook login thất bại!')}
            render={(renderProps) => (
              <button onClick={renderProps.onClick} className="flex items-center px-4 py-2 border rounded">
                <img src="/facebook-icon.svg" className="w-5 h-5 mr-2" alt="Facebook" />
                Facebook
              </button>
            )}
          />
          <button className="flex items-center px-4 py-2 border rounded" disabled>
            <img src="/zalo-icon.svg" className="w-5 h-5 mr-2" alt="Zalo" />
            Zalo
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
