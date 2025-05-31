import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Button,
} from "@mui/material";

const ReplyDialog = ({
  open,
  onClose,
  onSubmit,
  selectedReview,
  dialogReplyText,
  onChangeText,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Phản hồi đánh giá</DialogTitle>
      <DialogContent dividers>
        <Typography mb={1}>
          <strong>{selectedReview?.user?.fullName}:</strong> {selectedReview?.content}
        </Typography>
        <TextField
          multiline
          fullWidth
          minRows={3}
          value={dialogReplyText}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder="Nhập nội dung phản hồi..."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          Hủy
        </Button>
        <Button variant="contained" onClick={onSubmit}>
          Gửi
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReplyDialog;
