import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Alert
} from '@mui/material';
import { getArticleViewUrl } from '@/constants/environment';

const EditSlugDialog = ({ open, onClose, article, onSave }) => {
  const [slug, setSlug] = useState(article?.slug || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (article) {
      setSlug(article.slug || '');
      setError('');
    }
  }, [article]);

  const handleSlugChange = (e) => {
    const value = e.target.value;
    // Auto convert to URL-friendly slug
    const urlFriendlySlug = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
    
    setSlug(urlFriendlySlug);
    setError('');
  };

  const validateSlug = () => {
    if (!slug.trim()) {
      setError('Slug không được để trống');
      return false;
    }
    if (slug.length < 3) {
      setError('Slug phải có ít nhất 3 ký tự');
      return false;
    }
    if (!/^[a-z0-9-]+$/.test(slug)) {
      setError('Slug chỉ được chứa chữ thường, số và dấu gạch ngang');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateSlug()) return;

    setLoading(true);
    try {
      await onSave(article.id, slug);
      onClose();
    } catch (error) {
      setError(error.message || 'Có lỗi xảy ra khi cập nhật slug');
    } finally {
      setLoading(false);
    }
  };

  const previewUrl = getArticleViewUrl(slug);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Chỉnh sửa Slug
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Bài viết: <strong>{article?.title}</strong>
          </Typography>
          
          <TextField
            fullWidth
            label="Slug"
            value={slug}
            onChange={handleSlugChange}
            margin="normal"
            placeholder="vd: cach-chon-laptop-tot-nhat"
            helperText="Slug sẽ được tự động format thành URL-friendly"
            error={!!error}
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="body2" color="textSecondary">
              URL xem trước:
            </Typography>
            <Typography variant="body2" color="primary" sx={{ wordBreak: 'break-all' }}>
              {previewUrl}
            </Typography>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="textSecondary">
              <strong>Lưu ý:</strong> Việc thay đổi slug có thể ảnh hưởng đến SEO và các liên kết hiện có. 
              Hãy đảm bảo cập nhật các liên kết liên quan.
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Hủy
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          disabled={loading || !!error || !slug.trim()}
        >
          {loading ? 'Đang lưu...' : 'Lưu'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSlugDialog;
