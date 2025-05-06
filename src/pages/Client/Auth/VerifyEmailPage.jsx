import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { authService } from 'services/client/authService';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('⏳ Đang xác thực...');
  
  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) return setStatus('❌ Thiếu token xác thực!');

    authService.verifyEmail(token)
      .then(() => setStatus('✅ Xác thực email thành công!'))
      .catch(() => setStatus('❌ Token không hợp lệ hoặc đã hết hạn!'));
  }, []);

  return (
    <div className="text-center mt-20 text-xl font-semibold text-gray-700">
      {status}
    </div>
  );
};

export default VerifyEmailPage;
