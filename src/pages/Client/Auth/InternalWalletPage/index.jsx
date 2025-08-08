import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableHead,
  TableRow, TableCell, TableBody, Button,
  CircularProgress
} from '@mui/material';
import { walletService } from '../../../../services/client/walletService';
import { formatCurrencyVND } from '../../../../utils/formatCurrency';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { KeyRound, ShieldOff } from 'lucide-react';
import ChangePinModal from '../ChangePinModal'; // đường dẫn đúng


// Map các loại giao dịch để hiển thị label và màu sắc
const typeMap = {
  topup: { label: 'Nạp tiền', color: 'text-green-600' },
  spend: { label: 'Thanh toán đơn hàng', color: 'text-red-600' },
  refund: { label: 'Hoàn tiền', color: 'text-blue-600' }
};

const InternalWalletPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
const [showChangePinModal, setShowChangePinModal] = useState(false);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const res = await walletService.getWallet(); // Sử dụng getWallet để lấy đầy đủ thông tin
     const walletData = res?.data?.data || {};
setWallet(walletData); // ✅ Không cần tự thêm hasPin nữa vì backend đã có

        setEmail(walletData.email || '');
        setBalance(Number(walletData.balance) || 0);

        // Nếu chưa xác minh email (ví dụ: không có email) → chuyển hướng
        if (!walletData.email) {
          // Thay vì '/xac-minh-email-vi', bạn có thể chuyển hướng về trang đăng nhập
          return navigate('/dang-nhap');
        }

        // Luôn lấy lịch sử giao dịch khi tải trang
        const historyRes = await walletService.getTransactions();
        setTransactions(Array.isArray(historyRes?.data?.data) ? historyRes.data.data : []);

      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu ví:', err);
        // Xử lý lỗi nếu không thể lấy dữ liệu
        navigate('/dang-nhap'); // Hoặc trang lỗi khác
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [navigate]);

  const handleSetupPinClick = async () => {
    try {
      // Gửi yêu cầu tạo token xác minh
      const res = await walletService.sendPinVerification();
      alert(res.data.message);
      // Chuyển hướng đến trang xác minh với state email
      navigate('/xac-minh-ma-pin', { state: { email: email } });
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể gửi mã xác minh.');
    }
  };
// Thiết lập hoặc đổi mã PIN
const handleSetupOrChangePinClick = async () => {
  try {
    const res = await walletService.sendPinVerification();
    alert(res.data.message);
    navigate('/xac-minh-ma-pin', { state: { email } });
  } catch (err) {
    alert(err.response?.data?.message || 'Không thể gửi mã xác minh.');
  }
};

// Quên mã PIN
const handleForgotPinClick = async () => {
  try {
    const res = await walletService.sendForgotPin();
  
    navigate('/xac-minh-ma-pin?mode=forgot', { state: { email } }); // ✅ truyền mode=forgot
  } catch (err) {
    alert(err.response?.data?.message || 'Không thể gửi mã xác minh quên PIN.');
  }
};

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-[calc(100vh-200px)]">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="space-y-6">
      {/* Số dư ví */}
      <Box className="flex flex-col md:flex-row items-center justify-between bg-white border border-gray-200 rounded-md p-4 shadow-sm">
        <div className="flex-1">
          <Typography variant="body2" className="text-gray-500">Số dư ví hiện tại</Typography>
          <Typography variant="h5" className="font-bold text-gray-800 mt-1">
            {formatCurrencyVND(balance)}
          </Typography>
        </div>
        <div className="flex-shrink-0 mt-4 md:mt-0 flex flex-col md:flex-row items-stretch md:items-center gap-2">
          {/* Nút "Thiết lập mã PIN" hoặc "Đổi mã PIN" */}
          {!wallet?.hasPin ? (
            <Button
              variant="outlined"
              size="small"
              onClick={handleSetupPinClick}
              startIcon={<KeyRound size={16} />}
            >
              Thiết lập mã PIN
            </Button>
          ) : (
            <>
<Button
  variant="outlined"
  size="small"
  onClick={() => setShowChangePinModal(true)}
  startIcon={<KeyRound size={16} />}
>
  Đổi mã PIN
</Button>


              <Button
                variant="outlined"
                color="error"
                size="small"
           onClick={handleForgotPinClick}

                startIcon={<ShieldOff size={16} />}
              >
                Quên mã PIN
              </Button>
            </>
          )}
        </div>
      </Box>

      {/* Lịch sử giao dịch */}
      <Paper elevation={0} className="border border-gray-200 rounded-md overflow-hidden">
        <Table size="small">
          <TableHead className="bg-gray-50">
            <TableRow>
              <TableCell className="text-sm font-medium text-gray-700">Loại</TableCell>
              <TableCell className="text-sm font-medium text-gray-700">Nội dung</TableCell>
              <TableCell className="text-sm font-medium text-gray-700">Số tiền</TableCell>
              <TableCell className="text-sm font-medium text-gray-700">Thời gian</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id} hover>
                <TableCell>
                  <Typography variant="body2" className={`font-medium ${typeMap[tx.type]?.color || 'text-gray-800'}`}>
                    {typeMap[tx.type]?.label || tx.type}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" className="text-gray-600">
                    {tx.description || '---'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    className={`font-medium ${tx.type === 'spend' ? 'text-red-600' : 'text-green-600'}`}
                  >
                    {tx.type === 'spend' ? '-' : '+'}{formatCurrencyVND(tx.amount)}
                  </Typography>
                </TableCell>
                <TableCell className="text-gray-500 text-sm">
                  {format(new Date(tx.createdAt), 'HH:mm dd/MM/yyyy', { locale: vi })}
                </TableCell>
              </TableRow>
            ))}
            {transactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" className="text-gray-500 py-6">
                  Không có giao dịch nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
<ChangePinModal open={showChangePinModal} onClose={() => setShowChangePinModal(false)} />

    </Box>

  );
};

export default InternalWalletPage;
