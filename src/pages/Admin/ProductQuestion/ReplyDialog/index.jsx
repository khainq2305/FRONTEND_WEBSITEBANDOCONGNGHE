// components/admin/questions/ReplyDialog.jsx
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, TextField, Button, Box, Stack
} from '@mui/material';

const ReplyDialog = ({ open, onClose, onSubmit, question, value, onChange }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Trả lời câu hỏi</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography fontWeight={500}>{question?.fullname} hỏi:</Typography>
          <Typography>“{question?.content}”</Typography>
        </Box>

        <TextField
          fullWidth
          multiline
          minRows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Nhập nội dung phản hồi..."
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={onSubmit} disabled={!value.trim()}>
          Gửi phản hồi
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReplyDialog;
