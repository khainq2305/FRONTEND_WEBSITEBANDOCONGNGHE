import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  CardElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-toastify';
import Loader from '@/components/common/Loader';
import { formatCurrencyVND } from '@/utils/formatCurrency';
import { orderService } from '@/services/client/orderService';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const StripeCheckoutForm = () => {
  const { orderCode } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  const clientSecret = searchParams.get('clientSecret');

  const [isLoading, setIsLoading] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderService.getOrderById(orderCode);
        setOrderInfo(res.data?.order || res.data?.data);
      } catch (err) {
        console.error('Lỗi lấy đơn hàng:', err);
        toast.error('Không thể lấy thông tin đơn hàng');
      }
    };
    fetchOrder();
  }, [orderCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setIsLoading(true);
    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        console.error('Stripe error:', result.error);
        toast.error(result.error.message || 'Thanh toán thất bại!');
        return;
      }

      if (result.paymentIntent.status === 'succeeded') {
        toast.success('Thanh toán thành công!');
        navigate(`/order-confirmation?orderCode=${orderCode}`);
      } else {
        toast.error('Thanh toán chưa thành công');
      }
    } catch (err) {
      console.error('Lỗi thanh toán:', err);
      toast.error('Đã xảy ra lỗi khi thanh toán');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-4">Thanh toán Visa/MasterCard</h2>
      {orderInfo ? (
        <div className="mb-6">
          <p>Mã đơn hàng: <strong>{orderInfo.code}</strong></p>
          <p>Số tiền cần thanh toán: <strong>{formatCurrencyVND(orderInfo.totalPayable || orderInfo.total || 0)}</strong></p>
        </div>
      ) : (
        <Loader />
      )}
      <form onSubmit={handleSubmit}>
        <div className="border rounded-md p-3 mb-4">
          <CardElement options={{ hidePostalCode: true }} />
        </div>
        <button
          type="submit"
          disabled={isLoading || !stripe}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
        >
          {isLoading ? 'Đang xử lý...' : 'Thanh toán'}
        </button>
      </form>
    </div>
  );
};

const StripeCheckoutPage = () => (
  <Elements stripe={stripePromise}>
    <StripeCheckoutForm />
  </Elements>
);

export default StripeCheckoutPage;
