import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { toast } from "react-toastify";
import { orderService } from "../../../../services/client/orderService";
import Loader from "../../../../components/common/Loader"; 
import { AlertTriangle } from "lucide-react"; 

const reasons = [
  "Tôi muốn cập nhật địa chỉ/sđt nhận hàng",
  "Tôi muốn thêm/thay đổi Mã giảm giá",
  "Tôi muốn thay đổi sản phẩm (kích thước, màu sắc, số lượng…)",
  "Thủ tục thanh toán rắc rối",
  "Tôi tìm thấy chỗ mua khác tốt hơn (Rẻ hơn, uy tín hơn, giao nhanh hơn…)",
  "Tôi không có nhu cầu mua nữa",
  "Tôi không tìm thấy lý do hủy phù hợp",
];

export default function CancelOrderDialog({ open, onClose, orderId, orderCode, onSuccess }) {


  const [selectedReason, setSelectedReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason) {
      toast.warning("Vui lòng chọn lý do hủy đơn hàng");
      return;
    }
    setLoading(true);
    try {
      await orderService.cancelOrder(orderId, selectedReason);
      toast.success("Hủy đơn hàng thành công");
      onSuccess?.(); 
      onClose(); 
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
      toast.error(error.response?.data?.message || "Hủy đơn hàng thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSelectedReason("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-50">
      {/* Lớp nền mờ */}
     

      
<div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      {/* Dialog content */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <Dialog.Panel className="relative w-full max-w-md transform rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
          
     

         <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-gray-900 text-center mb-2">
  Lý do hủy đơn hàng #{orderCode}
</Dialog.Title>


          
          {/* Khung thông báo */}
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex">
                  <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                          Bạn có biết? Bạn có thể cập nhật thông tin nhận hàng cho đơn hàng (1 lần duy nhất). Nếu bạn xác nhận hủy, toàn bộ đơn hàng sẽ được hủy.
                      </p>
                  </div>
              </div>
          </div>
          
          {/* ✅✅✅ ĐÃ SỬA LỖI THANH CUỘN Ở ĐÂY ✅✅✅ */}
          <div className="mt-4 space-y-4">
            {reasons.map((reason, index) => (
              <label key={index} className="flex items-center text-sm text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="cancel-reason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={() => setSelectedReason(reason)}
                  className="form-radio-custom mr-3 flex-shrink-0"
                />
                <span>{reason}</span>
              </label>
            ))}
          </div>

          {/* Các nút bấm */}
          <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-2 space-y-reverse sm:space-y-0">
             <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="w-full sm:w-auto justify-center rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              KHÔNG PHẢI BÂY GIỜ
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full sm:w-auto justify-center rounded-md border border-transparent bg-red-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
        {loading ? 'ĐANG XỬ LÝ...' : 'HỦY ĐƠN HÀNG'}

            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}