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
  const isSameContent =
    dialogReplyText.trim() === selectedReview?.replyContent?.trim();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Phản hồi đánh giá</DialogTitle>

      <DialogContent dividers>
        <Typography
          mb={1}
          sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
        >
          <strong>{selectedReview?.user?.fullName}:</strong>{" "}
          {selectedReview?.content}
        </Typography>

        <TextField
          multiline
          fullWidth
          minRows={3}
          value={dialogReplyText}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder="Nhập nội dung phản hồi..."
        />

        {selectedReview?.isReplied && (
          <Typography color="warning.main" variant="caption" sx={{ mt: 1 }}>
            Đánh giá này đã được phản hồi và không thể chỉnh sửa thêm.
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="error">
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={!dialogReplyText.trim() || isSameContent}
        >
          Gửi
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReplyDialog;
