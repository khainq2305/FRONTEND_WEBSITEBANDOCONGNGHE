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
  TableRow
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Pagination from '@mui/material/Pagination';
import { API_BASE_URL } from '../../../../../constants/environment';
import MUIPagination from '../../../../../components/common/Pagination';
import HighlightText from '../../../../../components/Admin/HighlightText';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('blob:') || path.startsWith('http')) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

export default function ProductSelectionDialog({
  open,
  onClose,
  value,
  onChange,
  fetchProducts 
}) {
  const [selectedProductIds, setSelectedProductIds] = useState(value || []);
  const [productList, setProductList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    setSelectedProductIds(value || []);
  }, [value, open]);

  useEffect(() => {
    if (!open) return;
    const fetch = async () => {
      setIsLoading(true);
      try {
        const res = await fetchProducts({
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm
        });
        setProductList(res.data?.data || []);
        setTotalItems(res.data?.pagination?.totalItems || 0);
      } catch (err) {
        console.error('Lỗi fetch sản phẩm:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [open, currentPage, searchTerm, fetchProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleToggle = (productId) => {
    const index = selectedProductIds.indexOf(productId);
    const newSelected = [...selectedProductIds];
    if (index === -1) newSelected.push(productId);
    else newSelected.splice(index, 1);
    setSelectedProductIds(newSelected);
  };

  const handleSave = () => {
    onChange(selectedProductIds);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
      <DialogTitle>Chọn sản phẩm</DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            autoFocus
            size="small"
            variant="outlined"
            placeholder="Tìm kiếm theo tên sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
        </Box>
        <TableContainer sx={{ maxHeight: '60vh' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" sx={{ width: '60px' }} />
                <TableCell>Sản phẩm</TableCell>
                <TableCell align="right">Giá</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productList.map((product) => {
                const isSelected = selectedProductIds.includes(product.id);
                return (
                  <TableRow
                    hover
                    key={product.id}
                    onClick={() => handleToggle(product.id)}
                    selected={isSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={isSelected} color="primary" />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar variant="rounded" src={getImageUrl(product.thumbnail)} alt={product.name} />
                        <Typography variant="body2">
                          <HighlightText text={product.name} highlight={searchTerm} />
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      {product.price > 0 && product.originalPrice > product.price ? (
                        <>
                          <span
                            style={{
                              textDecoration: 'line-through',
                              color: '#888',
                              marginRight: 4
                            }}
                          >
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND'
                            }).format(product.originalPrice)}
                          </span>
                          <span style={{ color: '#d32f2f', fontWeight: 600 }}>
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND'
                            }).format(product.price)}
                          </span>
                        </>
                      ) : (
                        <span style={{ fontWeight: 500 }}>
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          }).format(product.originalPrice || 0)}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {!isLoading && productList.length === 0 && (
          <Typography sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>Không tìm thấy sản phẩm nào.</Typography>
        )}

        {totalItems > itemsPerPage && (
          <Box display="flex" justifyContent="center" mt={2} mb={1}>
            <MUIPagination currentPage={currentPage} totalItems={totalItems} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Hủy</Button>
        <Button onClick={handleSave} variant="contained">
          Lưu ({selectedProductIds.length} sản phẩm)
        </Button>
      </DialogActions>
    </Dialog>
  );
}
