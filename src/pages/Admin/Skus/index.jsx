import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Typography,
  Box,
  TablePagination,
  Checkbox
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import DialogDetails from './DialogDetails';
import axios from 'axios';
import useAuthStore from '@/stores/AuthStore';
import { CircleCheckBig, CircleX, TriangleAlert } from 'lucide-react';
import { skuService } from '@/services/admin/skuService';

// Tạo axios client
const axiosClient = axios.create({
  baseURL: 'http://localhost:5000/admin',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Service gọi API
// const skuService = {
//   getAll: () => {
//     return axiosClient.get('/sku');
//   },
//   logBySkuId: (id) => {
//     return axiosClient.get(`/sku/${id}/logs`);
//   },
//   importStock: (data, skuId) => {
//     return axiosClient.post(`/sku/${skuId}/import`, data);
//   },
//   exportStock: (data, skuId) => {
//     return axiosClient.post(`/sku/${skuId}/export`, data);
//   }
// };
// Hàm map trạng thái
const STOCK_STATUS = {
  'in-stock': {
    label: 'Còn hàng',
    color: 'success',
    icon: <CircleCheckBig size={12} />
  },
  'low-stock': {
    label: 'Sắp hết',
    color: 'warning',
    icon: <TriangleAlert size={12} />
  },
  'out-of-stock': {
    label: 'Hết hàng',
    color: 'error',
    icon: <CircleX size={12} />
  }
};
const getStockStatusKey = (stock) => {
  if (stock <= 0) return 'out-of-stock';
  if (stock <= 10) return 'low-stock';
  return 'in-stock';
};
export default function SkuList() {
  const { user } = useAuthStore();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [skuData, setSkuData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSku, setSelectedSku] = useState(null);
  const [logsAction, setLogsAction] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Fetch data từ API
  const fetchSkuData = async () => {
    try {
      const res = await skuService.getAll();
      setSkuData(res.data.data);
    } catch (error) {
      console.log('Lỗi:', error);
    }
  };
  const fetchLogsBySku = async (id, type) => {

    if (!id) return;
    try {
      const res = await skuService.logBySkuId(id, type);
      console.log('CALL skuId:', id, 'type:', type);
      setLogsAction(res.data.data);
      console.log('logbyid', res.data.data);
    } catch (error) {
      console.log('Lỗi fetch log:', error);
    }
  };
  const handleSubmitImport = async (data) => {
    try {
      const payload = {
        ...data,
        skuId: selectedSku.id,
        userId: user.id
      };

      await skuService.importStock(payload, selectedSku.id);

      console.log('✔ Tạo log thành công!', payload);
      const newStock = payload.stockAfter;
      setSelectedSku({
        ...selectedSku,
        stock: newStock
      });
      fetchLogsBySku(selectedSku.id);
    } catch (error) {
      console.error('❌ Lỗi khi nhập kho:', error);
    }
  };
  const handleSubmitExport = async (data) => {
    try {
      const payload = {
        ...data,
        skuId: selectedSku.id,
        userId: user.id,
        type: 'export'
      };

      await skuService.exportStock(payload, selectedSku.id);

      const newStock = payload.stockAfter;

      setSelectedSku({ ...selectedSku, stock: newStock });

      fetchLogsBySku(selectedSku.id);
    } catch (error) {
      console.error('❌ Lỗi khi xuất kho:', error);
    }
  };

  const handleSubmitAdjust = async (newStock) => {
    try {
      const payload = {
        skuId: selectedSku.id,
        userId: user.id,
        type: 'adjust',
        quantity: Math.abs(newStock - selectedSku.stock),
        stockBefore: selectedSku.stock,
        stockAfter: newStock,
        description: 'Điều chỉnh tồn kho thủ công',
        reference: `ADJ-${Date.now()}`
      };

      await skuService.adjustStock(payload, selectedSku.id);

      setSelectedSku({ ...selectedSku, stock: newStock });

      fetchLogsBySku(selectedSku.id);

      console.log('✔ Điều chỉnh tồn kho thành công!');
    } catch (error) {
      console.error('❌ Lỗi khi điều chỉnh:', error);
    }
  };

  useEffect(() => {
    fetchSkuData();
  }, []);

  // Phân trang
  const paginatedProducts = skuData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Danh sách sản phẩm
      </Typography>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              <TableCell>Thứ tự</TableCell>
              <TableCell>Ảnh</TableCell>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Mã SKU</TableCell>
              <TableCell>Giá Nhập</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts.map((sku, index) => (
              <TableRow
                key={sku.id}
                sx={{
                  '&:hover': { backgroundColor: '#f9f9f9' }
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                <TableCell sx={{ position: 'relative' }}>
                  <Avatar
                    variant="rounded"
                    src={sku.product?.thumbnail || '/placeholder.svg'}
                    alt={sku.product?.name || ''}
                    sx={{ width: 60, height: 60 }}
                  />
                </TableCell>
                <TableCell>{sku.product?.name}</TableCell>
                <TableCell>{sku.skuCode}</TableCell>
                <TableCell>{sku.originPrice?.toLocaleString('vi-VN')}₫</TableCell>
                <TableCell>
                  {sku.stock}
                </TableCell>

                <TableCell>{(() => {
                    const statusKey = getStockStatusKey(sku.stock);
                    return (
                      <Chip
                        icon={STOCK_STATUS[statusKey].icon}
                        label={STOCK_STATUS[statusKey].label}
                        color={STOCK_STATUS[statusKey].color}
                        size=''
                        variant="filled"
                        sx={{
                        fontSize: '12px',
                        padding: '2px 1px',
                        height: 'auto',
                        borderRadius: '12px',
                        lineHeight: 1.2,
                        fontWeight: 600
                         }}
                      />
                    );
                  })()}</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <IconButton
                      onClick={() => {
                        setSelectedSku(sku);
                        setDialogOpen(true);
                        fetchLogsBySku(sku.id);
                      }}
                      size="small"
                      color="primary"
                      title="Xem chi tiết"
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="secondary" title="Chỉnh sửa">
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" title="Xóa">
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={skuData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số dòng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} của ${count !== -1 ? count : `hơn ${to}`}`}
        />
      </TableContainer>

      {/* Dialog chi tiết */}
      <DialogDetails
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        skuItem={selectedSku}
        logsAction={logsAction}
        handleSubmitImport={handleSubmitImport}
        handleSubmitExport={handleSubmitExport}
        fetchLogsBySku={fetchLogsBySku}
      />
    </Box>
  );
}
