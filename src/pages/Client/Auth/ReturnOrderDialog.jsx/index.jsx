import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextareaAutosize,
  Box,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { toast } from 'react-toastify';
import { orderService } from '../../../../services/client/orderService';
import { Upload, X, FileImage, Video } from 'lucide-react';

// Danh sách lý do có sẵn, định nghĩa bên ngoài component để tránh re-render không cần thiết
const returnReasons = [
  { id: 'WRONG_SIZE_COLOR', label: 'Nhận sai kích cỡ, màu sắc, hoặc sai sản phẩm' },
  { id: 'NOT_AS_DESCRIBED', label: 'Sản phẩm khác với mô tả của shop' },
  { id: 'DEFECTIVE', label: 'Sản phẩm bị lỗi, hư hỏng, không hoạt động' },
  { id: 'CHANGE_MIND', label: 'Không còn nhu cầu mua nữa' },
  { id: 'OTHER', label: 'Lý do khác (vui lòng mô tả bên dưới)' },
];

const ReturnOrderDialog = ({ isOpen, onClose, orderId, onSuccess }) => {
  const [selectedReason, setSelectedReason] = useState(''); // Lưu mã lý do: 'WRONG_SIZE'...
  const [detailedReason, setDetailedReason] = useState(''); // Lưu mô tả thêm
  const [evidenceFiles, setEvidenceFiles] = useState([]); // Lưu danh sách File object
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // Xử lý khi người dùng chọn file
  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (evidenceFiles.length + newFiles.length > 7) {
        toast.error('Chỉ có thể tải lên tối đa 7 file ảnh/video.');
        return;
      }
      setEvidenceFiles((prevFiles) => [...prevFiles, ...newFiles]);
      // Reset giá trị của input để người dùng có thể chọn lại file giống hệt
      e.target.value = null;
    }
  };

  // Xóa một file khỏi danh sách
  const removeFile = (indexToRemove) => {
    setEvidenceFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  // Reset form về trạng thái ban đầu
  const resetForm = () => {
    setSelectedReason('');
    setDetailedReason('');
    setEvidenceFiles([]);
  };

  // Đóng dialog
  const handleClose = () => {
    if (submitting) return;
    resetForm();
    onClose();
  };

  // Xử lý khi bấm nút "Gửi yêu cầu"
  const handleSubmit = async () => {
    if (!selectedReason) {
      toast.error('Vui lòng chọn một lý do trả hàng');
      return;
    }
    if (selectedReason === 'OTHER' && !detailedReason.trim()) {
      toast.error('Vui lòng nhập mô tả chi tiết cho "Lý do khác"');
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
  formData.append("orderId", String(Number(orderId))); // ✅ ép thành số và truyền chuỗi


    // Gửi dữ liệu lý do đã được cấu trúc
  formData.append('reason', selectedReason === 'OTHER' ? detailedReason : selectedReason);

    // Phân loại và thêm file vào FormData
    evidenceFiles.forEach((file) => {
      if (file.type.startsWith('image/')) {
        formData.append('images', file);
      } else if (file.type.startsWith('video/')) {
        formData.append('videos', file);
      }
    });

    try {
      await orderService.returnRequest(formData);
      toast.success('Yêu cầu trả hàng đã được gửi thành công!');
      if (onSuccess) onSuccess();
      handleClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Gửi yêu cầu thất bại, vui lòng thử lại.');
      console.error("Return request failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #eee' }}>
        Yêu cầu Trả hàng / Hoàn tiền
      </DialogTitle>
      <DialogContent dividers sx={{ p: { xs: 2, sm: 3 }, backgroundColor: '#f9fafb' }}>
        {/* Phần chọn lý do */}
        <Box mb={3}>
          <label className="font-semibold text-gray-800 mb-2 block">1. Lý do trả hàng của bạn là gì?</label>
          <RadioGroup value={selectedReason} onChange={(e) => setSelectedReason(e.target.value)}>
            {returnReasons.map((reason) => (
              <FormControlLabel key={reason.id} value={reason.id} control={<Radio size="small" />} label={reason.label} />
            ))}
          </RadioGroup>
        </Box>

        {/* Phần mô tả chi tiết */}
        <Box mb={3}>
          <label className="font-semibold text-gray-800 mb-1 block">2. Mô tả chi tiết (không bắt buộc)</label>
          <TextareaAutosize
            minRows={3}
            placeholder="Để yêu cầu được xử lý nhanh hơn, bạn có thể mô tả thêm về vấn đề..."
            value={detailedReason}
            onChange={(e) => setDetailedReason(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
        </Box>

        {/* Phần tải ảnh/video */}
        <Box>
          <label className="font-semibold text-gray-800 mb-1 block">3. Tải lên bằng chứng (ảnh/video)</label>
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
          {/* Vùng xem trước các file đã chọn */}
          {evidenceFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-gray-700">Các file đã chọn:</p>
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
                  <IconButton size="small" onClick={() => removeFile(index)} disabled={submitting} aria-label="Xóa file">
                    <X className="h-4 w-4 text-red-500 hover:text-red-700" />
                  </IconButton>
                </div>
              ))}
            </div>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
        <Button onClick={handleClose} disabled={submitting}>
          Hủy
        </Button>
        <Button onClick={handleSubmit} disabled={submitting} variant="contained" color="primary">
          {submitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReturnOrderDialog;