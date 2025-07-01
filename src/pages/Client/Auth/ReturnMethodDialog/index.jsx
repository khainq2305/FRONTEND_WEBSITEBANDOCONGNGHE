import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    RadioGroup,
    FormControlLabel,
    Radio,
    TextField,
    CircularProgress,
    Box,
    Typography,
    Link, // Import Link for "Xem hướng dẫn"
} from "@mui/material";
import { toast } from "react-toastify";
import { orderService } from "../../../../services/client/orderService";
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ChevronRight } from 'lucide-react'; // For the arrow icon

export default function ReturnMethodDialog({
    open,
    onClose,
    returnRequestId,
    onSuccess,
    shippingAddress, // { fullName, phone, streetAddress, ward: {name, code}, district: {name, ghnCode}, province: {name} }
    shippingMethodName, // e.g., "GHN", "Nhanh THHT"
    returnRequestApprovedDate, // Add this prop for the approved date
}) {
    // ----------------------------- state
    const [returnMethod, setReturnMethod] = useState("ghn_pickup");
    const [trackingCode, setTrackingCode] = useState("");
    const [loading, setLoading] = useState(false);

    // Calculate pickup dates for display
    const today = new Date();
    // Simulate current date as June 29, 2025 for matching image
    // In real app, remove this line or use a prop for chosenDate
    const displayDate = new Date(2025, 5, 29, 2, 12, 0); // June 29, 2025 (Month is 0-indexed)

    const pickupDate1 = displayDate; // Example: Current day in image
    const pickupDate2 = new Date(displayDate);
    pickupDate2.setDate(displayDate.getDate() + 1); // Example: Next day in image

    const formattedPickupDate1 = format(pickupDate1, 'dd MMMM', { locale: vi });
    const formattedPickupDate2 = format(pickupDate2, 'dd MMMM', { locale: vi });

    // Format the return request approved date
    const formattedApprovedDate = returnRequestApprovedDate
        ? format(new Date(returnRequestApprovedDate), 'dd-MM-yyyy', { locale: vi })
        : '05-07-2025'; // Placeholder if not provided, matches image


    // ----------------------------- handlers
    const handleSubmit = async () => {
        try {
            setLoading(true);

            const payload = { returnMethod };
            if (returnMethod === "self_send" && trackingCode.trim()) {
                payload.trackingCode = trackingCode.trim();
            }
            await orderService.chooseReturnMethod(returnRequestId, payload);

            if (returnMethod === "ghn_pickup") {
                await orderService.bookReturnPickup(returnRequestId);
                toast.success("Đã đặt GHN đến lấy hàng!");
            } else {
                toast.success("Đã lưu phương thức hoàn hàng!");
            }

            onSuccess?.();
            onClose();
        } catch (err) {
            console.error("[ReturnMethodDialog]", err);
            toast.error(
                err?.response?.data?.message ||
                "Không thể cập nhật phương thức hoàn hàng"
            );
        } finally {
            setLoading(false);
        }
    };

    // ----------------------------- UI
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            sx={{
                "& .MuiDialog-paper": { borderRadius: 3 }
            }}
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box display="flex" alignItems="center">
                    <Button onClick={onClose} sx={{ minWidth: 'auto', p: 0, mr: 1.5 }}>
                        <ChevronRight style={{ transform: 'rotate(180deg)' }} />
                    </Button>
                    <Typography variant="h6" fontWeight={700}>
                        Chọn phương thức trả hàng
                    </Typography>
                </Box>
                {/* Dummy ID as seen in image */}
                <Typography variant="caption" color="text.secondary">
                    Mã Yêu Cầu: 2506290SSXU844H
                </Typography>
            </DialogTitle>

            <DialogContent dividers sx={{ p: 0 }}> {/* Remove default padding */}
                <Box className="flex flex-col">
                    {/* Phần thông báo yêu cầu đã được chấp nhận */}
                    <Box className="bg-blue-50 text-blue-800 p-3 sm:p-4 text-sm font-medium mb-4 mx-4 sm:mx-6 rounded-md">
                        <Typography variant="body2">
                            Yêu cầu Trả hàng đã được chấp nhận
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Bạn vui lòng chọn phương thức trả hàng trước ngày <span className="font-semibold">{formattedApprovedDate}</span>. Nếu không, yêu cầu sẽ bị hủy tự động.
                        </Typography>
                    </Box>

                    <RadioGroup
                        value={returnMethod}
                        onChange={(e) => setReturnMethod(e.target.value)}
                    >
                        {/* Option: GHN đến lấy hàng */}
                        <FormControlLabel
                            value="ghn_pickup"
                            control={<Radio size="small" />}
                            label={
                                <Box className="flex flex-col flex-grow">
                                    <Typography variant="body1" fontWeight="bold" className="flex items-center">
                                        Đơn vị vận chuyển đến lấy hàng <span className="text-green-600 ml-2 text-xs font-semibold">(Miễn Ship Hoàn Về)</span>
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1 }}>
                                        Vui lòng kiểm tra thông tin lấy hàng của bạn.
                                    </Typography>
                                    {shippingAddress && (
                                        <Box className="p-3 border border-gray-200 rounded-md bg-white text-sm">
                                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                                <Typography variant="body2" fontWeight="medium" sx={{ color: 'text.secondary' }}>Địa Chỉ Lấy Hàng*</Typography>
                                                <Link href="#" variant="body2" sx={{ color: 'blue.600', textDecoration: 'none' }}>Thay đổi</Link>
                                            </Box>
                                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                                                <span className="font-semibold">{shippingAddress.fullName}</span> {shippingAddress.phone}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {shippingAddress.streetAddress}, {shippingAddress.ward?.name}, {shippingAddress.district?.name}, {shippingAddress.province?.name}
                                            </Typography>

                                            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={1}>
                                                <Typography variant="body2" fontWeight="medium" sx={{ color: 'text.secondary' }}>Đơn Vị Vận Chuyển</Typography>
                                                <Link href="#" variant="body2" sx={{ color: 'blue.600', textDecoration: 'none' }}>Xem hướng dẫn</Link>
                                            </Box>
                                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                                                <span className="font-semibold">{shippingMethodName || 'GHN'}</span>
                                            </Typography>

                                            <Typography variant="body2" fontWeight="medium" sx={{ color: 'text.secondary', mt: 2 }}>Ngày Lấy Hàng*</Typography>
                                            <Box className="flex gap-2 mt-1">
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{
                                                        borderColor: 'red',
                                                        color: 'red',
                                                        fontWeight: 'bold',
                                                        '&:hover': {
                                                            borderColor: 'red',
                                                            bgcolor: 'red.50',
                                                        },
                                                    }}
                                                >
                                                    {formattedPickupDate1}
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{
                                                        borderColor: 'grey.300',
                                                        color: 'text.primary',
                                                        fontWeight: 'bold',
                                                        '&:hover': {
                                                            borderColor: 'grey.400',
                                                            bgcolor: 'grey.50',
                                                        },
                                                    }}
                                                >
                                                    {formattedPickupDate2}
                                                </Button>
                                            </Box>
                                        </Box>
                                    )}
                                </Box>
                            }
                            sx={{
                                alignItems: 'flex-start', // Align radio to the top of the label content
                                pt: 2, pb: 2, pr: 2, // Add padding to the radio button container
                                pl: 2, // Keep left padding
                                borderBottom: '1px solid #e0e0e0', // Separator line
                                '& .MuiRadio-root': { pr: 1.5, pt: 1, pb: 1 }, // Adjust radio icon padding
                                '& .MuiFormControlLabel-label': { flexGrow: 1 } // Allow label to take available space
                            }}
                        />

                        {/* Option: Tự gửi hàng tại bưu cục */}
                        <FormControlLabel
                            value="self_send"
                            control={<Radio size="small" />}
                            label={
                                <Box className="flex flex-col flex-grow">
                                    <Typography variant="body1" fontWeight="bold" className="flex items-center">
                                        Trả hàng tại bưu cục <span className="text-green-600 ml-2 text-xs font-semibold">(Miễn Ship Hoàn Về)</span>
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                        Bạn có thể chủ động thời gian trả hàng tại các bưu cục đối tác. Bấm để xem địa chỉ gần nhất.
                                    </Typography>
                                </Box>
                            }
                            sx={{
                                alignItems: 'flex-start',
                                pt: 2, pb: 2, pr: 2, // Add padding to the radio button container
                                pl: 2, // Keep left padding
                                '& .MuiRadio-root': { pr: 1.5, pt: 1, pb: 1 },
                                '& .MuiFormControlLabel-label': { flexGrow: 1 }
                            }}
                        />
                    </RadioGroup>
                </Box>

                {returnMethod === "self_send" && (
                    <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', mx: 2, mt: 2 }}> {/* Added padding and border top */}
                        <TextField
                            label="Mã vận đơn (nếu có)"
                            fullWidth
                            value={trackingCode}
                            onChange={(e) => setTrackingCode(e.target.value)}
                            placeholder="VD: VN123456789"
                            size="small" // Make it smaller
                        />
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2, justifyContent: 'flex-end', gap: 1 }}> {/* Aligned to right and added gap */}
                <Button onClick={onClose} variant="outlined" color="primary">Huỷ yêu cầu</Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    startIcon={loading && <CircularProgress size={18} />}
                    sx={{
                        bgcolor: 'red', // Example color as seen in image for "Gửi yêu cầu"
                        '&:hover': { bgcolor: 'darkred' }
                    }}
                >
                    {loading ? "Đang xử lý..." : "Gửi yêu cầu"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}