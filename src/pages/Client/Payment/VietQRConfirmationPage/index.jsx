import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '@/services/client/orderService';
import { paymentService } from '../../../../services/client/paymentService';

import { toast } from 'react-toastify';
import Loader from '@/components/common/Loader';
import { ArrowDownTrayIcon, ClockIcon, CloudArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { formatCurrencyVND } from '@/utils/formatCurrency';

// Một phiên bản đơn giản của CopyableRow để dễ dàng tùy chỉnh giao diện
const CustomCopyableRow = ({ label, value, showCopyButton = true, isMainCopy = false }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        toast.success(`Đã sao chép "${value}"`);
    }

    return (
        <div className="flex justify-between items-center py-0.5">
            <div className="flex-1 pr-2">
                <span className="text-gray-600 font-medium">{label}:</span>{' '}
                <span className="text-gray-800">{value}</span>
            </div>
            {showCopyButton && (
                <button
                    onClick={handleCopy}
                    className={`text-xs px-2 py-1 rounded transition whitespace-nowrap
                        ${isMainCopy ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                    `}
                >
                    {isMainCopy ? 'Sao chép STK' : 'Sao chép'}
                </button>
            )}
        </div>
    );
};

const VietQRConfirmationPage = () => {
    const { orderCode } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [qrImage, setQrImage] = useState(null);
    const [expireAt, setExpireAt] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [loading, setLoading] = useState(true);
    const [confirming, setConfirming] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [uploadingProof, setUploadingProof] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const fileInputRef = useRef(null);
const [hasConfirmed, setHasConfirmed] = useState(false);

    // Dữ liệu cố định cho QR và UI
    const hardcodedBankInfo = {
        accountNumber: '2222555552005',
        accountName: 'NGUYEN QUOC KHAI',
        bankCode: 'MB',        // MBBank
        bankDisplayName: 'MB', // Tên hiển thị
    };

    useEffect(() => {
        if (!orderCode) {
            toast.error('Thiếu mã đơn hàng');
            navigate('/');
            return;
        }

        const fetchData = async () => {
            try {
                const res = await orderService.getOrderById(orderCode);
                const orderData = res.data?.data;
                if (!orderData) throw new Error('Không tìm thấy đơn');

                setOrder(orderData);

                // Nếu thanh toán ATM thì sinh QR
                if (orderData.paymentMethod.code.toLowerCase() === 'atm') {
                 const qrRes = await paymentService.generateVietQR({
                        accountNumber: hardcodedBankInfo.accountNumber,
                        accountName: hardcodedBankInfo.accountName,
                        bankCode: hardcodedBankInfo.bankCode,
                        amount: orderData.finalPrice,
                        message: `Thanh toan ${orderData.orderCode}`,
                    });
                    setQrImage(qrRes.data?.qrImage || null);
                } else {
                    setQrImage(null);
                }

                // Tính mốc expire dựa trên createdAt + 30 giây (để dễ test)
                const createdTs = new Date(orderData.createdAt).getTime();
                const testDuration = 60 * 1000; // 30 giây để test
                // Trong môi trường production, bạn sẽ dùng: const actualDuration = 15 * 60 * 1000; // 15 phút
                const expireTs = createdTs + testDuration; 
                setExpireAt(expireTs);
                setTimeLeft(Math.max(0, Math.floor((expireTs - Date.now()) / 1000)));
            } catch (err) {
                console.error('❌ Lỗi:', err);
                toast.error('Không thể tải dữ liệu');
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [orderCode, navigate]);

    // Countdown logic
    useEffect(() => {
        if (!expireAt) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleCancelOrder('Hết thời gian thanh toán'); // KÍCH HOẠT HỦY ĐƠN KHI HẾT THỜI GIAN VÀ TRUYỀN LÝ DO
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [expireAt]);

    const formatTime = seconds => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleConfirmPayment = async () => {
  setHasConfirmed(true); // ✅ Đánh dấu đã xác nhận để chặn cancel tự động
  navigate(`/order-confirmation?orderCode=${order.orderCode}`);
};


 const handleCancelOrder = async (reason = 'Đã hủy đơn hàng thành công') => {
  if (!order) return;
  setCancelling(true);
  console.log('✅ Cancel order started:', reason);
  try {
    await orderService.cancelOrder(order.id, { reason });
    toast.success('Đã huỷ đơn hàng: ' + reason);
    navigate(`/order-confirmation?orderCode=${order.orderCode}`); // ✅ chuyển hướng sau huỷ
  } catch (error) {
    console.error('Lỗi khi huỷ đơn hàng:', error);
    toast.error(error.response?.data?.message || 'Huỷ đơn hàng thất bại.');
  } finally {
    setCancelling(false);
  }
};

    const handleFileChange = event => {
        const file = event.target.files[0];
        setSelectedFile(file || null);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setFilePreview(null);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setFilePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUploadClick = async () => {
        if (!selectedFile) {
            toast.warn('Vui lòng chọn một file để tải lên.');
            return;
        }
        if (!order || !order.id) {
            toast.error('Không có thông tin đơn hàng để tải chứng từ.');
            return;
        }

        setUploadingProof(true);
        try {
            const formData = new FormData();
            formData.append('proof', selectedFile); 

            try {
                const res = await orderService.uploadProof(order.id, formData);
                toast.success('Đã tải chứng từ lên thành công!');
                
                setOrder(prevOrder => ({
                    ...prevOrder,
                    proofUrl: res.data.proofUrl
                }));

                setSelectedFile(null);
                setFilePreview(null);
                if (fileInputRef.current) fileInputRef.current.value = '';

            } catch (err) {
                console.error(err);
                toast.error(err.response?.data?.message || 'Tải chứng từ thất bại.');
            }

        } catch (error) {
            console.error('Lỗi khi tải lên chứng từ:', error);
            toast.error(error.response?.data?.message || 'Không thể tải chứng từ lên. Vui lòng thử lại.');
        } finally {
            setUploadingProof(false);
        }
    };

    const handleDownloadQrCode = async () => {
        if (!qrImage) {
            toast.warn('Không có mã QR để tải xuống.');
            return;
        }

        try {
            const response = await fetch(qrImage);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `VietQR_${orderCode}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success('Đã tải mã QR xuống.');
        } catch (error) {
            console.error('Lỗi khi tải mã QR:', error);
            toast.error('Không thể tải mã QR.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh] bg-gray-50">
                <Loader fullscreen={false} />
            </div>
        );
    }
    if (!order) return null;

    const displayTransferMessage = `Thanh toan ${order.orderCode}`;

    return (
        <div className="max-w-md mx-auto mt-6 px-4 font-sans text-gray-800 mb-8">
            {/* Banner */}
            <div className="bg-yellow-50 border-t-4 border-red-500 text-red-700 text-sm text-center py-2 px-3 mb-4">
                Quý Khách vui lòng không tắt trình duyệt cho đến khi nhận được kết quả giao dịch trên website. Xin cảm ơn!
            </div>
            {/* Dòng "Vui lòng chuyển khoản trong vòng..." - LUÔN HIỂN THỊ */}
            <p className="text-center text-gray-600 text-sm mb-2">
                Vui lòng chuyển khoản trong vòng <span className="font-semibold text-red-500">{formatTime(timeLeft)}</span> để giữ đơn hàng
            </p>
            {/* Tiêu đề "Thanh toán đơn hàng" */}
            <h2 className="text-xl font-bold text-center text-gray-800 mb-4">Thanh toán đơn hàng</h2>
            
            {/* Khung QR Code */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-5 text-center flex flex-col items-center">
                <div className="w-60 h-60 border border-gray-300 rounded-md overflow-hidden flex items-center justify-center bg-white p-2 mb-3">
                    {qrImage && <img src={qrImage} alt="Mã QR chuyển khoản" className="w-full h-full object-contain" />}
                </div>
                {/* Nút Tải QR Code */}
                <button
                    onClick={handleDownloadQrCode}
                    className="flex items-center justify-center mt-3 text-sm text-gray-600 hover:text-gray-800"
                >
                    <ArrowDownTrayIcon className="w-4 h-4 mr-1" /> Tải QR Code
                </button>

                {/* Phần thông tin chuyển khoản chính */}
                <div className="w-full text-left space-y-2 text-sm text-gray-700 mt-4">
                    <CustomCopyableRow label="Ngân hàng" value={hardcodedBankInfo.bankDisplayName} showCopyButton={false} />
                    <CustomCopyableRow label="Số tài khoản" value={hardcodedBankInfo.accountNumber} />
                    <CustomCopyableRow label="Chủ tài khoản" value={hardcodedBankInfo.accountName} showCopyButton={false} />
                    <CustomCopyableRow label="Nội dung chuyển khoản" value={displayTransferMessage} />
                    <CustomCopyableRow label="Số tiền" value={formatCurrencyVND(order.finalPrice)} showCopyButton={true} />
                </div>
            </div>
            
            {/* Ghi chú */}
            <p className="text-xs text-gray-500 mt-4 text-center">
                Vui lòng chuyển khoản đúng nội dung để hệ thống ghi nhận đơn hàng.
            </p>
            
            {/* Input Upload Chứng từ */}
            <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50 text-center">
                <h4 className="text-base font-semibold text-gray-800 mb-3">Tải lên chứng từ thanh toán (tùy chọn)</h4>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" id="proof-upload-input" accept="image/*,.pdf" />
                <label htmlFor="proof-upload-input" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 cursor-pointer">
                    <CloudArrowUpIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true" /> Chọn file
                </label>
                
                {/* Hiển thị preview ảnh từ file input (trước khi upload) */}
                {filePreview && ( 
                    <div className="mt-3 relative w-48 h-48 mx-auto border border-gray-300 rounded-md overflow-hidden flex items-center justify-center bg-white p-2">
                        <img src={filePreview} alt="Xem trước chứng từ" className="max-w-full max-h-full object-contain" />
                        <button
                            onClick={handleRemoveFile}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition"
                            title="Xóa ảnh"
                        >
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    </div>
                )}
                {selectedFile && !filePreview && ( // Nếu là file không phải ảnh (ví dụ: PDF)
                    <div className="mt-2 text-sm text-gray-600 flex items-center justify-center">
                        <span>File đã chọn: {selectedFile.name}</span>
                        <button
                            onClick={handleRemoveFile}
                            className="ml-2 text-red-500 hover:text-red-700"
                            title="Xóa file"
                        >
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    </div>
                )}

                <button onClick={handleUploadClick} disabled={!selectedFile || uploadingProof} className={`mt-3 w-full py-2 rounded-md font-semibold text-white transition ${!selectedFile || uploadingProof ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                    {uploadingProof ? 'Đang tải lên...' : 'Tải lên'}
                </button>
            </div>
            
            {/* HIỂN THỊ ẢNH CHỨNG TỪ ĐÃ TẢI LÊN THÀNH CÔNG TỪ BACKEND */}
            {order.proofUrl && (
                <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-white text-center shadow-md">
                    <h4 className="text-base font-semibold text-gray-800 mb-3">Chứng từ thanh toán đã tải lên</h4>
                    <div className="w-full max-w-[240px] h-48 mx-auto border border-gray-300 rounded-md overflow-hidden flex items-center justify-center bg-gray-100 p-2">
                        <img src={order.proofUrl} alt="Chứng từ thanh toán đã tải lên" className="max-w-full max-h-full object-contain" />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Chứng từ của bạn đang chờ xác nhận.</p>
                </div>
            )}

            {/* Các nút hành động chính */}
            <div className="mt-6 space-y-3">
                {/* Nút "Tôi đã chuyển khoản" */}
                <button
                    onClick={handleConfirmPayment}
                    disabled={confirming}
                    className={`w-full py-3 rounded-md font-semibold text-white transition
                        ${confirming
                            ? 'bg-blue-300 cursor-not-allowed'
                            : 'bg-primary hover:opacity-90'
                        }`}
                >
                    {confirming ? 'Đang xác nhận...' : 'Tôi đã chuyển khoản'}
                </button>

                {/* Nút "Huỷ đơn hàng" (chỉ hiện khi hết thời gian) */}
                {/* Nút hủy thủ công, chỉ hiện khi đơn chưa hết hạn và chưa bị hủy */}
                {timeLeft > 0 && order.status !== 'cancelled' && (
                    <button
                        onClick={() => handleCancelOrder('Người dùng hủy thủ công')} // Truyền lý do hủy thủ công
                        disabled={cancelling}
                        className=" text-red-500 hover:underline decoration-red-300 w-full py-3 rounded  transition"
                    >
                        {cancelling ? 'Đang huỷ...' : 'Huỷ đơn hàng'}
                    </button>
                )}
                
                {/* Nút "Về trang chủ" */}
                <button onClick={() => navigate('/')} className="w-full text-center text-sm text-gray-500 mt-2 hover:underline">
                    Về trang chủ
                </button>
            </div>
        </div>
    );
};

export default VietQRConfirmationPage;