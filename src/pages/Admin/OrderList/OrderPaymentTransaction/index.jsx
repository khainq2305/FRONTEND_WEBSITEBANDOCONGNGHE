import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  IconButton, 
  Typography, 
  Box, 
  Divider, 
  Paper, 
  CircularProgress 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { API_ENDPOINT } from '@/config/apiEndpoints';
import { toast } from 'react-toastify';
import { ordersService } from 'services/admin/ordersService';
const PaymentTransactionDetails = ({ open, onClose, orderId }) => {
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && orderId) {
      fetchTransactionDetails();
    }
  }, [open, orderId]);

  const fetchTransactionDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await  ordersService.getPaymentTransaction(orderId);
      if (response.data.success) {
        setTransaction(response.data.data);
      } else {
        setError('Không thể tải thông tin giao dịch');
        toast.error('Không thể tải thông tin giao dịch');
      }
    } catch (err) {
      console.error('Error fetching transaction details:', err);
      setError('Đã xảy ra lỗi khi tải thông tin giao dịch');
      toast.error('Đã xảy ra lỗi khi tải thông tin giao dịch');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '0 đ';
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount) + ' đ';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      'pending': 'Chờ thanh toán',
      'success': 'Đã thanh toán',
      'failed': 'Thanh toán thất bại',
      'refunded': 'Đã hoàn tiền',
      'cancelled': 'Đã hủy'
    };
    return statusMap[status] || status;
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: { 
          width: '400px',
          maxWidth: '90vw',
          borderRadius: '8px'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        bgcolor: '#f5f5f5',
        borderBottom: '1px solid #ddd'
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          Chi tiết giao dịch
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 3, textAlign: 'center', color: 'error.main' }}>
            {error}
          </Box>
        ) : transaction ? (
          <Paper elevation={0} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Header with logo or icon */}
              <Box sx={{ textAlign: 'center', mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  BIÊN LAI THANH TOÁN
                </Typography>
              </Box>
              
              <Divider />
              
              {/* Chi tiết giao dịch */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Mã giao dịch:</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {transaction.transactionCode || 'N/A'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Mã đơn hàng:</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {"DH" + transaction.orderId.toString().padStart(5, '0')}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Phương thức:</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {transaction.method?.name || 'N/A'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Số tiền:</Typography>
                  <Typography variant="body2" fontWeight="bold" color="primary.main">
                    {formatCurrency(transaction.amount)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Trạng thái:</Typography>
                  <Typography 
                    variant="body2" 
                    fontWeight="medium"
                    sx={{ 
                      color: transaction.status === 'completed' ? 'success.main' : 
                             transaction.status === 'failed' ? 'error.main' : 
                             transaction.status === 'pending' ? 'warning.main' : 'text.primary'
                    }}
                  >
                    {getStatusLabel(transaction.status)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Thời gian thanh toán:</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {formatDate(transaction.paymentTime)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Thời gian tạo:</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {formatDate(transaction.createdAt)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Thời gian cập nhật:</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {formatDate(transaction.updatedAt)}
                  </Typography>
                </Box>
                
                {transaction.paymentDetails && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Chi tiết thanh toán:
                    </Typography>
                    <Typography variant="body2" 
                      sx={{ 
                        whiteSpace: 'pre-wrap', 
                        bgcolor: '#f8f8f8', 
                        p: 1, 
                        borderRadius: 1 
                      }}
                    >
                      {typeof transaction.paymentDetails === 'string' 
                        ? transaction.paymentDetails 
                        : JSON.stringify(transaction.paymentDetails, null, 2)}
                    </Typography>
                  </Box>
                )}
              </Box>
              
              <Divider sx={{ my: 1 }} />
              
              {/* Footer */}
              <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Đây là biên lai điện tử cho giao dịch
                </Typography>
              </Box>
            </Box>
          </Paper>
        ) : (
          <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
            Không có thông tin giao dịch
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentTransactionDetails;