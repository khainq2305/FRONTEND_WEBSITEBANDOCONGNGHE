import { Box, Chip, Typography } from '@mui/material';
import { Check, X } from 'lucide-react';

const subjectMap = {
  Product: 'Quản lý sản phẩm',
  Attribute: 'Quản lý thuộc tính',
  User: 'Quản lý người dùng',
  Order: 'Quản lý Đơn hàng',
  Category: 'Quản lý danh mục sản phẩm',
  Voucher: 'Quản lý voucher',
  Slide: 'Quản lý slide',
  Notification: 'Quản lý thông báo'
  
};

const actionLabel = {
  read: 'Xem',
  create: 'Thêm',
  update: 'Chỉnh sửa',
  delete: 'Xóa'
};

const CrudChips = ({ user = {} }) => {
  const permissions = user.permissions || [];

  // Lấy danh sách subject duy nhất
  const subjects = [...new Set(permissions.map((p) => p.subject))];

  const hasPermission = (subject, action) => permissions.some((p) => p.subject === subject && p.action === action);

  return (
    <Box>
      {subjects.map((subject) => (
        <Box key={subject} sx={{ mb: 2 }}>
          <Typography variant="subtitle2" fontWeight={600} mb={0.5}>
            {subjectMap[subject] || subject}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {Object.entries(actionLabel).map(([action, label]) => (
              <Chip
                index={!hasPermission(subject, action)}
                disabled={!hasPermission(subject, action)}
                key={action}
                label={label}
                size="small"
                variant="outlined"
                deleteIcon={hasPermission(subject, action) ? <Check size={18} color="#02a32d" /> : <X size={18} color="#ff0000" />}
                onDelete={() => {}}
                sx={{
                  '& .MuiChip-deleteIcon': { pointerEvents: 'none' }
                }}
              />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default CrudChips;
