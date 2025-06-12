import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

/**
 * Component redirect cho các URL cũ sang URL mới SEO-friendly
 */

// Redirect từ /category/:id sang /danh-muc/:slug
export const CategoryRedirect = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Trong thực tế, bạn có thể cần call API để lấy slug từ id
    // Ở đây tạm thời redirect về trang chủ hoặc 404
    console.warn(`Old category URL accessed: /category/${id}`);
    navigate('/', { replace: true });
  }, [id, navigate]);

  return null;
};

// Redirect từ /product/:slug sang /san-pham/:slug
export const ProductRedirect = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(`Redirecting from /product/${slug} to /san-pham/${slug}`);
    navigate(`/san-pham/${slug}`, { replace: true });
  }, [slug, navigate]);

  return null;
};

// Redirect từ /news sang /tin-tuc
export const NewsRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Redirecting from /news to /tin-tuc');
    navigate('/tin-tuc', { replace: true });
  }, [navigate]);

  return null;
};

// Redirect từ /news/:id sang /tin-tuc/:slug
export const NewsDetailRedirect = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Trong thực tế, bạn có thể cần call API để lấy slug từ id
    console.warn(`Old news URL accessed: /news/${id}`);
    navigate('/tin-tuc', { replace: true });
  }, [id, navigate]);

  return null;
};

// Redirect từ /cart sang /gio-hang
export const CartRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Redirecting from /cart to /gio-hang');
    navigate('/gio-hang', { replace: true });
  }, [navigate]);

  return null;
};

// Redirect từ /checkout sang /thanh-toan
export const CheckoutRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Redirecting from /checkout to /thanh-toan');
    navigate('/thanh-toan', { replace: true });
  }, [navigate]);

  return null;
};

// Redirect từ /order-confirmation sang /xac-nhan-don-hang
export const OrderConfirmationRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Redirecting from /order-confirmation to /xac-nhan-don-hang');
    navigate('/xac-nhan-don-hang', { replace: true });
  }, [navigate]);

  return null;
};

// Redirect từ /user-profile sang /ho-so-ca-nhan
export const UserProfileRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Redirecting from /user-profile to /ho-so-ca-nhan');
    navigate('/ho-so-ca-nhan', { replace: true });
  }, [navigate]);

  return null;
};

// Redirect từ /orderlookup sang /tra-cuu-don-hang
export const OrderLookupRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Redirecting from /orderlookup to /tra-cuu-don-hang');
    navigate('/tra-cuu-don-hang', { replace: true });
  }, [navigate]);

  return null;
};

// Redirect từ /compare-products sang /so-sanh-san-pham
export const CompareProductsRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Redirecting from /compare-products to /so-sanh-san-pham');
    navigate('/so-sanh-san-pham', { replace: true });
  }, [navigate]);

  return null;
};
