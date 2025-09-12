import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  CircularProgress,
  Checkbox,
  IconButton,
  Divider
} from '@mui/material';
import { toast } from 'react-toastify';
import { Camera, Video, X } from 'lucide-react';
import { orderService } from '../../../../services/client/orderService';
import { returnRefundService } from '../../../../services/client/returnRefundService';
import Loader from '../../../../components/common/Loader';
import { formatCurrencyVND } from '../../../../utils/formatCurrency';
import useAuthStore from '../../../../stores/AuthStore';
import { confirmReturn } from '../../../../components/common/ConfirmDeleteDialog';

const returnReasons = [
  { id: 'WRONG_SIZE_COLOR', label: 'Nhận sai kích cỡ, màu sắc, hoặc sai sản phẩm' },
  { id: 'NOT_AS_DESCRIBED', label: 'Sản phẩm khác với mô tả của shop' },
  { id: 'DEFECTIVE', label: 'Sản phẩm bị lỗi, hư hỏng, không hoạt động' },
  { id: 'CHANGE_MIND', label: 'Không còn nhu cầu mua nữa' },
  { id: 'OTHER', label: 'Lý do khác (vui lòng mô tả bên dưới)' }
];
// Chỉ còn 2 nhóm tình huống, bỏ "OTHER"
const returnSituations = [
  {
    id: 'seller_pays',
    label: 'Shop chịu phí vận chuyển (hàng lỗi, sai sản phẩm, khác mô tả...)',
    reasons: [
      { id: 'WRONG_SIZE_COLOR', label: 'Nhận sai kích cỡ, màu sắc, hoặc sai sản phẩm' },
      { id: 'NOT_AS_DESCRIBED', label: 'Sản phẩm khác với mô tả của shop' },
      { id: 'DEFECTIVE', label: 'Sản phẩm bị lỗi, hư hỏng, không hoạt động' }
    ]
  },
  {
    id: 'customer_pays',
    label: 'Khách hàng chịu phí vận chuyển (đổi ý, không muốn mua nữa...)',
    reasons: [
      { id: 'CHANGE_MIND', label: 'Không còn nhu cầu mua nữa' },
      { id: 'ORDER_BY_MISTAKE', label: 'Đặt nhầm sản phẩm' },
      { id: 'FOUND_BETTER_PRICE', label: 'Tìm được sản phẩm giá tốt hơn' }
    ]
  }
];

const ReturnOrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;
  const orderPaymentMethodCode = location.state?.orderPaymentMethodCode;
  const initialOrderProducts = location.state?.orderProducts;
  const user = useAuthStore((state) => state.user);
  const [situation, setSituation] = useState(''); // "seller_pays" | "customer_pays"

  // Map reason -> situation (backup an toàn, lỡ khi bạn thay UI sau này)
  const REASON_TO_SITUATION = useMemo(() => {
    const map = {};
    returnSituations.forEach((group) => {
      group.reasons.forEach((r) => (map[r.id] = group.id));
    });
    return map;
  }, []);

  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);

  const [selectedReason, setSelectedReason] = useState('');
  const [detailedReason, setDetailedReason] = useState('');
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [errors, setErrors] = useState({});

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const [selectedReturnItems, setSelectedReturnItems] = useState({});
  const [selectAll, setSelectAll] = useState(false);

  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [showBankInfoForm, setShowBankInfoForm] = useState(false);
  const [refundEmail, setRefundEmail] = useState('');

  const [submitting, setSubmitting] = useState(false);
  // const [submissionSuccess, setSubmissionSuccess] = useState(false); // Không cần state này nữa

  useEffect(() => {
    if (user?.email) {
      setRefundEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (!orderId) {
      toast.error('Không tìm thấy thông tin đơn hàng để trả.');
      navigate('/purchase');
      return;
    }

const processOrderProducts = (products) => {
  const initialItems = {};
  products.forEach((product) => {
    initialItems[product.skuId] = {
      quantity: product.quantity,
      checked: false // mặc định chưa tick
    };
  });
  setSelectedReturnItems(initialItems);
  setSelectAll(false); // select all cũng false
};


    if (initialOrderProducts && initialOrderProducts.length > 0) {
      setOrderData({
        products: initialOrderProducts,
        finalPrice: location.state?.finalPrice || 0
      });
      processOrderProducts(initialOrderProducts);
      setLoading(false);
    } else {
    const fetchOrderDetail = async () => {
  try {
    setLoading(true);
    const res = await orderService.getOrderById(orderId);
    if (res.data?.data) {
      setOrderData({
        ...res.data.data,
        products: res.data.data.products,
        finalPrice: res.data.data.finalPrice,
        // THÊM DÒNG NÀY ĐỂ LƯU PHÍ SHIP GỐC
        shippingFee: res.data.data.shippingFee // 👈 Thêm dòng này
      });
      processOrderProducts(res.data.data.products);
    } else {
      toast.error('Không tải được chi tiết đơn hàng.');
      navigate('/purchase');
    }
  } catch (error) {
    console.error('Failed to fetch order details:', error);
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

useEffect(() => {
  if (orderData?.products && orderData.products.length > 0) {
    // Sửa lỗi ở đây: Kiểm tra thuộc tính .checked thay vì quantity
    const allItemsChecked = orderData.products.every(
      (product) => selectedReturnItems[product.skuId]?.checked
    );
    
    setSelectAll(allItemsChecked);
  } else {
    setSelectAll(false)
  }
}, [selectedReturnItems, orderData]);
  const handleItemCheckboxChange = (skuIdRaw, isChecked) => {
    const skuId = Number(skuIdRaw);
    const product = orderData?.products?.find((p) => p.skuId === skuId);
    if (!product) return;

    setSelectedReturnItems((prev) => ({
  ...prev,
  [skuId]: {
    quantity: prev[skuId]?.quantity || product.quantity,
    checked: isChecked
  }
}));

  };
 const handleSelectAllChange = (e) => {
  const checked = e.target.checked;
  setSelectAll(checked);

  const newSelectedItems = {};
  orderData?.products?.forEach((product) => {
    newSelectedItems[product.skuId] = {
      quantity: product.quantity,
      checked: checked
    };
  });
  setSelectedReturnItems(newSelectedItems);
};

  const handleFileChange = (event, fileType) => {
    const files = Array.from(event.target.files);
    const newFiles = [...evidenceFiles];

    files.forEach((file) => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');

      if (fileType === 'image' && isImage) {
        if (newFiles.filter((f) => f.type.startsWith('image/')).length < 6) {
          newFiles.push({
            file,
            name: file.name,
            type: file.type,
            preview: URL.createObjectURL(file)
          });
        } else {
          toast.error('Chỉ có thể tải lên tối đa 6 ảnh.');
        }
      } else if (fileType === 'video' && isVideo) {
        if (newFiles.filter((f) => f.type.startsWith('video/')).length < 1) {
          newFiles.push({
            file,
            name: file.name,
            type: file.type,
            preview: URL.createObjectURL(file)
          });
        } else {
          toast.error('Chỉ có thể tải lên tối đa 1 video.');
        }
      } else {
        toast.error('Loại file không hợp lệ.');
      }
    });
    setEvidenceFiles(newFiles);
    event.target.value = null;
  };

  const removeFile = (indexToRemove) => {
    setEvidenceFiles((prevFiles) => {
      const fileToRemove = prevFiles[indexToRemove];
      if (fileToRemove && fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prevFiles.filter((_, index) => index !== indexToRemove);
    });
  };

  useEffect(() => {
    return () => {
      evidenceFiles.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [evidenceFiles]);

const totalRefundAmount = useMemo(() => {
  if (!orderData) return 0;

  // Lấy tổng số lượng sản phẩm ban đầu trong đơn hàng
  const totalOriginalQuantity = orderData.products.reduce((sum, p) => sum + p.quantity, 0);

  let refundTotal = 0;
  let totalReturnedQuantity = 0;

  // Lặp qua các sản phẩm đã được chọn
  for (const product of orderData.products) {
    const itemState = selectedReturnItems[product.skuId];
    if (itemState?.checked && itemState.quantity > 0) {
      refundTotal += product.price * itemState.quantity;
      totalReturnedQuantity += itemState.quantity;
    }
  }

  // Nếu trả lại toàn bộ đơn hàng, hoàn lại finalPrice
  if (totalOriginalQuantity > 0 && totalOriginalQuantity === totalReturnedQuantity) {
    refundTotal = orderData.finalPrice || refundTotal;
  }

  return refundTotal;
}, [selectedReturnItems, orderData]);
  const handleSubmitFinal = async () => {
    setSubmitting(true);
    const newErrors = {};

    const hasItem = Object.values(selectedReturnItems).some(item => item.checked && item.quantity > 0);
    if (!hasItem) {
      newErrors.selectedItems = 'Vui lòng chọn ít nhất một sản phẩm để trả.';
    }

    if (!selectedReason) {
      newErrors.selectedReason = 'Vui lòng chọn lý do trả hàng.';
    }
    if (selectedReason === 'OTHER' && !detailedReason.trim()) {
      newErrors.detailedReason = 'Vui lòng mô tả lý do khác.';
    }

    const hasImage = evidenceFiles.some((file) => file.type.startsWith('image/'));
    if (!hasImage) {
      newErrors.evidenceFiles = 'Vui lòng tải lên ít nhất một hình ảnh.';
    }
    const videoCount = evidenceFiles.filter((file) => file.type.startsWith('video/')).length;
    if (videoCount === 0) {
      newErrors.evidenceFilesVideo = 'Vui lòng tải lên một video.';
    } else if (videoCount > 1) {
      newErrors.evidenceFilesVideo = 'Chỉ có thể tải lên tối đa 1 video.';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error('Vui lòng nhập đủ thông tin.');
      setSubmitting(false);
      return;
    }

    const refundTargetText = ['atm', 'cod', 'zalopay', 'payos'].includes(orderPaymentMethodCode?.toLowerCase())
      ? 'Ví CyBerZone của bạn'
      : 'Phương thức thanh toán ban đầu của bạn';

    const confirmed = await confirmReturn(refundTargetText);
    if (!confirmed) {
      setSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('orderId', String(Number(orderId)));
    formData.append('reason', selectedReason);
    if (selectedReason === 'OTHER') {
      formData.append('detailedReason', detailedReason.trim());
    }
formData.append('situation', situation);

    const itemsToReturn = Object.keys(selectedReturnItems)
  .filter(skuId => selectedReturnItems[skuId]?.checked && selectedReturnItems[skuId]?.quantity > 0)
  .map(skuId => ({
    skuId: Number(skuId),
    quantity: selectedReturnItems[skuId].quantity,
  }));

formData.append('itemsToReturn', JSON.stringify(itemsToReturn));

    evidenceFiles.forEach((fileData) => {
      if (fileData.file.type.startsWith('image/')) {
        formData.append('images', fileData.file);
      } else if (fileData.file.type.startsWith('video/')) {
        formData.append('videos', fileData.file);
      }
    });

    try {
      await returnRefundService.requestReturn(formData);
      toast.success('Yêu cầu trả hàng đã được gửi thành công!');
      navigate('/user-profile#quan-ly-don-hang');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Gửi yêu cầu thất bại, vui lòng thử lại.');
      console.error('Return request failed:', err);
    } finally {
      setSubmitting(false);
    }
  };
  if (loading) {
    return <Loader fullscreen={true} />;
  }

  return (
    <Box className="w-full p-6 sm:p-8 bg-white rounded-lg shadow-md mt-4 mb-16" sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h5" component="h1" align="center" fontWeight="bold" mb={4}>
        Yêu cầu Trả hàng / Hoàn tiền
      </Typography>

      <Box>
        {/* PHẦN 1: CHỌN SẢN PHẨM */}
        <Typography variant="h6" component="p" className="font-semibold text-gray-800 mb-3">
          1. Chọn sản phẩm muốn trả:
        </Typography>

        {orderData?.products && orderData.products.length > 0 && (
          <Box mb={2} display="flex" alignItems="center" className="bg-orange-50 p-3 rounded-lg border border-orange-200">
            <Checkbox
              checked={selectAll}
              onChange={handleSelectAllChange}
              size="medium"
              sx={{ p: 0, mr: 1, '& .MuiSvgIcon-root': { color: '#f97316' } }}
            />
            <Typography variant="body1" fontWeight="bold" className="text-orange-700">
              Chọn tất cả ({orderData.products.length} sản phẩm)
            </Typography>
          </Box>
        )}
        {errors.selectedItems && (
          <Typography variant="caption" color="error" sx={{ mt: -1, mb: 2, display: 'block' }}>
            {errors.selectedItems}
          </Typography>
        )}

        {orderData?.products && orderData.products.length > 0 ? (
          orderData.products.map((product) => {
            const isChecked = selectedReturnItems[product.skuId] === product.quantity;

            const handleWrapperClick = () => {
              handleItemCheckboxChange(product.skuId, !isChecked);
            };

            return (
              <Box
                key={product.skuId}
                display="flex"
                alignItems="center"
                mb={2}
                p={1.5}
                border={1}
                borderColor="grey.300"
                borderRadius={1}
                bgcolor="white"
              >
<Checkbox
  checked={selectedReturnItems[product.skuId]?.checked || false}
  onChange={(e) =>
    setSelectedReturnItems((prev) => ({
      ...prev,
      [product.skuId]: {
        quantity: prev[product.skuId]?.quantity || product.quantity,
        checked: e.target.checked
      }
    }))
  }
  size="medium"
  sx={{ p: 0, mr: 1, '& .MuiSvgIcon-root': { color: '#f97316' } }}
/>


                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-sm border border-gray-200 mr-3 flex-shrink-0"
                />

                <Box flexGrow={1}>
                  <Typography variant="body2" fontWeight="medium" sx={{ mb: 0.5 }}>
                    {product.name}
                  </Typography>
                  {product.variation && (
                    <Typography variant="caption" color="text.secondary">
                      Phân loại: {product.variation}
                    </Typography>
                  )}

                 {/* Input số lượng có nút + và - */}
<Box display="flex" alignItems="center" mt={1}>
  {/* Nút trừ (-) */}
  <IconButton
    size="small"
    onClick={() =>
      setSelectedReturnItems((prev) => {
        const currentItem = prev[product.skuId] || { quantity: 0, checked: false };
        const newQuantity = Math.max(0, currentItem.quantity - 1);
        return {
          ...prev,
          [product.skuId]: {
            ...currentItem,
            quantity: newQuantity,
            checked: newQuantity > 0, // Cập nhật trạng thái check
          },
        };
      })
    }
    sx={{
      border: '1px solid #ddd',
      borderRadius: '4px 0 0 4px',
      width: 32,
      height: 32
    }}
  >
    -
  </IconButton>

  {/* Khung hiển thị số lượng */}
  <Box
    sx={{
      borderTop: '1px solid #ddd',
      borderBottom: '1px solid #ddd',
      width: 50,
      height: 32,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 14,
      fontWeight: 500
    }}
  >
    {selectedReturnItems[product.skuId]?.quantity || 0}
  </Box>

  {/* Nút cộng (+) */}
  <IconButton
    size="small"
    onClick={() =>
      setSelectedReturnItems((prev) => {
        const currentItem = prev[product.skuId] || { quantity: 0, checked: false };
        const newQuantity = Math.min(product.quantity, currentItem.quantity + 1);
        return {
          ...prev,
          [product.skuId]: {
            ...currentItem,
            quantity: newQuantity,
            checked: true, // Cập nhật trạng thái check
          },
        };
      })
    }
    sx={{
      border: '1px solid #ddd',
      borderRadius: '0 4px 4px 0',
      width: 32,
      height: 32
    }}
  >
    +
  </IconButton>
</Box>

                  <Typography variant="caption" color="text.secondary">
                    (Đã mua: {product.quantity})
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                  {formatCurrencyVND(product.price * product.quantity)}
                </Typography>
              </Box>
            );
          })
        ) : (
          <Typography variant="body2" color="text.secondary">
            Không có sản phẩm nào trong đơn hàng này.
          </Typography>
        )}

        <Divider sx={{ my: 4 }} />

        {/* PHẦN 2: LÝ DO & MÔ TẢ CHI TIẾT */}
        {/* PHẦN 2: LÝ DO & MÔ TẢ CHI TIẾT */}
        <Typography variant="h6" component="p" className="font-semibold text-gray-800 mb-3">
          2. Lý do trả hàng của bạn là gì?
        </Typography>

        <Box sx={{ mb: 2 }}>
          {returnSituations.map((group) => (
            <Box key={group.id} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 1 }}>
              <Typography fontWeight="bold" sx={{ mb: 1 }}>
                {group.label}
              </Typography>

              <RadioGroup
                value={selectedReason}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedReason(value);
                  // gắn luôn situation theo nhóm
                  setSituation(REASON_TO_SITUATION[value] || '');
                  // clear lỗi
                  setErrors((prev) => ({ ...prev, selectedReason: undefined }));
                }}
              >
                {group.reasons.map((reason) => (
                  <FormControlLabel key={reason.id} value={reason.id} control={<Radio size="small" />} label={reason.label} />
                ))}
              </RadioGroup>
            </Box>
          ))}
        </Box>

        {errors.selectedReason && (
          <Typography variant="caption" color="error" sx={{ mt: -1, mb: 2, display: 'block' }}>
            {errors.selectedReason}
          </Typography>
        )}

        {/* Thông điệp minh bạch ai chịu phí ship */}
        {selectedReason && situation && (
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              p: 1.5,
              borderRadius: 1,
              ...(situation === 'seller_pays'
                ? { bgcolor: 'success.light', color: 'success.dark', border: '1px solid', borderColor: 'success.main' }
                : { bgcolor: 'warning.light', color: 'warning.dark', border: '1px solid', borderColor: 'warning.main' })
            }}
          >
            {situation === 'seller_pays'
              ? 'Shop sẽ chịu phí vận chuyển trả hàng cho bạn.'
              : 'Bạn sẽ tự thanh toán phí vận chuyển trả hàng.'}
          </Typography>
        )}

        <Typography variant="h6" component="p" className="font-semibold text-gray-800 mb-1" sx={{ mt: 3 }}>
          3. Mô tả chi tiết (không bắt buộc)
        </Typography>
        <TextareaAutosize
          minRows={3}
          placeholder="Để yêu cầu được xử lý nhanh hơn, bạn có thể mô tả thêm về vấn đề..."
          value={detailedReason}
          onChange={(e) => {
            setDetailedReason(e.target.value);
            setErrors((prev) => ({ ...prev, detailedReason: undefined }));
          }}
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
        />
        {errors.detailedReason && (
          <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
            {errors.detailedReason}
          </Typography>
        )}

        <Divider sx={{ my: 4 }} />

        <Divider sx={{ my: 4 }} />

        {/* PHẦN 4: TẢI LÊN BẰNG CHỨNG */}
        <Typography variant="h6" component="p" className="font-semibold text-gray-800 mb-1">
          4. Tải lên bằng chứng (ảnh/video) <span className="text-red-500">*</span>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Đăng tải hình ảnh/video bằng chứng bạn nhận được và tình trạng của sản phẩm (tối đa 6 ảnh và 1 video).
        </Typography>
        <Box className="flex flex-wrap gap-2">
          {evidenceFiles
            .filter((f) => f.type.startsWith('image/'))
            .map((fileData, index) => (
              <Box key={index} className="relative w-[130px] h-[130px] border border-gray-300 rounded-md overflow-hidden bg-gray-100 group">
                <img src={fileData.preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                <Box
                  className="absolute top-0 right-0 z-10 m-1 w-[24px] h-[24px] bg-black bg-opacity-60 text-white rounded-full flex items-center justify-center hover:bg-opacity-80 cursor-pointer"
                  onClick={() => removeFile(index)}
                >
                  <X size={16} />
                </Box>
              </Box>
            ))}

          {evidenceFiles.filter((f) => f.type.startsWith('image/')).length < 6 && (
            <Box
              className="w-[130px] h-[130px] border border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
              onClick={() => imageInputRef.current?.click()}
            >
              <Camera size={24} />
              <Typography variant="caption" className="mt-1 text-center" sx={{ whiteSpace: 'nowrap' }}>
                Thêm hình ảnh ({evidenceFiles.filter((f) => f.type.startsWith('image/')).length}/6)
              </Typography>
              <Typography variant="caption" className="text-xs text-gray-400">
                Tối đa 5MB
              </Typography>
            </Box>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileChange(e, 'image')}
            ref={imageInputRef}
            style={{ display: 'none' }}
          />

          {evidenceFiles
            .filter((f) => f.type.startsWith('video/'))
            .map((fileData, index) => (
              <Box key={index} className="relative w-[130px] h-[130px] border border-gray-300 rounded-md overflow-hidden bg-gray-100 group">
                <video src={fileData.preview} controls preload="metadata" className="w-full h-full object-cover" />
                <Box
                  className="absolute top-0 right-0 z-10 m-1 w-[24px] h-[24px] bg-black bg-opacity-60 text-white rounded-full flex items-center justify-center hover:bg-opacity-80 cursor-pointer"
                  onClick={() => removeFile(index)}
                >
                  <X size={16} />
                </Box>
              </Box>
            ))}

          {evidenceFiles.filter((f) => f.type.startsWith('video/')).length < 1 && (
            <Box
              className="w-[130px] h-[130px] border border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
              onClick={() => videoInputRef.current?.click()}
            >
              <Video size={24} />
              <Typography variant="caption" className="mt-1 text-center" sx={{ whiteSpace: 'nowrap' }}>
                Thêm video (0/1)
              </Typography>
              <Typography variant="caption" className="text-xs text-gray-400">
                Tối đa 100MB
              </Typography>
            </Box>
          )}
          <input
            type="file"
            accept="video/*"
            onChange={(e) => handleFileChange(e, 'video')}
            ref={videoInputRef}
            style={{ display: 'none' }}
          />
        </Box>
        {(errors.evidenceFiles || errors.evidenceFilesVideo) && (
          <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
            {errors.evidenceFiles || errors.evidenceFilesVideo}
          </Typography>
        )}

        <Divider sx={{ my: 4 }} />

        {/* PHẦN 5: THÔNG TIN HOÀN TIỀN */}
        <Box sx={{ p: 2, border: 1, borderColor: 'grey.300', borderRadius: 1, bgcolor: 'white' }}>
          <Typography variant="h6" component="p" className="font-semibold text-gray-800 mb-3">
            5. Thông tin hoàn tiền
          </Typography>

          <Box mb={2}>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 0.5 }}>
              Số tiền hoàn lại:
            </Typography>
            <Typography variant="h5" component="div" className="font-bold text-red-500">
              {formatCurrencyVND(totalRefundAmount)}
            </Typography>
          </Box>

          <Box mb={2}>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 0.5 }}>
              Hoàn trả vào:
            </Typography>
            <Box className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                {['atm', 'cod', 'zalopay', 'payos'].includes(orderPaymentMethodCode?.toLowerCase()) ? (
                  <>
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/1041/1041876.png"
                      alt="Tài khoản CyBerZOne"
                      style={{
                        width: 24,
                        height: 24,
                        objectFit: 'contain',
                        verticalAlign: 'middle',
                        marginRight: 8
                      }}
                    />
                    <Typography variant="body1" fontWeight="bold" sx={{ color: 'blue.800' }}>
                      Tài khoản CyBerZone
                    </Typography>
                  </>
                ) : (
                  <>
                    {orderPaymentMethodCode && paymentIconMap[orderPaymentMethodCode.toLowerCase()] && (
                      <img
                        src={paymentIconMap[orderPaymentMethodCode.toLowerCase()]}
                        alt={orderPaymentMethodCode}
                        style={{
                          width: 24,
                          height: 24,
                          objectFit: 'contain',
                          verticalAlign: 'middle',
                          marginRight: 8
                        }}
                      />
                    )}
                    <Typography variant="body1" fontWeight="bold" sx={{ color: 'blue.800' }}>
                      {orderPaymentMethodCode?.toUpperCase() || 'PHƯƠNG THỨC ĐIỆN TỬ'}
                    </Typography>
                  </>
                )}
              </Box>
              <Typography variant="caption" sx={{ color: 'blue.600', display: 'block' }}>
                {['atm', 'cod', 'zalopay', 'payos'].includes(orderPaymentMethodCode?.toLowerCase())
                  ? 'Tiền hoàn sẽ được xử lý tự động về ví CyBerZone của bạn.'
                  : 'Tiền hoàn sẽ được xử lý tự động về phương thức thanh toán ban đầu của bạn.'}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 0.5 }}>
              Email nhận thông báo:
            </Typography>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              value={refundEmail}
              onChange={(e) => setRefundEmail(e.target.value)}
              InputProps={{ readOnly: true }}
              sx={{ bgcolor: 'grey.100' }}
            />
          </Box>
        </Box>
      </Box>

      {/* Nút gửi yêu cầu duy nhất */}
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 4, justifyContent: 'center' }}>
        <Button
          onClick={handleSubmitFinal}
          variant="contained"
          className="bg-primary text-white"
          disabled={submitting}
          endIcon={submitting ? <CircularProgress size={20} className="text-white" /> : null}
        >
          {submitting ? 'Đang gửi yêu cầu...' : 'Gửi yêu cầu'}
        </Button>
      </Box>
    </Box>
  );
};

export default ReturnOrderPage;

const paymentIconMap = {
  cod: 'https://salt.tikicdn.com/ts/upload/92/b2/78/1b3b9cda5208b323eb9ec56b84c7eb87.png',
  atm: 'http://googleusercontent.com/file_content/0',
  vnpay: 'https://salt.tikicdn.com/ts/upload/77/6a/df/a35cb9c62b9215dbc6d334a77cda4327.png',
  momo: 'https://s3-sgn09.fptcloud.com/ict-payment-icon/payment/momo.png',
  zalopay: 'https://s3-sgn09.fptcloud.com/ict-payment-icon/payment/zalopay.png',
  viettel_money: 'https://i.imgur.com/ttZPvTx.png',
  stripe: 'https://salt.tikicdn.com/ts/upload/7e/48/50/7fb406156d0827b736cf0fe66c90ed78.png',
  credit: 'https://salt.tikicdn.com/ts/upload/16/f8/f3/0c02ea827b71cd89ffadb7a22babbdd6.png'
};
