// src/components/common/ConfirmDeleteDialog.jsx
import Swal from 'sweetalert2';

/**
 * Hiển thị hộp thoại xác nhận tuỳ theo hành động: xoá, khôi phục, xoá vĩnh viễn, ...
 * @param {string} actionLabel - hành động sẽ hiển thị (ví dụ: 'xoá', 'khôi phục', 'xoá vĩnh viễn')
 * @param {string} itemLabel - nội dung (ví dụ: 'sản phẩm này')
 * @returns {Promise<boolean>} true nếu người dùng xác nhận
 */
export const confirmDelete = async (actionLabel = 'xoá', itemLabel = 'mục này') => {
  const result = await Swal.fire({
    title: `Bạn có chắc chắn muốn ${actionLabel} ${itemLabel}?`,
    text: 'Hành động này không thể hoàn tác.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Đồng ý',
    
    cancelButtonText: 'Hủy'
  });

  return result.isConfirmed;
};
