import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '@/stores/AuthStore';
import { toast } from 'react-toastify';

const RequireLoginAction = ({ children, onAuthorized }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (e) => {
    
    if (!user) {
      toast.info('Bạn cần đăng nhập để thực hiện hành động này!');
      navigate('/dang-nhap', { state: { from: location }, replace: true });
      return;
    }

    if (typeof onAuthorized === 'function') {
      onAuthorized();
    }
  };

  return (
    <div onClick={handleClick} style={{ display: 'inline-block', cursor: 'pointer' }}>
      {children}
    </div>
  );
};

export default RequireLoginAction;
