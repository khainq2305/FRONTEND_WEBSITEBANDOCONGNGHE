import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { API_BASE_URL } from '../../../../../constants/environment';
import MUIPagination from '../../../../../components/common/Pagination';
import HighlightText from '../../../../../components/Admin/HighlightText';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('blob:') || path.startsWith('http')) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

export default function SkuSelectionDialog({
  open,
  onClose,
  value,
  onChange,
  fetchSkus,
}) {
  const [selectedIds, setSelectedIds] = useState(value || []);
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 10;

  useEffect(() => {
    setSelectedIds(value || []);
  }, [value, open]);

  useEffect(() => {
    if (!open) return;
    const run = async () => {
      setIsLoading(true);
      try {
       
        const res = await fetchSkus({ page, limit, search });
       
        const list = res?.data?.data || [];
       
        setRows(list);
        setTotalItems(res?.data?.pagination?.totalItems || 0);
      } catch (e) {
        console.error('Error fetching SKUs:', e);
      } finally {
        setIsLoading(false);
      }
    };
    run();
  }, [open, page, search, fetchSkus]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const toggle = (id) => {
    setSelectedIds((prev) => {
      const exists = prev.includes(id);
      if (exists) return prev.filter((x) => x !== id);
      return [...prev, id];
    });
  };

const handleSave = () => {
  const selectedSkus = rows.filter(sku => selectedIds.includes(sku.id));
  onChange(selectedSkus);
  onClose();
};


  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Chọn sản phẩm (SKU)</DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Tìm theo tên sản phẩm hoặc mã SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <TableContainer sx={{ maxHeight: '60vh' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" sx={{ width: 60 }} />
                <TableCell>Sản phẩm / SKU</TableCell>
                <TableCell  align="center">Giá gốc</TableCell>
                <TableCell align="center">Tồn kho</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((sku) => {
                const isChecked = selectedIds.includes(sku.id);
                return (
                  <TableRow
                    key={sku.id}
                    hover
                    onClick={() => toggle(sku.id)}
                    selected={isChecked}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={isChecked} color="primary" />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          variant="rounded"
                          src={getImageUrl(sku.primaryImage || sku.thumbnail || sku.media?.[0]?.mediaUrl || '')}
                          alt={sku.productName}
                          sx={{ width: 44, height: 44 }}
                        />
                        <Box>
                          <Typography variant="body2" fontWeight={600} lineHeight={1.3}>
                            <HighlightText text={sku.productName || ''} highlight={search} />
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            SKU: <HighlightText text={sku.skuCode || ''} highlight={search} />
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell  align="center">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                        sku.originalPrice ?? 0
                      )}
                    </TableCell>
                    <TableCell align="center">{sku.stock ?? 0}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {!isLoading && rows.length === 0 && (
          <Typography sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
            Không tìm thấy SKU nào.
          </Typography>
        )}

        {totalItems > limit && (
          <Box display="flex" justifyContent="center" mt={2} mb={1}>
            <MUIPagination
              currentPage={page}
              totalItems={totalItems}
              itemsPerPage={limit}
              onPageChange={setPage}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSave} variant="contained">
          Lưu ({selectedIds.length} SKU)
        </Button>
      </DialogActions>
    </Dialog>
  );
}