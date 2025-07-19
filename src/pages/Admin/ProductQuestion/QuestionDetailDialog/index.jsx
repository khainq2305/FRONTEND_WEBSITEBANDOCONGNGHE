// components/admin/questions/QuestionDetailDialog.jsx
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Box, Avatar, Chip, Stack, Button, Divider
} from '@mui/material';

const QuestionDetailDialog = ({ open, onClose, question, formatDateTime }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chi tiết câu hỏi</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography fontWeight={600}>{question?.fullname} hỏi:</Typography>
          <Typography mt={0.5}>{question?.content}</Typography>
          <Typography variant="caption" color="text.secondary">
            {formatDateTime(question?.created_at)}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" gutterBottom>
          Lịch sử phản hồi:
        </Typography>

        {question?.replies?.length > 0 ? (
          question.replies.map((r) => (
            <Box key={r.question_id} mb={2}>
              <Stack direction="row" gap={2}>
                <Avatar>{r.fullname[0]}</Avatar>
                <Box>
                  <Typography fontWeight={600}>{r.fullname}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDateTime(r.created_at)}
                  </Typography>
                  <Typography>{r.content}</Typography>
                  {r.replied_by && (
                    <Typography variant="caption" color="text.secondary">
                      Phản hồi bởi: {r.replied_by}
                    </Typography>
                  )}
                </Box>
              </Stack>
            </Box>
          ))
        ) : (
          <Typography fontStyle="italic" color="text.secondary">
            Chưa có phản hồi nào.
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuestionDetailDialog;
