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

// CHỈNH SỬA MẢNG STEPS: Gộp "Tải bằng chứng" vào bước đầu tiên
const steps = ['Chọn lý do & Bằng chứng', 'Chọn sản phẩm', 'Thông tin hoàn tiền', 'Xác nhận'];

const ReturnOrderPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const orderId = location.state?.orderId;
    const orderPaymentMethodCode = location.state?.orderPaymentMethodCode;
    const initialOrderProducts = location.state?.orderProducts;

    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const [orderData, setOrderData] = useState(null);

    // Step 1 states (giờ bao gồm cả bằng chứng)
    const [selectedReason, setSelectedReason] = useState('');
    const [detailedReason, setDetailedReason] = useState('');
    const [evidenceFiles, setEvidenceFiles] = useState([]); // Đã di chuyển lên đây
    const fileInputRef = useRef(null); // Đã di chuyển lên đây

    // Step 2 (Mới) states (chọn sản phẩm muốn trả toàn bộ số lượng)
    const [selectedReturnItems, setSelectedReturnItems] = useState({});
    const [selectAll, setSelectAll] = useState(false);

    // Step 3 (Mới) states
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [accountHolderName, setAccountHolderName] = useState('');
    const [showBankInfoForm, setShowBankInfoForm] = useState(false);
    const [refundEmail, setRefundEmail] = useState('nguyenquockhai.2006@gmail.com');

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
            setOrderData({
                products: initialOrderProducts,
                finalPrice: location.state?.finalPrice || 0,
            });
            console.log('[DEBUG] orderData', orderData); // Đây vẫn là giá trị cũ
            const initialItems = {};
            initialOrderProducts.forEach(product => {
                initialItems[product.skuId] = 0;
            });
            setSelectedReturnItems(initialItems);
            setLoading(false);
        } else {
            const fetchOrderDetail = async () => {
                try {
                    setLoading(true);
                    const res = await orderService.getOrderDetail(orderId);
                    if (res.data?.data) {
                        setOrderData({
                            ...res.data.data,
                            finalPrice: res.data.data.finalPrice,
                        });
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
        // VALIDATION CHO STEP 0 (chọn lý do & bằng chứng)
        if (currentStep === 0) {
            if (!selectedReason) {
                return toast.error('Vui lòng chọn lý do trả hàng.');
            }
            if (selectedReason === 'OTHER' && !detailedReason.trim()) {
                return toast.error('Vui lòng mô tả chi tiết lý do khác.');
            }
        }
        // VALIDATION CHO STEP 1 (chọn sản phẩm) - giờ là currentStep === 1
        else if (currentStep === 1) {
            const hasItem = Object.values(selectedReturnItems).some(q => q > 0);
            if (!hasItem) {
                return toast.error('Vui lòng chọn ít nhất một sản phẩm để trả.');
            }
            // Logic check lại sau micro-task nếu cần (nhưng thường không cần với React state update bình thường)
        }
        // VALIDATION CHO STEP 2 (thông tin hoàn tiền) - giờ là currentStep === 2
        else if (currentStep === 2) {
            if (showBankInfoForm) {
                if (!bankName.trim() || !accountNumber.trim() || !accountHolderName.trim()) {
                    return toast.error('Vui lòng điền đầy đủ thông tin tài khoản ngân hàng.');
                }
            }
            // refundEmail hiện đang là readOnly nên không cần validate
        }

        setCurrentStep(s => s + 1);
    };


    const handleBack = () => {
        setCurrentStep((prevActiveStep) => prevActiveStep - 1);
    };

    // ✅ Xử lý checkbox cho từng sản phẩm (luôn trả hết số lượng đã mua nếu được chọn)
    const handleItemCheckboxChange = (skuIdRaw, isChecked) => {
        const skuId = Number(skuIdRaw);
        const product = orderData?.products?.find(p => p.skuId === skuId);
        if (!product) return;

        setSelectedReturnItems(prev => ({
            ...prev,
            [skuId]: isChecked ? product.quantity : 0,
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


    // Step 0 (Mới) handlers - Bằng chứng
    const handleFileChange = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            // Kiểm tra tổng số file sau khi thêm
            if (evidenceFiles.length + newFiles.length > 7) {
                toast.error('Chỉ có thể tải lên tối đa 7 file ảnh/video.');
                return;
            }
            setEvidenceFiles((prevFiles) => [...prevFiles, ...newFiles]);
            e.target.value = null; // Reset input file để có thể chọn cùng file lại
        }
    };

    const removeFile = (indexToRemove) => {
        setEvidenceFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
    };


    /* ============================================================
     * Tính Tổng tiền hoàn lại
     * ========================================================== */
    const totalRefundAmount = useMemo(() => {
        if (!orderData) return 0;

        // 1) Tổng tiền sản phẩm đang chọn trả
        const productSubtotal = Object.entries(selectedReturnItems).reduce(
            (sum, [skuId, qty]) => {
                if (!qty) return sum;
                const prod = orderData.products.find(p => p.skuId === Number(skuId));
                return prod ? sum + prod.price * qty : sum;
            },
            0,
        );

        // 2) Kiểm tra có phải trả hết đơn hay không
        // Logic này cần dựa vào tổng số lượng sản phẩm trong đơn hàng
        const totalProductsInOrder = orderData.products.reduce((sum, p) => sum + p.quantity, 0);
        const totalSelectedToReturn = Object.values(selectedReturnItems).reduce((sum, qty) => sum + qty, 0);

        const allItemsSelectedForReturn = totalSelectedToReturn === totalProductsInOrder && totalProductsInOrder > 0;

        if (allItemsSelectedForReturn) {
            // ✅ Hoàn lại finalPrice (đã bao gồm ship và trừ voucher) nếu trả hết đơn
            return orderData.finalPrice ?? productSubtotal;
        }

        // 3) Chỉ hoàn phần sản phẩm (và có thể phí ship theo tỷ lệ nếu muốn)
        // Ví dụ: hoàn lại ship theo % giá trị hàng hoàn so với tổng giá trị đơn
        // Để làm được điều này, bạn cần total price của các sản phẩm trong đơn gốc (trước khi trừ coupon/ship)
        // const originalProductsTotalPrice = orderData.products.reduce((sum, p) => sum + p.price * p.quantity, 0);
        // if (originalProductsTotalPrice > 0 && orderData.shippingFee > 0) {
        //     const percent = productSubtotal / originalProductsTotalPrice;
        //     const shipRefund = orderData.shippingFee * percent;
        //     return productSubtotal + shipRefund;
        // }

        return productSubtotal; // Mặc định chỉ hoàn tiền sản phẩm
    }, [selectedReturnItems, orderData]);


    const handleSubmitFinal = async () => {
        setSubmitting(true);
        const formData = new FormData();
        formData.append("orderId", String(Number(orderId)));
        formData.append('reason', selectedReason === 'OTHER' ? detailedReason : selectedReason);

        const itemsToReturn = Object.keys(selectedReturnItems)
            .filter(skuId => selectedReturnItems[skuId] > 0)
            .map(skuId => ({
                skuId: skuId,
                quantity: selectedReturnItems[skuId],
            }));

        formData.append('itemsToReturn', JSON.stringify(itemsToReturn));

        // Bank info chỉ gửi nếu cần
        if (showBankInfoForm) {
            formData.append('bankName', bankName.trim());
            formData.append('accountNumber', accountNumber.trim());
            formData.append('accountHolderName', accountHolderName.trim());
        }

        // Thêm bằng chứng vào formData
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

            {/* CHỈNH SỬA STEPS ĐỂ PHẢN ÁNH THAY ĐỔI */}
            <Stepper activeStep={currentStep} alternativeLabel sx={{ mb: 4 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Box>
                {/* Step 0 (MỚI): Chọn lý do & Tải bằng chứng */}
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

                        {/* PHẦN TẢI BẰNG CHỨNG ĐÃ ĐƯỢC GỘP VÀO ĐÂY */}
                        <Typography variant="h6" component="p" className="font-semibold text-gray-800 mt-6 mb-3">3. Tải lên bằng chứng (ảnh/video)</Typography>
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

                {/* Step 1 (MỚI): Chọn sản phẩm muốn trả (trước đây là Step 2) */}
                {currentStep === 1 && (
                    <Box>
                        <Typography variant="h6" component="p" className="font-semibold text-gray-800 mb-3">4. Chọn sản phẩm muốn trả:</Typography>

                        {/* Checkbox "Chọn tất cả" */}
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
                                            onClick={(e) => e.stopPropagation()} // Ngăn click bubble
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
                    </Box>
                )}

                {/* Step 2 (MỚI): Thông tin hoàn tiền (trước đây là Step 4) */}
                {currentStep === 2 && (
                    <Box sx={{ p: 2, border: 1, borderColor: 'grey.300', borderRadius: 1, bgcolor: 'white' }}>
                        <Typography variant="h6" component="p" className="font-semibold text-gray-800 mb-3">Thông tin hoàn tiền</Typography>
                        
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
                                <Box className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                    <Typography variant="body2" sx={{ color: 'blue.700', fontWeight: 'medium' }}>
                                        Phương thức thanh toán ban đầu:
                                    </Typography>
                                    <Typography variant="body1" fontWeight="bold" sx={{ color: 'blue.800', mt: 0.5 }}>
                                        {orderPaymentMethodCode?.toUpperCase() || 'PHƯƠNG THỨC ĐIỆN TỬ'}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'blue.600', mt: 1 }}>
                                        Tiền hoàn sẽ được xử lý tự động về phương thức thanh toán ban đầu của bạn.
                                    </Typography>
                                </Box>
                            )}
                        </Box>

                        <Box>
                            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 0.5 }}>Email:</Typography>
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
                )}

                {/* Step 3 (MỚI): Xác nhận (trước đây là Step 5) */}
                {currentStep === 3 && (
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
                            <Typography variant="body1">
                                <span className="font-semibold">Email nhận thông báo:</span> {refundEmail}
                            </Typography>
                            <Box className="flex justify-end items-center mt-4">
                                <Typography variant="h6" className="font-bold text-gray-800 mr-2">Tổng tiền hoàn lại:</Typography>
                                <Typography variant="h5" className="font-bold text-red-500">
                                    {formatCurrencyVND(totalRefundAmount)}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                )}
            </Box>

            {/* Điều hướng Buttons */}
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