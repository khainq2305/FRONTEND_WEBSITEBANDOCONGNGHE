# Hệ thống Kiểm tra Quyền cho Button

## Tổng quan

Hệ thống này cung cấp các công cụ để kiểm tra quyền và tự động disable button khi user không có quyền thực hiện hành động.

## Các thành phần

### 1. ButtonStore (`src/stores/buttonStore.js`)
Store Zustand để quản lý việc kiểm tra quyền:

```javascript
import useButtonStore from '@/stores/buttonStore';

const { canPerformAction, isButtonDisabled } = useButtonStore();

// Kiểm tra quyền
const canCreate = canPerformAction('create', 'Product');

// Kiểm tra trạng thái disable
const isDisabled = isButtonDisabled('delete', 'User');
```

### 2. PermissionButton Component (`src/components/common/PermissionButton/index.jsx`)
Component wrapper cho Button với kiểm tra quyền tự động:

```jsx
import PermissionButton from '@/components/common/PermissionButton';

// Sử dụng cơ bản
<PermissionButton 
  action="create" 
  subject="Product"
  variant="contained"
  onClick={handleCreate}
>
  Tạo sản phẩm
</PermissionButton>

// Kiểm tra nhiều quyền (AND logic)
<PermissionButton 
  permissions={[
    { action: 'read', subject: 'Product' },
    { action: 'create', subject: 'Product' }
  ]}
  logic="AND"
  variant="contained"
  onClick={handleCreate}
>
  Tạo sản phẩm
</PermissionButton>

// Kiểm tra nhiều quyền (OR logic)
<PermissionButton 
  permissions={[
    { action: 'update', subject: 'Product' },
    { action: 'delete', subject: 'Product' }
  ]}
  logic="OR"
  variant="outlined"
  onClick={handleAction}
>
  Thao tác
</PermissionButton>
```

### 3. Custom Hooks (`src/hooks/usePermission.js`)
Các hook để kiểm tra quyền trong component:

```jsx
import { usePermission, useMultiplePermissions, usePermissionDisabled } from '@/hooks/usePermission';

function MyComponent() {
  // Kiểm tra một quyền
  const canCreateProduct = usePermission('create', 'Product');
  
  // Kiểm tra nhiều quyền (AND)
  const canManageProducts = useMultiplePermissions([
    { action: 'read', subject: 'Product' },
    { action: 'create', subject: 'Product' },
    { action: 'update', subject: 'Product' }
  ], 'AND');
  
  // Kiểm tra nhiều quyền (OR)
  const canViewOrEdit = useMultiplePermissions([
    { action: 'read', subject: 'Product' },
    { action: 'update', subject: 'Product' }
  ], 'OR');
  
  // Kiểm tra trạng thái disable
  const isDisabled = usePermissionDisabled('delete', 'User');
  
  return (
    <Button disabled={isDisabled}>
      Xóa người dùng
    </Button>
  );
}
```

## Cách sử dụng

### 1. Sử dụng PermissionButton (Khuyến nghị)

```jsx
import PermissionButton from '@/components/common/PermissionButton';

function ProductList() {
  const handleCreate = () => {
    // Logic tạo sản phẩm
  };
  
  const handleDelete = () => {
    // Logic xóa sản phẩm
  };
  
  return (
    <div>
      <PermissionButton 
        action="create" 
        subject="Product"
        variant="contained"
        color="primary"
        onClick={handleCreate}
        tooltip="Bạn cần quyền tạo sản phẩm"
      >
        Tạo sản phẩm mới
      </PermissionButton>
      
      <PermissionButton 
        action="delete" 
        subject="Product"
        variant="outlined"
        color="error"
        onClick={handleDelete}
      >
        Xóa sản phẩm
      </PermissionButton>
    </div>
  );
}
```

### 2. Sử dụng Custom Hooks

```jsx
import { usePermission, usePermissionDisabled } from '@/hooks/usePermission';
import { Button } from '@mui/material';

function ProductActions() {
  const canCreate = usePermission('create', 'Product');
  const canDelete = usePermission('delete', 'Product');
  const isDeleteDisabled = usePermissionDisabled('delete', 'Product');
  
  return (
    <div>
      {canCreate && (
        <Button variant="contained" onClick={handleCreate}>
          Tạo sản phẩm
        </Button>
      )}
      
      <Button 
        variant="outlined" 
        color="error"
        disabled={isDeleteDisabled}
        onClick={handleDelete}
        title={isDeleteDisabled ? 'Bạn không có quyền xóa' : ''}
      >
        Xóa sản phẩm
      </Button>
    </div>
  );
}
```

### 3. Sử dụng ButtonStore trực tiếp

```jsx
import useButtonStore from '@/stores/buttonStore';
import { Button } from '@mui/material';

function ProductActions() {
  const { canPerformAction, isButtonDisabled } = useButtonStore();
  
  const canCreate = canPerformAction('create', 'Product');
  const isDeleteDisabled = isButtonDisabled('delete', 'Product');
  
  return (
    <div>
      {canCreate && (
        <Button variant="contained" onClick={handleCreate}>
          Tạo sản phẩm
        </Button>
      )}
      
      <Button 
        variant="outlined" 
        color="error"
        disabled={isDeleteDisabled}
        onClick={handleDelete}
      >
        Xóa sản phẩm
      </Button>
    </div>
  );
}
```

## Các action và subject phổ biến

### Actions:
- `read` - Xem
- `create` - Tạo mới
- `update` - Cập nhật
- `delete` - Xóa
- `manage` - Quản lý (bao gồm tất cả quyền)
- `export` - Xuất dữ liệu
- `approve` - Phê duyệt

### Subjects:
- `Product` - Sản phẩm
- `User` - Người dùng
- `Order` - Đơn hàng
- `Category` - Danh mục
- `Brand` - Thương hiệu
- `Voucher` - Voucher
- `Notification` - Thông báo
- `Slide` - Slide/Banner

## Lưu ý

1. **Ability phải được load**: Hệ thống sẽ tự động disable button nếu ability chưa được load (user chưa đăng nhập hoặc đang loading).

2. **Tooltip tự động**: PermissionButton sẽ hiển thị tooltip mặc định khi không có quyền.

3. **Performance**: Các hook sử dụng `useMemo` để tối ưu performance.

4. **Flexible**: Có thể kiểm tra một hoặc nhiều quyền cùng lúc với logic AND/OR. 