import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { authService } from '../../../../services/client/authService';
import GradientButton from '../../../../components/Client/GradientButton'; // điều chỉnh path nếu cần

const ChangePasswordTab = () => {
  const [hasPassword, setHasPassword] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    reset,
  } = useForm();

  // ✅ Kiểm tra user có mật khẩu không
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authService.getUserInfo();
        const user = res?.data?.user;

        // ✅ Sử dụng hasPassword từ server
        setHasPassword(user?.hasPassword || false);
      } catch (err) {
        console.error('Lỗi kiểm tra mật khẩu:', err);
      }
    };
    fetchUser();
  }, []);

  const onSubmit = async (data) => {
    try {
      const payload = hasPassword
        ? data
        : { newPassword: data.newPassword };

      console.log('[DEBUG PAYLOAD gửi lên]', payload);

      await authService.changePassword(payload);
      toast.success(hasPassword ? 'Đổi mật khẩu thành công!' : 'Thiết lập mật khẩu thành công!');
      reset();
    } catch (error) {
      console.error('[CHANGE PASSWORD ERROR]', error.response?.data);
      toast.error(error.response?.data?.message || 'Thao tác thất bại. Vui lòng thử lại.');
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
      <hr className="mb-5" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {hasPassword && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
            <input
              type="password"
              {...register('currentPassword', { required: 'Vui lòng nhập mật khẩu hiện tại' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring focus:ring-sky-200"
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.currentPassword.message}</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
          <input
            type="password"
            {...register('newPassword', {
              required: 'Vui lòng nhập mật khẩu mới',
              validate: (value) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value) ||
  'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.'

            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring focus:ring-sky-200"
          />
          {errors.newPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
          <input
            type="password"
            {...register('confirmPassword', {
              required: 'Vui lòng xác nhận mật khẩu',
              validate: (value) =>
                value === getValues('newPassword') || 'Mật khẩu xác nhận không khớp',
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring focus:ring-sky-200"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div>
       
<GradientButton
  type="submit"
  disabled={isSubmitting}
  size="compact" // hoặc "compact", "large" nếu bạn có style tương ứng
>
  {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
</GradientButton>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordTab;
