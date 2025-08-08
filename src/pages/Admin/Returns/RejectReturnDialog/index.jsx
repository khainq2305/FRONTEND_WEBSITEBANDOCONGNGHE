import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText,
  TextField, Button, Typography, Box
} from '@mui/material';

const rejectReasonsOptions = [
  { id: 'INVALID_PROOF', label: 'Bằng chứng không rõ ràng/không hợp lệ' },
  { id: 'OUT_OF_POLICY', label: 'Yêu cầu nằm ngoài chính sách đổi trả' },
  { id: 'WRONG_ITEM_RETURNED', label: 'Sản phẩm gửi về không đúng với yêu cầu' },
  { id: 'DAMAGED_BY_CUSTOMER', label: 'Sản phẩm bị lỗi do người mua' },
  { id: 'OVER_TIME_LIMIT', label: 'Đã quá thời hạn yêu cầu đổi trả' },
  { id: 'OTHER', label: 'Nhập lý do khác' },
];

const RejectReturnDialog = ({
  open,
  onClose,
  onConfirm,
  selectedReason,
  setSelectedReason,
  customReason,
  setCustomReason,
  reasonError,
  setReasonError
}) => {
  const handleSelect = (reasonId) => {
    setSelectedReason(reasonId);
    setReasonError(false);
  };

  return (
<Dialog
  open={open}
  onClose={onClose}
  fullWidth
  maxWidth="xs"

  PaperProps={{
    sx: {
      m: 0,
      position: 'absolute',
      top: '50%',

      left: '50%',
      transform: 'translate(-50%, -50%)'
    }
  }}
>


      <DialogTitle>Từ chối yêu cầu trả hàng</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Chọn lý do từ chối, hoặc nhập chi tiết nếu chọn "Lý do khác".
        </DialogContentText>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            mb: 2
          }}
        >
          {rejectReasonsOptions.map((reason) => (
            <Button
              key={reason.id}
              variant={selectedReason === reason.id ? 'contained' : 'outlined'}
              color="error"
              size="small"
              onClick={() => handleSelect(reason.id)}
              sx={{
                textTransform: 'none',
                borderRadius: '10px',
                px: 2
              }}
            >
              {reason.label}
            </Button>
          ))}
        </Box>

        {selectedReason === 'OTHER' && (
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Lý do chi tiết"
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            error={reasonError && !customReason.trim()}
            helperText={
              reasonError && !customReason.trim() ? 'Vui lòng nhập lý do cụ thể' : ''
            }
          />
        )}

        {reasonError && !selectedReason && (
          <Typography color="error" mt={1}>
            Vui lòng chọn một lý do.
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Huỷ</Button>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
        >
          Từ chối yêu cầu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RejectReturnDialog;
