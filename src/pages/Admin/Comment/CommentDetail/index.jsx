import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardContent, Typography, Box, Menu, MenuItem, CircularProgress } from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';

import PaginationComponent from 'components/common/Pagination';
import FilterBar from '../FilterBar';
import CommentTable from '../CommentTable';
import ReplyDialog from '../ReplyDialog';
import { reviewService } from '@/services/admin/reviewService';
import { toast } from 'react-toastify';


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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await reviewService.getAllByProductId(productId);
        console.log('✅ API getAllByProductId:', res.data);
        setComments(Array.isArray(res.data) ? res.data : []);
        if (res.data?.[0]?.sku?.product?.name) {
          setProductName(res.data[0].sku.product.name);
        }
      } catch (error) {
        console.error('❌ Lỗi khi load danh sách:', error);
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  const filteredData = comments.filter((item) => {
    const matchesText = item.content.toLowerCase().includes(searchText.toLowerCase());
    const matchesRating = selectedRating === 'all' || item.rating === parseInt(selectedRating);
    const matchesStatus = selectedStatus === 'all' || (selectedStatus === 'replied' ? !!item.reply : !item.reply);
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
  if (row.replyContent) {
    toast.info('Bình luận này đã được phản hồi rồi!');
    return;
  }

  setSelectedComment(row);
  setDialogReplyText('');
  setOpenDialog(true);
  handleCloseMenu();
};


  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedComment(null);
    setDialogReplyText('');
  };

  const handleSubmitReply = async () => {
    if (!dialogReplyText.trim()) {
      alert('Vui lòng nhập nội dung phản hồi.');
      return;
    }

    try {
      await reviewService.reply(selectedComment.id, {
        reply: dialogReplyText,
        repliedBy: currentUser
      });

      const now = new Date().toISOString(); // nên lưu định dạng chuẩn ISO
      const updatedComments = comments.map((c) =>
        c.id === selectedComment.id
          ? {
              ...c,
              replyContent: dialogReplyText,
              replyDate: now,
              repliedBy: currentUser
            }
          : c
      );
      setComments(updatedComments);
    } catch (error) {
      console.error('❌ Lỗi khi gửi phản hồi:', error);
    }

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
        {loading ? (
          <Box textAlign="center" mt={5}>
            <CircularProgress />
            <Typography mt={2} color="text.secondary" fontStyle="italic">
              Đang tải bình luận...
            </Typography>
          </Box>
        ) : (
          <>
            <FilterBar
              searchText={searchText}
              onSearchChange={setSearchText}
              selectedRating={selectedRating}
              onRatingChange={setSelectedRating}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
            />

            <CommentTable data={paginatedData} page={page} onMenuOpen={handleOpenMenu} />

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
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CommentDetail;
