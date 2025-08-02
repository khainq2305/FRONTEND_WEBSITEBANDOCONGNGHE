import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  TextField,
  Typography,
  Box,
  Chip
} from '@mui/material';
import { comboService } from '@/services/admin/comboService'; // ✅ sửa lại đúng service

const ProductSelectModal = ({ open, onClose, onConfirm, selectedSkus }) => {
  const [skus, setSkus] = useState([]);
  const [selected, setSelected] = useState([...selectedSkus]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchSkus();
  }, []);

  const fetchSkus = async () => {
    try {
      const res = await comboService.getAllSkus(); // ✅ gọi API chuẩn
      const result = res?.data || [];
      console.log('🧾 Dữ liệu SKU trả về từ API:', result);
      setSkus(result);
    } catch (err) {
      console.error('❌ Lỗi lấy danh sách SKU:', err);
    }
  };

  const handleToggle = (skuId) => {
    setSelected((prev) => (prev.includes(skuId) ? prev.filter((id) => id !== skuId) : [...prev, skuId]));
  };
  const handleConfirm = () => {
    const selectedSkus = skus
      .filter((sku) => selected.includes(sku.id))
      .map((sku) => {
        console.log('🔍 SKU raw in modal:', sku);
        return {
          id: sku.id,
          name: sku.name || sku?.product?.name || '',
          price: parseFloat(sku.price || 0),
          stock: sku.stock || 0 // 👈 THÊM DÒNG NÀY
        };
      });

    onConfirm(selectedSkus); // ✅ Trả về object đầy đủ
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Chọn sản phẩm (SKU)</DialogTitle>
      <DialogContent>
        {/* Nếu backend hỗ trợ search sau thì mở lại */}
        {/* <TextField
          fullWidth
          variant="outlined"
          size="small"
          label="Tìm kiếm SKU"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4"
        /> */}

        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>
                <strong>Hình ảnh</strong>
              </TableCell>
              <TableCell>
                <strong>Tên sản phẩm</strong>
              </TableCell>
              <TableCell>
                <strong>Mã SKU</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Tồn kho</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Giá bán</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {skus.map((sku) => {
              const price = sku?.price;
              const originalPrice = sku?.originalPrice;
              const hasDiscount = typeof price === 'number' && typeof originalPrice === 'number' && originalPrice > price;

              const discountPercent = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

              return (
                <TableRow key={sku.id}>
                  <TableCell>
                    <Checkbox checked={selected.includes(sku.id)} onChange={() => handleToggle(sku.id)} />
                  </TableCell>

                  <TableCell>
                    <img
                      src={sku.thumbnail || sku.image || sku?.product?.thumbnail || '/no-image.png'}
                      alt={sku.name || sku?.product?.name}
                      style={{
                        width: 64,
                        height: 64,
                        objectFit: 'cover',
                        borderRadius: 8
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <Typography fontWeight="bold">{sku.name || sku?.product?.name}</Typography>

                    {discountPercent >= 30 && (
                      <Chip
                        label="🔥 GIÁ TỐT"
                        size="small"
                        sx={{
                          mt: 1,
                          fontSize: '10px',
                          fontWeight: 'bold',
                          backgroundColor: '#fde68a',
                          color: '#92400e',
                          display: 'inline-block'
                        }}
                      />
                    )}
                  </TableCell>

                  <TableCell>{sku.skuCode || '—'}</TableCell>

                  <TableCell align="right">{sku.stock ?? '—'}</TableCell>

                  <TableCell align="right">
                    <Box textAlign="right">
                      {hasDiscount ? (
                        <>
                          <Typography
                            variant="caption"
                            sx={{
                              display: 'inline-block',
                              backgroundColor: '#ef4444',
                              color: '#fff',
                              px: 0.5,
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: 'bold',
                              mb: 0.5
                            }}
                          >
                            -{discountPercent}%
                          </Typography>

                          <Typography fontWeight="bold" color="error">
                            {price.toLocaleString('vi-VN')}₫
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              textDecoration: 'line-through',
                              color: 'text.secondary'
                            }}
                          >
                            {originalPrice.toLocaleString('vi-VN')}₫
                          </Typography>

                          <Typography variant="caption" sx={{ color: 'green' }}>
                            Tiết kiệm {(originalPrice - price).toLocaleString('vi-VN')}₫
                          </Typography>
                        </>
                      ) : price ? (
                        <Typography fontWeight="bold" color="error">
                          {price.toLocaleString('vi-VN')}₫
                        </Typography>
                      ) : (
                        '—'
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Huỷ</Button>
        <Button onClick={handleConfirm} variant="contained">
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductSelectModal;
