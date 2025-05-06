// src/components/common/ConfirmDeleteDialog.jsx
import Swal from 'sweetalert2';

export const confirmDelete = async (itemName = 'mục này') => {
  const result = await Swal.fire({
    title: `Bạn có chắc chắn muốn xóa ${itemName}?`,
    text: 'Hành động này không thể hoàn tác.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy'
  });

  return result.isConfirmed;
};
