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
import {
    Camera,
    Video,
    X,
    // CheckCircle, // Không cần icon này nếu không hiện màn hình thành công riêng
} from 'lucide-react';
import { orderService } from '../../../../services/client/orderService';
import { returnRefundService } from '../../../../services/client/returnRefundService';
import Loader from '../../../../components/common/Loader';
import { formatCurrencyVND } from '../../../../utils/formatCurrency';
import useAuthStore from '../../../../stores/AuthStore';

const returnReasons = [
    { id: 'WRONG_SIZE_COLOR', label: 'Nhận sai kích cỡ, màu sắc, hoặc sai sản phẩm' },
    { id: 'NOT_AS_DESCRIBED', label: 'Sản phẩm khác với mô tả của shop' },
    { id: 'DEFECTIVE', label: 'Sản phẩm bị lỗi, hư hỏng, không hoạt động' },
    { id: 'CHANGE_MIND', label: 'Không còn nhu cầu mua nữa' },
    { id: 'OTHER', label: 'Lý do khác (vui lòng mô tả bên dưới)' },
];

const ReturnOrderPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const orderId = location.state?.orderId;
    const orderPaymentMethodCode = location.state?.orderPaymentMethodCode;
    const initialOrderProducts = location.state?.orderProducts;
    const user = useAuthStore((state) => state.user);

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
            if (products && products.length > 0) {
                // Tự động chọn sản phẩm đầu tiên với số lượng đầy đủ
                products.forEach((product, index) => {
                    initialItems[product.skuId] = index === 0 ? product.quantity : 0;
                });
            }
            setSelectedReturnItems(initialItems);
            // Cập nhật trạng thái selectAll dựa trên việc sản phẩm đầu tiên được chọn
            setSelectAll(products.length === 1 && products[0] && initialItems[products[0].skuId] === products[0].quantity);
        };

        if (initialOrderProducts && initialOrderProducts.length > 0) {
            setOrderData({
                products: initialOrderProducts,
                finalPrice: location.state?.finalPrice || 0,
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
                        });
                        processOrderProducts(res.data.data.products);
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

    useEffect(() => {
        // Logic này để cập nhật trạng thái selectAll khi người dùng tương tác
        if (orderData?.products && orderData.products.length > 0) {
            const allSelected = orderData.products.every(product => selectedReturnItems[product.skuId] === product.quantity);
            const anySelected = orderData.products.some(product => selectedReturnItems[product.skuId] > 0);

            if (allSelected) {
                setSelectAll(true);
            } else if (anySelected) {
                setSelectAll(false);
            } else {
                setSelectAll(false);
            }
        } else {
            setSelectAll(false);
        }
    }, [selectedReturnItems, orderData]);


    const handleItemCheckboxChange = (skuIdRaw, isChecked) => {
        const skuId = Number(skuIdRaw);
        const product = orderData?.products?.find(p => p.skuId === skuId);
        if (!product) return;

        setSelectedReturnItems(prev => ({
            ...prev,
            [skuId]: isChecked ? product.quantity : 0,
        }));
    };

    const handleSelectAllChange = (e) => {
        const checked = e.target.checked;
        setSelectAll(checked);

        const newSelectedItems = {};
        orderData?.products?.forEach(product => {
            newSelectedItems[product.skuId] = checked ? product.quantity : 0;
        });
        setSelectedReturnItems(newSelectedItems);
    };


    const handleFileChange = (event, fileType) => {
        const files = Array.from(event.target.files);
        const newFiles = [...evidenceFiles];
        
        files.forEach(file => {
          const isImage = file.type.startsWith('image/');
          const isVideo = file.type.startsWith('video/');
        
          if (fileType === 'image' && isImage) {
            if (newFiles.filter(f => f.type.startsWith('image/')).length < 6) {
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
            if (newFiles.filter(f => f.type.startsWith('video/')).length < 1) {
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
            evidenceFiles.forEach(file => {
                if (file.preview) {
                    URL.revokeObjectURL(file.preview);
                }
            });
        };
    }, [evidenceFiles]);


    const totalRefundAmount = useMemo(() => {
        if (!orderData) return 0;

        const productSubtotal = Object.entries(selectedReturnItems).reduce(
            (sum, [skuId, qty]) => {
                if (!qty) return sum;
                const prod = orderData.products.find(p => p.skuId === Number(skuId));
                return prod ? sum + prod.price * qty : sum;
            },
            0,
        );

        const totalProductsInOrder = orderData.products.reduce((sum, p) => sum + p.quantity, 0);
        const totalSelectedToReturn = Object.values(selectedReturnItems).reduce((sum, qty) => sum + qty, 0);

        const allItemsSelectedForReturn = totalSelectedToReturn === totalProductsInOrder && totalProductsInOrder > 0;

        if (allItemsSelectedForReturn) {
            return orderData.finalPrice ?? productSubtotal; 
        }

        return productSubtotal;
    }, [selectedReturnItems, orderData]);


    const handleSubmitFinal = async () => {
        setSubmitting(true);
        const newErrors = {};

        // Validate "Chọn sản phẩm" (bây giờ là mục 1)
        const hasItem = Object.values(selectedReturnItems).some(q => q > 0);
        if (!hasItem) {
            newErrors.selectedItems = 'Vui lòng chọn ít nhất một sản phẩm để trả.';
        }

        // Validate "Lý do & Mô tả" (bây giờ là mục 2)
        if (!selectedReason) {
            newErrors.selectedReason = 'Vui lòng chọn lý do trả hàng.';
        }
        if (selectedReason === 'OTHER' && !detailedReason.trim()) {
            newErrors.detailedReason = 'Vui lòng mô tả lý do khác.';
        }
        
        // Validate "Bằng chứng" (bây giờ là mục 3)
        const hasImage = evidenceFiles.some(file => file.type.startsWith('image/'));
        if (!hasImage) {
            newErrors.evidenceFiles = 'Vui lòng tải lên ít nhất một hình ảnh.';
        }
        const videoCount = evidenceFiles.filter(file => file.type.startsWith('video/')).length;
        if (videoCount === 0) {
            newErrors.evidenceFilesVideo = 'Vui lòng tải lên một video.';
        } else if (videoCount > 1) {
            newErrors.evidenceFilesVideo = 'Chỉ có thể tải lên tối đa 1 video.';
        }

        // Validate "Thông tin hoàn tiền" (bây giờ là mục 4)
        if (showBankInfoForm) {
            if (!bankName.trim()) newErrors.bankName = 'Nhập tên ngân hàng.';
            if (!accountNumber.trim()) newErrors.accountNumber = 'Nhập số tài khoản.';
            if (!accountHolderName.trim()) newErrors.accountHolderName = 'Nhập tên chủ tài khoản.';
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            toast.error('Vui lòng nhập đủ thông tin.');
            setSubmitting(false);
            return;
        }

        const formData = new FormData();
        formData.append("orderId", String(Number(orderId)));
        formData.append('reason', selectedReason);
        if (selectedReason === 'OTHER') {
            formData.append('detailedReason', detailedReason.trim());
        }

        const itemsToReturn = Object.keys(selectedReturnItems)
            .filter(skuId => selectedReturnItems[skuId] > 0)
            .map(skuId => ({
                skuId: Number(skuId),
                quantity: selectedReturnItems[skuId],
            }));

        formData.append('itemsToReturn', JSON.stringify(itemsToReturn));

        if (showBankInfoForm) {
            formData.append('bankName', bankName.trim());
            formData.append('accountNumber', accountNumber.trim());
            formData.append('accountHolderName', accountHolderName.trim());
        }

        evidenceFiles.forEach((fileData) => {
            if (fileData.file.type.startsWith('image/')) {
                formData.append('images', fileData.file);
            } else if (fileData.file.type.startsWith('video/')) {
                formData.append('videos', fileData.file);
            }
        });

        try {
            await returnRefundService.requestReturn(formData);
            // setSubmissionSuccess(true); // Xóa dòng này
            toast.success('Yêu cầu trả hàng đã được gửi thành công!');
            navigate('/purchase'); // Điều hướng trực tiếp sau khi thành công
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

    // Xóa toàn bộ khối if (submissionSuccess) này
    /*
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
    */

    return (
        <Box className="w-full p-6 sm:p-8 bg-white rounded-lg shadow-md mt-4 mb-16"
            sx={{ maxWidth: 1200, mx: 'auto' }}
        >
            <Typography variant="h5" component="h1" align="center" fontWeight="bold" mb={4}>
                Yêu cầu Trả hàng / Hoàn tiền
            </Typography>

            <Box>
                {/* PHẦN 1: CHỌN SẢN PHẨM */}
                <Typography variant="h6" component="p" className="font-semibold text-gray-800 mb-3">1. Chọn sản phẩm muốn trả:</Typography>

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
                    orderData.products.map(product => {
                        const isChecked = selectedReturnItems[product.skuId] === product.quantity;

                        const handleWrapperClick = () => {
                            handleItemCheckboxChange(product.skuId, !isChecked);
                        };

                        return (
                            <Box
                                key={product.skuId}
                                onClick={handleWrapperClick}
                                display="flex"
                                alignItems="center"
                                mb={2}
                                p={1.5}
                                border={1}
                                borderColor="grey.300"
                                borderRadius={1}
                                bgcolor="white"
                                sx={{ cursor: 'pointer' }}
                            >
                                <Checkbox
                                    checked={isChecked}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => handleItemCheckboxChange(product.skuId, e.target.checked)}
                                    size="medium"
                                    sx={{ p: 0, mr: 1, '& .MuiSvgIcon-root': { color: '#f97316' } }}
                                />
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-16 h-16 object-cover rounded-sm border border-gray-200 mr-3 flex-shrink-0"
                                />
                                <Box flexGrow={1}>
                                    <Typography variant="body2" fontWeight="medium" sx={{ mb: 0.5 }}>{product.name}</Typography>
                                    {product.variation && (
                                        <Typography variant="caption" color="text.secondary">
                                            Phân loại: {product.variation}
                                        </Typography>
                                    )}
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                        x{product.quantity}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                                    {formatCurrencyVND(product.price * product.quantity)}
                                </Typography>
                            </Box>
                        );
                    })
                ) : (
                    <Typography variant="body2" color="text.secondary">Không có sản phẩm nào trong đơn hàng này.</Typography>
                )}

                <Divider sx={{ my: 4 }} />

                {/* PHẦN 2: LÝ DO & MÔ TẢ CHI TIẾT */}
                <Typography variant="h6" component="p" className="font-semibold text-gray-800 mb-3">2. Lý do trả hàng của bạn là gì?</Typography>
                <RadioGroup value={selectedReason} onChange={(e) => { setSelectedReason(e.target.value); setErrors(prev => ({ ...prev, selectedReason: undefined })); }} sx={{ mb: 3 }}>
                    {returnReasons.map((reason) => (
                        <FormControlLabel key={reason.id} value={reason.id} control={<Radio size="small" />} label={reason.label} />
                    ))}
                </RadioGroup>
                {errors.selectedReason && (
                    <Typography variant="caption" color="error" sx={{ mt: -2, mb: 2, display: 'block' }}>
                        {errors.selectedReason}
                    </Typography>
                )}

                <Typography variant="h6" component="p" className="font-semibold text-gray-800 mb-1">3. Mô tả chi tiết (không bắt buộc)</Typography>
                <TextareaAutosize
                    minRows={3}
                    placeholder="Để yêu cầu được xử lý nhanh hơn, bạn có thể mô tả thêm về vấn đề..."
                    value={detailedReason}
                    onChange={(e) => { setDetailedReason(e.target.value); setErrors(prev => ({ ...prev, detailedReason: undefined })); }}
                    className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
                {errors.detailedReason && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                        {errors.detailedReason}
                    </Typography>
                )}
                
                <Divider sx={{ my: 4 }} />

                {/* PHẦN 4: TẢI LÊN BẰNG CHỨNG */}
                <Typography variant="h6" component="p" className="font-semibold text-gray-800 mb-1">4. Tải lên bằng chứng (ảnh/video) <span className="text-red-500">*</span></Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Đăng tải hình ảnh/video bằng chứng bạn nhận được và tình trạng của sản phẩm (tối đa 6 ảnh và 1 video).
                </Typography>
                <Box className="flex flex-wrap gap-2">
                    {evidenceFiles.filter(f => f.type.startsWith('image/')).map((fileData, index) => (
                       <Box
                            key={index}
                            className="relative w-[130px] h-[130px] border border-gray-300 rounded-md overflow-hidden bg-gray-100 group"
                        >
                            <img
                                src={fileData.preview}
                                alt={`Preview ${index}`}
                                className="w-full h-full object-cover"
                            />
                            <Box
                                className="absolute top-0 right-0 z-10 m-1 w-[24px] h-[24px] bg-black bg-opacity-60 text-white rounded-full flex items-center justify-center hover:bg-opacity-80 cursor-pointer"
                                onClick={() => removeFile(index)}
                            >
                                <X size={16} />
                            </Box>
                        </Box>

                    ))}

                    {evidenceFiles.filter(f => f.type.startsWith('image/')).length < 6 && (
                        <Box
                            className="w-[130px] h-[130px] border border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
                            onClick={() => imageInputRef.current?.click()}
                        >
                            <Camera size={24} />
                            <Typography variant="caption" className="mt-1 text-center" sx={{ whiteSpace: 'nowrap' }}>
                                Thêm hình ảnh ({evidenceFiles.filter(f => f.type.startsWith('image/')).length}/6)
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

                    {evidenceFiles.filter(f => f.type.startsWith('video/')).map((fileData, index) => (
                        <Box
                            key={index}
                            className="relative w-[130px] h-[130px] border border-gray-300 rounded-md overflow-hidden bg-gray-100 group"
                        >
                            <video
                                src={fileData.preview}
                                controls
                                preload="metadata"
                                className="w-full h-full object-cover"
                            />
                            <Box
                                className="absolute top-0 right-0 z-10 m-1 w-[24px] h-[24px] bg-black bg-opacity-60 text-white rounded-full flex items-center justify-center hover:bg-opacity-80 cursor-pointer"
                                onClick={() => removeFile(index)}
                            >
                                <X size={16} />
                            </Box>
                        </Box>
                    ))}


                    {evidenceFiles.filter(f => f.type.startsWith('video/')).length < 1 && (
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
                    <Typography variant="h6" component="p" className="font-semibold text-gray-800 mb-3">5. Thông tin hoàn tiền</Typography>
                    
                    <Box mb={2}>
                        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 0.5 }}>Số tiền hoàn lại:</Typography>
                        <Typography variant="h5" component="div" className="font-bold text-red-500">
                            {formatCurrencyVND(totalRefundAmount)}
                        </Typography>
                    </Box>

                    <Box mb={2}>
                        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 0.5 }}>Hoàn trả vào:</Typography>
                        {showBankInfoForm ? (
                            <Box className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                                <Typography variant="body2" sx={{ color: 'orange.700', fontWeight: 'medium' }}>
                                    Ngân hàng:
                                </Typography>
                                <TextField
                                    label="Tên ngân hàng"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    value={bankName}
                                    onChange={(e) => { setBankName(e.target.value); setErrors(prev => ({ ...prev, bankName: undefined })); }}
                                    error={!!errors.bankName}
                                    helperText={errors.bankName}
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
                                    onChange={(e) => { setAccountNumber(e.target.value); setErrors(prev => ({ ...prev, accountNumber: undefined })); }}
                                    error={!!errors.accountNumber}
                                    helperText={errors.accountNumber}
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
                                    onChange={(e) => { setAccountHolderName(e.target.value); setErrors(prev => ({ ...prev, accountHolderName: undefined })); }}
                                    error={!!errors.accountHolderName}
                                    helperText={errors.accountHolderName}
                                    required
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Box>
                        ) : (
                            <Box className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                    {orderPaymentMethodCode && paymentIconMap[orderPaymentMethodCode.toLowerCase()] && (
                                        <img
                                            src={paymentIconMap[orderPaymentMethodCode.toLowerCase()]}
                                            alt={orderPaymentMethodCode}
                                            style={{ width: 24, height: 24, objectFit: 'contain', verticalAlign: 'middle', marginRight: 8 }}
                                        />
                                    )}
                                    <Typography variant="body1" fontWeight="bold" sx={{ color: 'blue.800' }}>
                                        {orderPaymentMethodCode?.toUpperCase() || 'PHƯƠNG THỨC ĐIỆN TỬ'}
                                    </Typography>
                                </Box>
                                <Typography variant="caption" sx={{ color: 'blue.600', display: 'block' }}>
                                    Tiền hoàn sẽ được xử lý tự động về phương thức thanh toán ban đầu của bạn.
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    <Box>
                        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 0.5 }}>Email nhận thông báo:</Typography>
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
    credit: 'https://salt.tikicdn.com/ts/upload/16/f8/f3/0c02ea827b71cd89ffadb7a22babbdd6.png',
};