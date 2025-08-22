import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, Grid, Divider, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';

const ComboDetailDialog = ({ open, onClose, combo }) => {
  console.log('🟨 combo:', combo);
  console.log('🟩 comboSkus:', combo?.comboSkus);
  if (!combo) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography fontWeight={600}>Chi tiết combo</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />

      <DialogContent sx={{ mt: 2 }}>
        {/* Thông tin combo */}
        <Grid container spacing={3} alignItems="flex-start">
          {/* Cột trái */}
          <Grid item xs={12} md={6}>
            <Detail label="Tên combo" value={combo.name} />
            <Detail label="Slug" value={combo.slug} />
            <Detail label="Giá" value={`${combo.price?.toLocaleString()} đ`} />
            <Detail
              label="Trạng thái"
              value={<Chip size="small" label={combo.isActive ? 'Hoạt động' : 'Tạm tắt'} color={combo.isActive ? 'success' : 'warning'} />}
            />
            <Detail label="Hiệu lực" value={`${formatDate(combo.startAt)} → ${formatDate(combo.expiredAt)}`} />
            <Detail label="Số lượng / Đã bán" value={`${combo.quantity ?? 0} / ${combo.sold ?? 0}`} />
            <Detail label="Combo nổi bật" value={combo.isFeatured ? '✅ Có' : '❌ Không'} />
            <Detail label="Giá gốc" value={`${combo.originalPrice?.toLocaleString()} đ`} />
            <Detail label="Giảm giá" value={getDiscountInfo(combo)} />
            <Detail label="Cân nặng" value={`${combo.weight || 0}g`} />
            <Detail label="Kích thước" value={`${combo.width || 0} x ${combo.length || 0} x ${combo.height || 0} (cm)`} />
          </Grid>

          {/* Cột phải */}
          <Grid item xs={12} md={6} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Typography fontWeight={600} mb={1}>
              Ảnh combo
            </Typography>
            <Box
              component="img"
              src={combo.thumbnail}
              alt="thumbnail"
              sx={{
                width: '100%',
                maxWidth: 300,
                borderRadius: 2,
                border: '1px solid #ccc',
                objectFit: 'cover'
              }}
            />
          </Grid>
        </Grid>

        {/* Danh sách sản phẩm trong combo */}
        {combo.comboSkus?.length > 0 && (
          <Box mt={5}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Sản phẩm trong combo
            </Typography>
            <Grid container spacing={2}>
              {combo.comboSkus.map((item) => (
                <Grid key={item.skuId} item xs={12} sm={6} md={4}>
                  <Box
                    border="1px solid #ccc"
                    borderRadius={2}
                    padding={2}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    textAlign="center"
                    height="100%"
                  >
                    <Box
                      component="img"
                      src={item.thumbnail || '/placeholder.png'}
                      alt={item.productName}
                      sx={{
                        width: '100%',
                        height: 120,
                        objectFit: 'contain', // ✅ không bị crop ảnh
                        mb: 1,
                        borderRadius: 1
                      }}
                    />

                    <Typography variant="body2" fontWeight={600}>
                      {item.productName}
                    </Typography>
                    {item.variants?.length > 0 && (
                      <Box mt={0.5}>
                        {item.variants.map((v, i) => (
                          <Typography variant="caption" key={i} sx={{ display: 'block', color: 'text.secondary' }}>
                            {v.name}: {v.value}
                          </Typography>
                        ))}
                      </Box>
                    )}

                    <Typography variant="body2" color="text.secondary">
                      Mã SKU: {item.skuId}
                    </Typography>
                    <Typography variant="body2" color="error" mt={0.5}>
                      {Number(item.price).toLocaleString('vi-VN')}₫
                    </Typography>
                    <Typography variant="caption" mt={0.5}>
                      SL: {item.quantity} – Tồn kho: {item.stock}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

const Detail = ({ label, value }) => (
  <Box mb={1.5} display="flex">
    <Typography variant="body2" fontWeight={600} sx={{ minWidth: 110 }}>
      {label}:
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
      {value || '—'}
    </Typography>
  </Box>
);

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return dayjs(dateStr).format('DD/MM/YYYY');
};

const getDiscountInfo = (combo) => {
  if (!combo.originalPrice || !combo.price || combo.originalPrice <= combo.price) return '—';
  const saved = combo.originalPrice - combo.price;
  const percent = Math.round((saved / combo.originalPrice) * 100);
  return `${percent}% – Tiết kiệm: ${saved.toLocaleString('vi-VN')}₫`;
};

export default ComboDetailDialog;
