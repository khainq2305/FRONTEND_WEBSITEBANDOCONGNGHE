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
export const confirmReturn = async (refundTargetText = 'Ví CyBerZone của bạn') => {
  const result = await Swal.fire({
    title: 'Xác nhận gửi yêu cầu trả hàng',
    html: `
      <div style="text-align:left">
        <p><strong>Nơi hoàn tiền:</strong> ${refundTargetText}</p>
        <p style="margin-top:8px">• Yêu cầu trả hàng sẽ được gửi đến bộ phận xử lý.</p>
        <p>• <strong style="color:#d33">Lưu ý:</strong> Sau khi trả hàng, <strong>mã giảm giá (voucher)</strong> đã dùng <strong>không được hoàn lại</strong>.</p>
      </div>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Đồng ý gửi',
    cancelButtonText: 'Hủy',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    reverseButtons: true,
  });
  return result.isConfirmed;
};
