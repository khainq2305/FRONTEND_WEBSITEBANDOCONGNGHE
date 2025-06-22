// CommentTable.jsx

import { Table, TableBody, TableCell, TableHead, TableRow, Avatar, Typography, Chip, IconButton, Box, Menu, MenuItem } from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import StarIcon from '@mui/icons-material/Star';
import { motion, AnimatePresence } from 'framer-motion'; // MỚI: Import motion

// MỚI: Định nghĩa các hiệu ứng cho table
const tableVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // Mỗi dòng sẽ xuất hiện cách nhau 0.05s
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};


const CommentTable = ({ comments, page, rowsPerPage, onReplyClick, onViewDetail, anchorEl, onMenuOpen, onMenuClose, menuRow }) => {
  const isMenuOpen = Boolean(anchorEl);



  return (
    <>
      <Table sx={{ minWidth: 1000 }}>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Sản phẩm</TableCell>
            <TableCell>Người dùng</TableCell>
            <TableCell>Đánh giá</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell>Thời gian</TableCell>
            <TableCell align="center">Hành động</TableCell>
          </TableRow>
        </TableHead>
        {/* MỚI: Bọc TableBody bằng motion.tbody để có hiệu ứng */}
        <motion.tbody variants={tableVariants} initial="hidden" animate="visible">
          {comments.map((item, index) => (
            // MỚI: Bọc TableRow bằng motion.tr
            <motion.tr
              key={item.id}
              variants={rowVariants}
              // CẢI TIẾN: Di chuyển style vào component và thêm hiệu ứng
              style={{
                cursor: 'pointer',
              }}
              transition={{ type: 'spring', stiffness: 300 }}
              // MỚI: Thêm onClick cho cả hàng
              onClick={() => onViewDetail(item)}
            >
              <TableCell>{page * rowsPerPage + index + 1}</TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar src={item.sku?.product?.thumbnail} variant="rounded" sx={{ width: 64, height: 64 }} />
                  <Box>
                    <Typography fontWeight={600}>{item.sku?.product?.name}</Typography>
                    {item.sku?.variantValues?.length > 0 && (
                      <Typography variant="caption" color="text.secondary">
                        {item.sku.variantValues
                          .map(vv => vv.variantValue?.variant?.name && vv.variantValue?.value
                              ? `${vv.variantValue.variant.name}: ${vv.variantValue.value}`
                              : null
                          )
                          .filter(Boolean)
                          .join(', ')}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Avatar src={item.user?.avatarUrl} />
                  <Typography>{item.user?.fullName}</Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box display="flex">
                  {[...Array(5)].map((_, i) =>
                    i < item.rating ? (
                      <StarIcon key={i} fontSize="small" sx={{ color: '#ffb400' }} />
                    ) : (
                      <StarIcon key={i} fontSize="small" sx={{ color: 'grey.300' }} />
                    )
                  )}
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={item.isReplied ? 'Đã phản hồi' : 'Chưa phản hồi'}
                  color={item.isReplied ? 'success' : 'warning'}
                  size="small"
                  variant="outlined" // CẢI TIẾN: đổi thành outlined cho nhẹ nhàng
                />
              </TableCell>
              <TableCell>{new Date(item.createdAt).toLocaleString('vi-VN')}</TableCell>
              <TableCell align="center">
                {/* MỚI: Ngăn sự kiện click của hàng lan tới nút này */}
                <IconButton onClick={(e) => { e.stopPropagation(); onMenuOpen(e, item); }}>
                  <MoreVertIcon />
                </IconButton>
              </TableCell>
            </motion.tr>
          ))}
        </motion.tbody>
      </Table>

      <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={onMenuClose}>
        <MenuItem
          onClick={(e) => { e.stopPropagation(); onReplyClick(menuRow); onMenuClose(); }}
          disabled={menuRow?.isReplied}
        >
          <ReplyIcon fontSize="small" sx={{ mr: 1.5 }} /> Phản hồi
        </MenuItem>
        <MenuItem
          onClick={(e) => { e.stopPropagation(); onViewDetail(menuRow); onMenuClose(); }}
        >
          <VisibilityIcon fontSize="small" sx={{ mr: 1.5 }} /> Xem chi tiết
        </MenuItem>
      </Menu>
    </>
  );
};

export default CommentTable;