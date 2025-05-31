import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card, CardHeader, CardContent, Typography, Box, Menu, MenuItem
} from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';

import { reviewService } from '@/services/admin/reviewService';
import FilterBar from '../FilterBar';
import ReviewTable from '../ReviewTable';
import ReplyDialog from '../ReplyDialog';

const ReviewDetail = () => {
  const { skuId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [productName, setProductName] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedRating, setSelectedRating] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [dialogReplyText, setDialogReplyText] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRow, setMenuRow] = useState(null);

 useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await reviewService.getBySku(skuId);
      const list = res.data.data || [];

      setReviews(list);

      if (list.length > 0) {
        setProductName(list[0]?.sku?.product?.name || '');
      }
    } catch (err) {
      console.error('Lỗi khi lấy đánh giá:', err);
      setReviews([]);
    }
  };
  fetchData();
}, [skuId]);


  useEffect(() => {
    const f = reviews.filter(item => {
      const matchText = item.content?.toLowerCase()?.includes(searchText.toLowerCase());
      const matchRating = selectedRating === 'all' || item.rating === parseInt(selectedRating);
      const matchStatus = selectedStatus === 'all' || (selectedStatus === 'replied' ? item.isReplied : !item.isReplied);
      return matchText && matchRating && matchStatus;
    });
    setFiltered(f);
  }, [reviews, searchText, selectedRating, selectedStatus]);

  const handleReply = (row) => {
    setSelectedReview(row);
    setDialogReplyText(row.replyContent || '');
    setOpenDialog(true);
    handleCloseMenu();
  };

  const handleSubmitReply = async () => {
    if (!dialogReplyText.trim()) return;
    try {
      await reviewService.replyToReview(selectedReview.id, {
        replyContent: dialogReplyText,
        responderId: 1 // hoặc lấy từ context admin
      });

      const updated = reviews.map(r =>
        r.id === selectedReview.id
          ? {
              ...r,
              replyContent: dialogReplyText,
              isReplied: true
            }
          : r
      );
      setReviews(updated);
      setOpenDialog(false);
    } catch (err) {
      console.error('❌ Lỗi khi gửi phản hồi:', err);
    }
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuRow(null);
  };

  return (
    <Card>
      <CardHeader
        title={
          <Typography variant="h6" fontWeight="bold">
            💬 Chi tiết đánh giá - <span style={{ color: '#1976d2' }}>{productName || '...'}</span>
          </Typography>
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

        <ReviewTable
          data={filtered}
          page={0}
          onMenuOpen={(e, row) => {
            setAnchorEl(e.currentTarget);
            setMenuRow(row);
          }}
        />

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
          <MenuItem onClick={() => handleReply(menuRow)}>
            <ReplyIcon fontSize="small" sx={{ mr: 1 }} /> Phản hồi
          </MenuItem>
        </Menu>

        <ReplyDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onSubmit={handleSubmitReply}
          selectedReview={selectedReview}
          dialogReplyText={dialogReplyText}
          onChangeText={setDialogReplyText}
        />
      </CardContent>
    </Card>
  );
};

export default ReviewDetail;
