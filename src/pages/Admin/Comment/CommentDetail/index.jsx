import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  Menu,
  MenuItem
} from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';

import PaginationComponent from 'components/common/Pagination';
import FilterBar from "../FilterBar";

import CommentTable from '../CommentTable';
import ReplyDialog from '../ReplyDialog';

const CommentDetail = () => {
  const { productId } = useParams();
  const currentUser = 'Admin';

  const [comments, setComments] = useState([]);
  const [productName, setProductName] = useState('');
  const [searchText, setSearchText] = useState('');
  const [selectedRating, setSelectedRating] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRow, setMenuRow] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [dialogReplyText, setDialogReplyText] = useState('');

  useEffect(() => {
    const mockData = {
      productName: 'iPhone 16 Pro Max',
      comments: [
        {
          id: 'c1',
          user: 'Nguyễn Văn A',
          avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
          rating: 5,
          content: 'Sản phẩm rất tốt, giao hàng nhanh!',
          reply: 'Cảm ơn bạn đã ủng hộ!',
          replyDate: '12/05/2025',
          repliedBy: 'Admin',
          date: '10/05/2025'
        },
        {
          id: 'c2',
          user: 'Trần Thị B',
          avatar: 'https://randomuser.me/api/portraits/women/24.jpg',
          rating: 4,
          content: 'Máy đẹp nhưng pin hơi yếu.',
          reply: null,
          replyDate: null,
          repliedBy: null,
          date: '11/05/2025'
        },
        {
          id: 'c3',
          user: 'Hoàng Văn C',
          avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
          rating: 3,
          content: 'Tạm ổn trong tầm giá.',
          reply: null,
          replyDate: null,
          repliedBy: null,
          date: '09/05/2025'
        }
      ]
    };
    setProductName(mockData.productName);
    setComments(mockData.comments);
  }, [productId]);

  const filteredData = comments.filter((item) => {
    const matchesText = item.content.toLowerCase().includes(searchText.toLowerCase());
    const matchesRating = selectedRating === 'all' || item.rating === parseInt(selectedRating);
    const matchesStatus =
      selectedStatus === 'all' || (selectedStatus === 'replied' ? !!item.reply : !item.reply);
    return matchesText && matchesRating && matchesStatus;
  });

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleOpenMenu = (e, row) => {
    setAnchorEl(e.currentTarget);
    setMenuRow(row);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuRow(null);
  };

  const handleStartReply = (row) => {
    setSelectedComment(row);
    setDialogReplyText(row.reply || '');
    setOpenDialog(true);
    handleCloseMenu();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedComment(null);
    setDialogReplyText('');
  };

  const handleSubmitReply = () => {
    if (!dialogReplyText.trim()) {
      alert('Vui lòng nhập nội dung phản hồi.');
      return;
    }

    const now = new Date().toLocaleString('vi-VN');
    const updatedComments = comments.map((c) =>
      c.id === selectedComment.id
        ? {
            ...c,
            reply: dialogReplyText,
            replyDate: now,
            repliedBy: currentUser
          }
        : c
    );
    setComments(updatedComments);
    handleCloseDialog();
  };

  return (
    <Card>
      <CardHeader
        title={
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h6" fontWeight="bold">
              💬 Chi tiết bình luận - <span style={{ color: '#1976d2' }}>{productName}</span>
            </Typography>
          </Box>
        }
      />
      <CardContent>
        <FilterBar
          searchText={searchText}
          onSearchChange={setSearchText}
          selectedRating={selectedRating}
          onRatingChange={setSelectedRating}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />

        <CommentTable
          data={paginatedData}
          page={page}
          onMenuOpen={handleOpenMenu}
        />

        <Box mt={4}>
          <PaginationComponent
            totalPages={Math.ceil(filteredData.length / rowsPerPage)}
            currentPage={page + 1}
            onChange={(value) => setPage(value - 1)}
          />
        </Box>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
          <MenuItem onClick={() => handleStartReply(menuRow)}>
            <ReplyIcon fontSize="small" sx={{ mr: 1 }} /> Phản hồi
          </MenuItem>
        </Menu>

        <ReplyDialog
          open={openDialog}
          onClose={handleCloseDialog}
          onSubmit={handleSubmitReply}
          selectedComment={selectedComment}
          dialogReplyText={dialogReplyText}
          onChangeText={setDialogReplyText}
        />
      </CardContent>
    </Card>
  );
};

export default CommentDetail;
