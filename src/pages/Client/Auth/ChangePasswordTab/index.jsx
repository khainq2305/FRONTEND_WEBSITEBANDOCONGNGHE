import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { authService } from '../../../../services/client/authService';
import GradientButton from '../../../../components/Client/GradientButton';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../../stores/AuthStore';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const ChangePasswordTab = () => {
  const [hasPassword, setHasPassword] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [lockRemainingTime, setLockRemainingTime] = useState(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    reset,
  } = useForm({
    mode: 'onChange'
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authService.getUserInfo();
        const user = res?.data?.user;
        setHasPassword(user?.hasPassword || false);

        if (user?.lockedUntil) {
          const lockedTime = new Date(user.lockedUntil).getTime();
          const now = Date.now();
          const remaining = Math.max(0, Math.ceil((lockedTime - now) / 1000));
          if (remaining > 0) {
            setIsLocked(true);
            setLockRemainingTime(remaining);
          }
        }
      } catch (err) {
        console.error('Lỗi kiểm tra mật khẩu:', err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!isLocked || lockRemainingTime == null) return;

    const interval = setInterval(() => {
      setLockRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsLocked(false);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isLocked, lockRemainingTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) return `${mins} phút ${secs} giây`;
    return `${secs} giây`;
  };

  const onSubmit = async (data) => {
    try {
      const payload = hasPassword ? data : { newPassword: data.newPassword };
      await authService.changePassword(payload);
      reset();

      if (hasPassword) {
        toast.success('Đổi mật khẩu thành công. Vui lòng đăng nhập lại.');
        await useAuthStore.getState().logout();
        navigate('/dang-nhap');
      } else {
        toast.success('Thiết lập mật khẩu thành công.');
      }

    } catch (error) {
      const errMsg = error.response?.data?.message || 'Thao tác thất bại. Vui lòng thử lại.';
      if (errMsg.includes('Vui lòng thử lại sau')) {
        const secondsMatch = errMsg.match(/sau (\d+) giây/);
        if (secondsMatch) {
          const seconds = parseInt(secondsMatch[1]);
          setIsLocked(true);
          setLockRemainingTime(seconds);
        }
        return;
      }
      toast.error(errMsg);
    }
  };




  return (
    <div className="bg-white p-6 rounded-md shadow border border-gray-200">

      <h2 className="text-xl font-semibold text-gray-800 mb-1">
        {hasPassword ? 'Đổi mật khẩu' : 'Thiết lập mật khẩu'}
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
      </p>
      <hr className="mb-5 border-t border-gray-200 dark:border-gray-700" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-md mx-auto" >
        {hasPassword && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu hiện tại <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <input
                placeholder="Nhập mật khẩu hiện tại"
                type={showCurrentPassword ? 'text' : 'password'}
                {...register('currentPassword', {
                  required: 'Vui lòng nhập mật khẩu hiện tại',
                })}
                className={`input-style pr-10 ${isLocked || errors.currentPassword ? 'error' : ''}`}
                disabled={isLocked}
              />



              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                aria-label="Hiện/Ẩn mật khẩu"
              >
                {showCurrentPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.currentPassword.message}</p>
            )}
            {isLocked && lockRemainingTime != null && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
                <span>
                  Bạn đã nhập sai quá nhiều lần. Vui lòng thử lại sau <strong>{formatTime(lockRemainingTime)}</strong>.
                </span>
              </p>
            )}

          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu mới <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <input
              placeholder="Nhập mật khẩu mới"
              type={showNewPassword ? 'text' : 'password'}
              {...register('newPassword', {
                validate: {
                  required: (value) => {
                    if (hasPassword && !getValues('currentPassword')) return true;
                    return !!value || 'Vui lòng nhập mật khẩu mới';
                  },
                  complexity: (value) => {
                    if (!value) return true;
                    return (
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value) ||
                      'Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, thường, số và ký tự đặc biệt.'
                    );
                  },
                },
              })}
              className={`input-style pr-10 ${errors.newPassword ? 'error' : ''}`}
              disabled={isLocked}
            />

            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              onClick={() => setShowNewPassword(!showNewPassword)}
              aria-label="Hiện/Ẩn mật khẩu mới"
            >
              {showNewPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Xác nhận mật khẩu mới <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <input
              placeholder="Xác nhận mật khẩu mới"
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword', {
                validate: {
                  required: (value) => {
                    if (hasPassword && !getValues('currentPassword')) return true;
                    return !!value || 'Vui lòng xác nhận mật khẩu';
                  },
                  match: (value) => {
                    if (!value) return true;
                    return value === getValues('newPassword') || 'Mật khẩu xác nhận không khớp';
                  },
                },
              })}
              className={`input-style pr-10 ${errors.confirmPassword ? 'error' : ''}`}
              disabled={isLocked}
            />


            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label="Hiện/Ẩn mật khẩu xác nhận"
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div>
          <GradientButton type="submit" disabled={isSubmitting || isLocked} size="compact">
            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </GradientButton>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordTab;