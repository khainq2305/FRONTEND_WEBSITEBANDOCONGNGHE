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
  Checkbox
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import DialogDetails from './DialogDetails';
import useAuthStore from '@/stores/AuthStore';
import { CircleCheckBig, CircleX, TriangleAlert } from 'lucide-react';
import { skuService } from '@/services/admin/skuService';
import MUIPagination from '@/components/common/Pagination';
import Filter from './Filter';

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
  const [skuData, setSkuData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSku, setSelectedSku] = useState(null);
  const [logsAction, setLogsAction] = useState([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchSkuData = async () => {
    const { search, category, status } = filters;
    const params = {
      search: search || undefined,
      categoryId: category || undefined,
      status: status || undefined,
      page: currentPage,
      limit: pageSize
    };

    try {
      const res = await skuService.getAll(params);
      setSkuData(res.data.data);
      setTotal(res.data.pagination.totalItems);
    } catch (error) {
      console.error('❌ Lỗi lấy danh sách SKU:', error);
    }
  };

  const fetchLogsBySku = async (id, type = 'all') => {
    if (!id) return;
    try {
      const res = await skuService.logBySkuId(id, type);
      setLogsAction(res.data.data);
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
      const newStock = payload.stockAfter;
      setSelectedSku({ ...selectedSku, stock: newStock });
      fetchLogsBySku(selectedSku.id);
      fetchSkuData();
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
      fetchSkuData();
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
      fetchSkuData();
    } catch (error) {
      console.error('❌ Lỗi khi điều chỉnh:', error);
    }
  };

  useEffect(() => {
    fetchSkuData();
  }, [filters, currentPage]);

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Danh sách sản phẩm
      </Typography>

      <Filter
        search={filters.search}
        onSearchChange={(value) => {
          setFilters((prev) => ({ ...prev, search: value }));
          setCurrentPage(1);
        }}
      />

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
            {skuData.length > 0 ? (
              skuData.map((sku, index) => (
                <TableRow key={sku.id}>
                  <TableCell padding="checkbox">
                    <Checkbox />
                  </TableCell>
                  <TableCell>{index + 1 + (currentPage - 1) * pageSize}</TableCell>
                  <TableCell>
                    <Avatar
                      variant="rounded"
                      src={sku.product?.thumbnail || '/placeholder.svg'}
                      alt={sku.product?.name || ''}
                      sx={{ width: 60, height: 60 }}
                    />
                  </TableCell>
                  <TableCell>{sku.product?.name}</TableCell>
                  <TableCell>{sku.skuCode}</TableCell>
                  <TableCell>{sku.originalPrice?.toLocaleString('vi-VN')}₫</TableCell>
                  <TableCell>{sku.stock}</TableCell>
                  <TableCell>
                    <Chip
                      icon={STOCK_STATUS[getStockStatusKey(sku.stock)].icon}
                      label={STOCK_STATUS[getStockStatusKey(sku.stock)].label}
                      color={STOCK_STATUS[getStockStatusKey(sku.stock)].color}
                      sx={{
                        fontSize: '12px',
                        padding: '2px 1px',
                        height: 'auto',
                        borderRadius: '12px',
                        lineHeight: 1.2,
                        fontWeight: 600
                      }}
                    />
                  </TableCell>
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  Không tìm thấy sản phẩm nào phù hợp.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {total > pageSize && (
        <MUIPagination
          currentPage={currentPage}
          totalItems={total}
          itemsPerPage={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}

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
