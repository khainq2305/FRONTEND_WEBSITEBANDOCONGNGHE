import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import PermissionButton from './index';
import { usePermission, usePermissionDisabled } from '@/hooks/usePermission';
import useButtonStore from '@/stores/buttonStore';

const PermissionExample = () => {
  // Sử dụng custom hooks
  const canCreateProduct = usePermission('create', 'Product');
  const canDeleteUser = usePermission('delete', 'User');
  const isUpdateDisabled = usePermissionDisabled('update', 'Order');
  
  // Sử dụng store trực tiếp
  const { canPerformAction, isButtonDisabled } = useButtonStore();
  const canManageProducts = canPerformAction('manage', 'Product');
  const isExportDisabled = isButtonDisabled('export', 'Product');

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Ví dụ sử dụng hệ thống kiểm tra quyền
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          1. Sử dụng PermissionButton Component
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <PermissionButton 
            action="create" 
            subject="Product"
            variant="contained"
            color="primary"
            onClick={() => alert('Tạo sản phẩm')}
            tooltip="Bạn cần quyền tạo sản phẩm"
          >
            Tạo sản phẩm
          </PermissionButton>

          <PermissionButton 
            action="delete" 
            subject="User"
            variant="outlined"
            color="error"
            onClick={() => alert('Xóa người dùng')}
          >
            Xóa người dùng
          </PermissionButton>

          <PermissionButton 
            permissions={[
              { action: 'read', subject: 'Product' },
              { action: 'update', subject: 'Product' }
            ]}
            logic="AND"
            variant="contained"
            color="secondary"
            onClick={() => alert('Quản lý sản phẩm')}
          >
            Quản lý sản phẩm
          </PermissionButton>

          <PermissionButton 
            permissions={[
              { action: 'read', subject: 'Order' },
              { action: 'update', subject: 'Order' },
              { action: 'delete', subject: 'Order' }
            ]}
            logic="OR"
            variant="outlined"
            color="warning"
            onClick={() => alert('Thao tác đơn hàng')}
          >
            Thao tác đơn hàng
          </PermissionButton>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          2. Sử dụng Custom Hooks
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {canCreateProduct && (
            <PermissionButton 
              variant="contained"
              color="success"
              onClick={() => alert('Tạo sản phẩm (hiển thị có điều kiện)')}
            >
              Tạo sản phẩm (Conditional)
            </PermissionButton>
          )}

          <PermissionButton 
            variant="outlined"
            color="error"
            disabled={isUpdateDisabled}
            onClick={() => alert('Cập nhật đơn hàng')}
            title={isUpdateDisabled ? 'Bạn không có quyền cập nhật đơn hàng' : ''}
          >
            Cập nhật đơn hàng
          </PermissionButton>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Trạng thái quyền:
          </Typography>
          <Typography variant="body2">
            • Có thể tạo sản phẩm: {canCreateProduct ? '✅' : '❌'}
          </Typography>
          <Typography variant="body2">
            • Có thể xóa người dùng: {canDeleteUser ? '✅' : '❌'}
          </Typography>
          <Typography variant="body2">
            • Cập nhật đơn hàng bị disable: {isUpdateDisabled ? '✅' : '❌'}
          </Typography>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          3. Sử dụng ButtonStore trực tiếp
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {canManageProducts && (
            <PermissionButton 
              variant="contained"
              color="info"
              onClick={() => alert('Quản lý toàn bộ sản phẩm')}
            >
              Quản lý sản phẩm (Manage)
            </PermissionButton>
          )}

          <PermissionButton 
            variant="outlined"
            color="warning"
            disabled={isExportDisabled}
            onClick={() => alert('Xuất dữ liệu sản phẩm')}
            title={isExportDisabled ? 'Bạn không có quyền xuất dữ liệu' : ''}
          >
            Xuất dữ liệu sản phẩm
          </PermissionButton>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Trạng thái quyền từ Store:
          </Typography>
          <Typography variant="body2">
            • Có thể quản lý sản phẩm: {canManageProducts ? '✅' : '❌'}
          </Typography>
          <Typography variant="body2">
            • Xuất dữ liệu bị disable: {isExportDisabled ? '✅' : '❌'}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default PermissionExample; 