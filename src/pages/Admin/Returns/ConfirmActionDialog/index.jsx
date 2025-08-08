// src/components/common/ConfirmActionDialog.jsx
import Swal from 'sweetalert2';

/**
 * Hiển thị hộp thoại xác nhận tuỳ ý (duyệt, hoàn tiền, nhận hàng...)
 * @param {string} actionLabel - hành động hiển thị (ví dụ: 'duyệt', 'hoàn tiền')
 * @param {string} itemLabel - nội dung đối tượng (ví dụ: 'yêu cầu trả hàng này')
 * @param {string} confirmText - text nút xác nhận (mặc định: 'Đồng ý')
 * @param {string} description - dòng mô tả (mặc định: 'Bạn có chắc chắn?')
 * @returns {Promise<boolean>}
 */
export const confirmAction = async (
  actionLabel = 'thực hiện',
  itemLabel = 'hành động này',
  confirmText = 'Đồng ý',
  description = 'Bạn có chắc chắn muốn tiếp tục?'
) => {
  const result = await Swal.fire({
    title: `Bạn có chắc chắn muốn ${actionLabel} ${itemLabel}?`,
    text: description,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#aaa',
    confirmButtonText: confirmText,
    cancelButtonText: 'Hủy'
  });

  return result.isConfirmed;
};
