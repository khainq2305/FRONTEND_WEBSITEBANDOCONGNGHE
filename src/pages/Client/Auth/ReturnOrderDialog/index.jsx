// src/pages/Client/Order/ReturnOrderPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  TextareaAutosize,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Checkbox,
} from '@mui/material';
import { toast } from 'react-toastify';
import { Upload, X, FileImage, Video, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { orderService } from '../../../../services/client/orderService';
import Loader from '../../../../components/common/Loader';
import { formatCurrencyVND } from '../../../../utils/formatCurrency';
import { IconButton } from '@mui/material';

const returnReasons = [
  { id: 'WRONG_SIZE_COLOR', label: 'Nhận sai kích cỡ, màu sắc, hoặc sai sản phẩm' },
  { id: 'NOT_AS_DESCRIBED', label: 'Sản phẩm khác với mô tả của shop' },
  { id: 'DEFECTIVE', label: 'Sản phẩm bị lỗi, hư hỏng, không hoạt động' },
  { id: 'CHANGE_MIND', label: 'Không còn nhu cầu mua nữa' },
  { id: 'OTHER', label: 'Lý do khác (vui lòng mô tả bên dưới)' },
];

const steps = ['Chọn lý do', 'Chọn sản phẩm', 'Tải bằng chứng', 'Thông tin hoàn tiền', 'Xác nhận'];

const ReturnOrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;
  const orderPaymentMethodCode = location.state?.orderPaymentMethodCode;
  const initialOrderProducts = location.state?.orderProducts;

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);

  // Step 1 states
  const [selectedReason, setSelectedReason] = useState('');
  const [detailedReason, setDetailedReason] = useState('');

  // Step 2 states (chọn sản phẩm muốn trả toàn bộ số lượng)
  const [selectedReturnItems, setSelectedReturnItems] = useState({}); // { skuId: quantityToReturn, ... }
  const [selectAll, setSelectAll] = useState(false); // ✅ State mới cho checkbox "Chọn tất cả"

  // Step 3 states
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const fileInputRef = useRef(null);

  // Step 4 states
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [showBankInfoForm, setShowBankInfoForm] = useState(false);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  useEffect(() => {
    if (!orderId) {
      toast.error('Không tìm thấy thông tin đơn hàng để trả.');
      navigate('/purchase');
      return;
    }

    if (initialOrderProducts && initialOrderProducts.length > 0) {
      setOrderData({ products: initialOrderProducts });
      const initialItems = {};
      initialOrderProducts.forEach(product => {
        initialItems[product.skuId] = 0; // Mặc định không chọn
      });
      setSelectedReturnItems(initialItems);
      setLoading(false);
    } else {
      const fetchOrderDetail = async () => {
        try {
          setLoading(true);
          const res = await orderService.getOrderDetail(orderId);
          if (res.data?.data) {
            setOrderData(res.data.data);
            const initialItems = {};
            res.data.data.products.forEach(product => {
              initialItems[product.skuId] = 0;
            });
            setSelectedReturnItems(initialItems);
          } else {
            toast.error('Không tải được chi tiết đơn hàng.');
            navigate('/purchase');
          }
        } catch (error) {
          console.error("Failed to fetch order details:", error);
          toast.error('Lỗi khi tải chi tiết đơn hàng.');
          navigate('/purchase');
        } finally {
          setLoading(false);
        }
      };
      fetchOrderDetail();
    }

    const methodsRequiringBankInfo = ['cod', 'bank_transfer'];
    setShowBankInfoForm(orderPaymentMethodCode && methodsRequiringBankInfo.includes(orderPaymentMethodCode));
  }, [orderId, orderPaymentMethodCode, initialOrderProducts, navigate]);

  // ✅ useEffect để cập nhật trạng thái "Chọn tất cả"
  useEffect(() => {
    if (orderData?.products && orderData.products.length > 0) {
      const allSelected = orderData.products.every(product => selectedReturnItems[product.skuId] === product.quantity);
      const anySelected = orderData.products.some(product => selectedReturnItems[product.skuId] > 0);

      if (allSelected) {
        setSelectAll(true);
      } else if (anySelected) {
        setSelectAll(false); // Không phải tất cả nhưng có ít nhất một được chọn
      } else {
        setSelectAll(false); // Không có cái nào được chọn
      }
    } else {
      setSelectAll(false);
    }
  }, [selectedReturnItems, orderData]);


  const handleNext = () => {
    // Validate current step before moving next
    if (currentStep === 0) {
      if (!selectedReason) {
        toast.error('Vui lòng chọn một lý do trả hàng.');
        return;
      }
      if (selectedReason === 'OTHER' && !detailedReason.trim()) {
        toast.error('Vui lòng nhập mô tả chi tiết cho "Lý do khác".');
        return;
      }
    } else if (currentStep === 1) {
      const selectedCount = Object.values(selectedReturnItems).filter(qty => qty > 0).length;
      if (selectedCount === 0) {
        toast.error('Vui lòng chọn ít nhất một sản phẩm để trả hàng.');
        return;
      }
    } else if (currentStep === 2) {
      // Validation for evidence files can be optional or required based on your policy
    } else if (currentStep === 3) {
      if (showBankInfoForm && (!bankName.trim() || !accountNumber.trim() || !accountHolderName.trim())) {
        toast.error('Vui lòng nhập đầy đủ thông tin tài khoản ngân hàng để nhận hoàn tiền.');
        return;
      }
    }

    setCurrentStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setCurrentStep((prevActiveStep) => prevActiveStep - 1);
  };

  // ✅ Xử lý checkbox cho từng sản phẩm (luôn trả hết số lượng đã mua nếu được chọn)
  const handleItemCheckboxChange = (skuId, isChecked) => {
    const product = orderData?.products?.find(p => p.skuId === skuId);
    if (!product) return;

    setSelectedReturnItems(prev => ({
      ...prev,
      [skuId]: isChecked ? product.quantity : 0, // Nếu chọn thì lấy hết số lượng đã mua, không thì 0
    }));
  };

  // ✅ Xử lý checkbox "Chọn tất cả"
  const handleSelectAllChange = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);

    const newSelectedItems = {};
    orderData?.products?.forEach(product => {
      newSelectedItems[product.skuId] = checked ? product.quantity : 0;
    });
    setSelectedReturnItems(newSelectedItems);
  };


  // Step 3 handlers
  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (evidenceFiles.length + newFiles.length > 7) {
        toast.error('Chỉ có thể tải lên tối đa 7 file ảnh/video.');
        return;
      }
      setEvidenceFiles((prevFiles) => [...prevFiles, ...newFiles]);
      e.target.value = null;
    }
  };

  const removeFile = (indexToRemove) => {
    setEvidenceFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
  };


  const handleSubmitFinal = async () => {
    setSubmitting(true);
    const formData = new FormData();
    formData.append("orderId", String(Number(orderId)));
    formData.append('reason', selectedReason === 'OTHER' ? detailedReason : selectedReason);

    const itemsToReturn = Object.keys(selectedReturnItems)
      .filter(skuId => selectedReturnItems[skuId] > 0)
      .map(skuId => ({
        skuId: skuId,
        quantity: selectedReturnItems[skuId], // Lấy số lượng đã được thiết lập (toàn bộ hoặc 0)
      }));

    formData.append('itemsToReturn', JSON.stringify(itemsToReturn));

    if (showBankInfoForm) {
      formData.append('bankName', bankName.trim());
      formData.append('accountNumber', accountNumber.trim());
      formData.append('accountHolderName', accountHolderName.trim());
    }

    evidenceFiles.forEach((file) => {
      if (file.type.startsWith('image/')) {
        formData.append('images', file);
      } else if (file.type.startsWith('video/')) {
        formData.append('videos', file);
      }
    });

    try {
      await orderService.returnRequest(formData);
      setSubmissionSuccess(true);
      toast.success('Yêu cầu trả hàng đã được gửi thành công!');
      // navigate('/purchase'); // Có thể điều hướng về trang đơn hàng
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Gửi yêu cầu thất bại, vui lòng thử lại.');
      console.error("Return request failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader fullscreen={true} />;
  }

  if (submissionSuccess) {
    return (
      <Box className="flex flex-col items-center justify-center min-h-[50vh] bg-white p-6 rounded-lg shadow-md">
        <CheckCircle className="text-green-500 mb-4" size={64} />
        <Typography variant="h5" component="h2" gutterBottom className="text-gray-800 font-semibold">
          Yêu cầu trả hàng đã được gửi thành công!
        </Typography>
        <Typography variant="body1" align="center" className="text-gray-600 mb-6">
          Chúng tôi sẽ xem xét yêu cầu của bạn và phản hồi trong thời gian sớm nhất. Vui lòng kiểm tra email hoặc mục "Đơn hàng của tôi" để biết cập nhật.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/purchase')}
        >
          Quay lại Đơn hàng của tôi
        </Button>
      </Box>
    );
  }

  return (
    <Box className="w-full p-6 sm:p-8 bg-white rounded-lg shadow-md mt-4 mb-16"
         sx={{ maxWidth: 1200, mx: 'auto' }}
    >
      <Typography variant="h5" component="h1" align="center" fontWeight="bold" mb={4}>
        Yêu cầu Trả hàng / Hoàn tiền
      </Typography>

      <Stepper activeStep={currentStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box>
        {/* Step 1: Chọn lý do & mô tả */}
        {currentStep === 0 && (
          <Box>
            <Typography variant="h6" component="p" className="font-semibold text-gray-800 mb-3">1. Lý do trả hàng của bạn là gì?</Typography>
            <RadioGroup value={selectedReason} onChange={(e) => setSelectedReason(e.target.value)} sx={{ mb: 3 }}>
              {returnReasons.map((reason) => (
                <FormControlLabel key={reason.id} value={reason.id} control={<Radio size="small" />} label={reason.label} />
              ))}
            </RadioGroup>

            <Typography variant="h6" component="p" className="font-semibold text-gray-800 mb-1">2. Mô tả chi tiết (không bắt buộc)</Typography>
            <TextareaAutosize
              minRows={3}
              placeholder="Để yêu cầu được xử lý nhanh hơn, bạn có thể mô tả thêm về vấn đề..."
              value={detailedReason}
              onChange={(e) => setDetailedReason(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </Box>
        )}

        {/* Step 2: Chọn sản phẩm muốn trả */}
        {currentStep === 1 && (
          <Box>
            <Typography variant="h6" component="p" className="font-semibold text-gray-800 mb-3">3. Chọn sản phẩm muốn trả:</Typography>

            {/* ✅ Checkbox "Chọn tất cả" */}
            {orderData?.products && orderData.products.length > 0 && (
              <Box mb={2} display="flex" alignItems="center">
                <Checkbox
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                  size="medium"
                  sx={{ p: 0, mr: 1 }}
                />
                <Typography variant="body1" fontWeight="bold">Chọn tất cả ({orderData.products.length} sản phẩm)</Typography>
              </Box>
            )}

            {orderData?.products && orderData.products.length > 0 ? (
              orderData.products.map(product => (
                <Box key={product.skuId} display="flex" alignItems="center" mb={2} p={1.5} border={1} borderColor="grey.300" borderRadius={1} bgcolor="white">
                  <Checkbox
                    checked={selectedReturnItems[product.skuId] === product.quantity} // Checked nếu số lượng trả bằng số lượng mua
                    onChange={(e) => handleItemCheckboxChange(String(product.skuId), e.target.checked)}
                    size="small"
                    sx={{ p: 0, mr: 1 }}
                  />
                  <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-sm border border-gray-200 mr-3 flex-shrink-0" />
                  <Box flexGrow={1}>
                    <Typography variant="body2" fontWeight="medium" sx={{ mb: 0.5 }}>{product.name}</Typography>
                    {product.variation && <Typography variant="caption" color="text.secondary">Phân loại: {product.variation}</Typography>}
                    <Typography variant="body2" color="text.secondary">Số lượng đã mua: {product.quantity}</Typography>
                    <Typography variant="body2" color="primary" fontWeight="bold">{formatCurrencyVND(product.price)}</Typography>
                  </Box>
                  {/* ✅ BỎ TextField "SL trả" đi */}
                  {/*
                  <TextField
                    label="SL trả"
                    type="number"
                    variant="outlined"
                    size="small"
                    sx={{ width: 80, ml: 2 }}
                    value={selectedReturnItems[product.skuId] || ''}
                    onChange={(e) => handleItemQuantityChange(String(product.skuId), e.target.value)}
                    inputProps={{ min: 0, max: product.quantity }}
                  />
                  */}
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">Không có sản phẩm nào trong đơn hàng này.</Typography>
            )}
          </Box>
        )}

        {/* Step 3: Tải lên bằng chứng */}
        {currentStep === 2 && (
          <Box>
            <Typography variant="h6" component="p" className="font-semibold text-gray-800 mb-3">4. Tải lên bằng chứng (ảnh/video)</Typography>
            <Box
              onClick={() => fileInputRef.current.click()}
              className="mt-1 flex justify-center w-full px-6 py-8 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-sky-500 bg-white"
            >
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-sky-600">Nhấn để chọn file</span>
                </p>
                <p className="text-xs text-gray-500">Hỗ trợ PNG, JPG, MP4... Tối đa 7 files.</p>
              </div>
            </Box>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*,video/*"
              className="hidden"
            />
            {evidenceFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <Typography variant="body2" className="font-medium text-gray-700">Các file đã chọn:</Typography>
                {evidenceFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-2 rounded-md border border-gray-200">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {file.type.startsWith('image/') ? (
                        <FileImage className="h-5 w-5 text-blue-500 flex-shrink-0" />
                      ) : (
                        <Video className="h-5 w-5 text-purple-500 flex-shrink-0" />
                      )}
                      <span className="text-sm text-gray-800 truncate" title={file.name}>
                        {file.name}
                      </span>
                    </div>
                    <IconButton size="small" onClick={() => removeFile(index)} aria-label="Xóa file">
                      <X className="h-4 w-4 text-red-500 hover:text-red-700" />
                    </IconButton>
                  </div>
                ))}
              </div>
            )}
          </Box>
        )}

        {/* Step 4: Thông tin hoàn tiền */}
        {currentStep === 3 && (
          <Box>
            {showBankInfoForm ? (
              <Box p={2} border={1} borderColor="warning.light" borderRadius={1} bgcolor="warning.lightest">
                <Typography variant="h6" component="p" sx={{ fontWeight: 'bold', color: 'orange.700', mb: 1 }}>
                  5. Thông tin tài khoản nhận hoàn tiền
                </Typography>
                <Typography variant="body2" sx={{ color: 'orange.600', mb: 3 }}>
                  Vui lòng cung cấp chính xác thông tin tài khoản ngân hàng của bạn để chúng tôi có thể xử lý việc hoàn tiền nhanh chóng nhất.
                </Typography>
                <TextField
                  label="Tên ngân hàng"
                  variant="outlined"
                  size="small"
                  fullWidth
                  margin="normal"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  required
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Số tài khoản"
                  variant="outlined"
                  size="small"
                  fullWidth
                  margin="normal"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Tên chủ tài khoản"
                  variant="outlined"
                  size="small"
                  fullWidth
                  margin="normal"
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            ) : (
              <Box p={2} border={1} borderColor="info.light" borderRadius={1} bgcolor="info.lightest">
                <Typography variant="h6" component="p" sx={{ fontWeight: 'bold', color: 'blue.700', mb: 1 }}>
                  5. Thông tin hoàn tiền
                </Typography>
                <Typography variant="body2" sx={{ color: 'blue.600', mb: 2 }}>
                  Đơn hàng này được thanh toán qua **{orderPaymentMethodCode?.toUpperCase() || 'phương thức điện tử'}**.
                  Tiền hoàn sẽ được xử lý tự động về phương thức thanh toán ban đầu của bạn.
                </Typography>
                <Typography variant="body2" sx={{ color: 'blue.600' }}>
                  Vui lòng kiểm tra tài khoản {orderPaymentMethodCode?.toUpperCase() || 'phương thức điện tử'} của bạn trong vòng vài ngày làm việc.
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Step 5: Xác nhận */}
        {currentStep === 4 && (
          <Box className="flex flex-col items-center p-4">
            <Typography variant="h6" component="p" className="font-semibold text-gray-800 mb-4">Xác nhận thông tin yêu cầu trả hàng:</Typography>
            <Box className="w-full text-left space-y-3">
              <Typography variant="body1">
                <span className="font-semibold">Lý do:</span> {returnReasons.find(r => r.id === selectedReason)?.label || selectedReason}
                {selectedReason === 'OTHER' && detailedReason && ` - ${detailedReason}`}
              </Typography>
              <Typography variant="body1" className="font-semibold">Sản phẩm muốn trả:</Typography>
              {Object.keys(selectedReturnItems).filter(skuId => selectedReturnItems[skuId] > 0).map(skuId => {
                const product = orderData?.products?.find(p => p.skuId === skuId);
                return product ? (
                  <Typography key={skuId} variant="body2" className="ml-4">
                    - {product.name} ({product.variation}): {selectedReturnItems[skuId]} sản phẩm
                  </Typography>
                ) : null;
              })}
              <Typography variant="body1">
                <span className="font-semibold">Bằng chứng:</span> {evidenceFiles.length > 0 ? `${evidenceFiles.length} file đã tải lên` : 'Không có'}
              </Typography>
              {showBankInfoForm && (
                <Box>
                  <Typography variant="body1" className="font-semibold">Thông tin hoàn tiền:</Typography>
                  <Typography variant="body2" className="ml-4">- Tên ngân hàng: {bankName}</Typography>
                  <Typography variant="body2" className="ml-4">- Số tài khoản: {accountNumber}</Typography>
                  <Typography variant="body2" className="ml-4">- Tên chủ tài khoản: {accountHolderName}</Typography>
                </Box>
              )}
              {!showBankInfoForm && (
                <Typography variant="body1" className="font-semibold">Thông tin hoàn tiền: Hoàn tự động qua {orderPaymentMethodCode?.toUpperCase() || 'phương thức điện tử'}</Typography>
              )}
            </Box>
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Button
          color="inherit"
          disabled={currentStep === 0 || submitting}
          onClick={handleBack}
          sx={{ mr: 1 }}
          startIcon={<ArrowLeft size={16} />}
        >
          Quay lại
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        {currentStep === steps.length - 1 ? (
          <Button onClick={handleSubmitFinal} variant="contained" color="primary" disabled={submitting} endIcon={submitting ? <CircularProgress size={20} color="inherit" /> : null}>
            {submitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
          </Button>
        ) : (
          <Button onClick={handleNext} variant="contained" color="primary" endIcon={<ArrowRight size={16} />}>
            Tiếp theo
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ReturnOrderPage;