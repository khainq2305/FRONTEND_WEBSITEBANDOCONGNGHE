import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Button, IconButton, Typography, TextField, LinearProgress, Card, Chip } from '@mui/material';
import {
  Close as CloseIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Inventory as InventoryIcon,
  History as HistoryIcon,
  Info as InfoIcon,
  AttachMoney as MoneyIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import LogsAction from './logsBySku';
import ImportStockDialog from '../Operation/importForm';
import ExportStockDialog from '../Operation/exportForm';

const DialogDetails = ({ open, onClose, skuItem, logsAction, handleSubmitImport, handleSubmitExport, fetchLogsBySku }) => {
  const [newStockQuantity, setNewStockQuantity] = useState('');

  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [inventoryCheckDialogOpen, setInventoryCheckDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  useEffect(() => {
    if (skuItem?.id) {
      fetchLogsBySku(skuItem.id);
    }
  }, [skuItem, importDialogOpen]);
  const handleUpdateStock = () => {
    console.log('Updating stock to:', newStockQuantity);
    // Add your stock update logic here
  };

  const handleImportStock = () => {
    console.log('Chưa làm dialog nhập kho!');
    setImportDialogOpen(true);
  };

  const handleExportStock = () => {
    setExportDialogOpen(true);
  };

  const handleInventoryCheck = () => {
    // setInventoryCheckDialogOpen(true)
  };

  const handleGenerateReport = () => {
    // setReportDialogOpen(true)
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
  };

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'low':
        return 'error';
      case 'normal':
        return 'success';
      case 'high':
        return 'warning';
      default:
        return 'primary';
    }
  };
  if (!skuItem) {
    return null; // Hoặc render loading / rỗng
  }
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        className: 'rounded-lg max-h-[95vh] min-h-[600px]'
      }}
    >
      <DialogTitle className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <InventoryIcon className="text-white text-xl" />
          </div>
          <Typography variant="h6" className="font-semibold text-gray-800">
            Chi Tiết Sản Phẩm
          </Typography>
        </div>
        <IconButton onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          overflowY: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }}
        className="p-6"
      >
        <div className="grid grid-cols-12 gap-6 h-full">
          <div className="col-span-3 space-y-4">
            <Card className="p-4">
              <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-4 relative">
                <img src={skuItem.product.thumbnail || '/placeholder.svg'} alt={skuItem.product.name} fill className="object-cover" />
                {skuItem.stock <= 10 && (
                  <div className="absolute top-2 left-2">
                    <Chip label="⚠ Sắp hết" size="small" className="bg-orange-100 text-orange-800 font-medium" />
                  </div>
                )}
              </div>

              <Typography variant="h6" className="font-bold text-gray-900 mb-2">
                {skuItem.product.name}
              </Typography>

              <div className="space-y-4 mt-2">
                <div className="flex justify-start items-center gap-0.5">
                  <InfoIcon size={10} className="text-gray-500 text-xs" />
                  <Typography variant="subtitle2" className="font-semibold">
                    Thông Tin Sản Phẩm
                  </Typography>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã SKU</span>
                    <span className="font-medium">{skuItem.skuCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Danh mục</span>
                    <span className="font-medium">{skuItem.product.category.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Giá Bán</span>
                    <span className="font-bold text-green-600">{formatCurrency(skuItem.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cập Nhật Cuối</span>
                    <span className="font-medium">{skuItem.updatedAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mô tả</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="col-span-4 space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUpIcon className="text-blue-600 text-lg" />
                <Typography variant="h6" className="font-semibold">
                  Quản Lý Tồn Kho
                </Typography>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Typography variant="h3" className="font-bold text-blue-600 mb-1">
                    {skuItem.stock}
                  </Typography>
                  <Typography variant="body2" className="text-blue-800">
                    Tồn Kho Hiện Tại
                  </Typography>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Typography variant="h3" className="font-bold text-orange-600 mb-1">
                    {/* { '20'}minimum */} {'20'}
                  </Typography>
                  <Typography variant="body2" className="text-orange-800">
                    Tồn Kho Tối Thiểu
                  </Typography>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <Typography variant="subtitle2" className="font-semibold">
                  Cập Nhật Tồn Kho
                </Typography>
                <div className="flex gap-2">
                  <TextField
                    placeholder="Nhập số lượng mới"
                    value={newStockQuantity}
                    onChange={(e) => setNewStockQuantity(e.target.value)}
                    size="small"
                    className="flex-1"
                    type="number"
                  />
                  <Button variant="contained" onClick={handleUpdateStock} className="bg-green-600 hover:bg-green-700 px-6">
                    Cập Nhật
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Mức Tồn Kho</span>
                  <span>Tối ưu: 20</span>
                </div>
                <LinearProgress
                  variant="determinate"
                  value={(skuItem?.currentStock / 20) * 100}
                  color={getStockStatusColor(skuItem?.status)}
                  className="h-2 rounded"
                />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <MoneyIcon className="text-green-600 text-lg" />
                <Typography variant="h6" className="font-semibold">
                  Phân Tích Giá Trị
                </Typography>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Giá Đơn Vị:</span>
                  <span className="font-medium">{formatCurrency(skuItem.originalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng Giá Trị:</span>
                  <span className="font-bold text-green-600">{formatCurrency(skuItem.originalPrice * skuItem.stock)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tại Mức Tối Thiểu:</span>
                  <span className="font-medium">{formatCurrency(skuItem.originalPrice * 10 )}</span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <SettingsIcon className="text-gray-600 text-lg" />
                <Typography variant="h6" className="font-semibold">
                  Thao Tác Nhanh
                </Typography>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outlined"
                  size="small"
                  className="text-xs hover:bg-blue-50 hover:border-blue-300"
                  onClick={handleImportStock}
                >
                  Nhập Kho
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  className="text-xs hover:bg-green-50 hover:border-green-300"
                  onClick={handleExportStock}
                >
                  Xuất Kho
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  className="text-xs hover:bg-purple-50 hover:border-purple-300"
                  onClick={handleInventoryCheck}
                >
                  Kiểm Kê
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  className="text-xs hover:bg-orange-50 hover:border-orange-300"
                  onClick={handleGenerateReport}
                >
                  Báo Cáo
                </Button>
              </div>
            </Card>
          </div>

          <div className="col-span-5">
            <LogsAction logsAction={logsAction} fetchLogsBySku={fetchLogsBySku} skuId={skuItem.id} />
          </div>
        </div>
      </DialogContent>

      <ImportStockDialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        skuName={skuItem.skuCode}
        currentStock={skuItem.stock}
        onSubmit={(data) => {
          handleSubmitImport(data);
        }}
      />

      <ExportStockDialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        skuName={skuItem.skuCode}
        currentStock={skuItem.stock}
        onSubmit={(data) => {
          handleSubmitExport(data);
        }}
      />
      {/*
      <InventoryCheckDialog
        open={inventoryCheckDialogOpen}
        onClose={() => setInventoryCheckDialogOpen(false)}
        productName={product.name}
        currentStock={product.currentStock}
      />

      <ReportDialog open={reportDialogOpen} onClose={() => setReportDialogOpen(false)} productName={product.name} /> */}
    </Dialog>
  );
};

export default DialogDetails;
