import { getActionBgColor, getActionTextColor } from "utils/logColors";

const DetailModal = ({ log, onClose }) => {
  if (!log) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 transition-all duration-300">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl p-6 relative border border-gray-100 animate-fade-in scale-100 transition-transform duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-red-500 text-2xl font-light transition-colors duration-200"
        >
          &times;
        </button>

        {/* Header */}
        <div className="mb-5 border-b border-gray-200 pb-3">
          <h2 className="text-xl font-semibold text-gray-800 tracking-tight">
            Chi tiết lịch sử #{log.id}
          </h2>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
          <div>
            <span className="font-medium">👤 Người thao tác:</span> {log.actor_name}
          </div>
          <div>
            <span className="font-medium">📦 Module:</span> {log.module}
          </div>
          <div>
            <span className="font-medium">⚙️ Hành động:</span>{" "}
            <span
              className={`capitalize text-xs  px-2 py-1 rounded-md 
                ${getActionBgColor(log.action)} ${getActionTextColor(log.action)}
              `}
            >
              {log.action}
            </span>
          </div>
          <div>
            <span className="font-medium">🕒 Thời gian:</span>{" "}
            {new Date(log.createdAt).toLocaleString(undefined, {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        {/* JSON View */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-600 mb-1">📝 Dữ liệu cũ</h4>
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-xs max-h-72 overflow-auto whitespace-pre-wrap font-mono transition-all duration-300">
              {JSON.stringify(log.old_data || {}, null, 2)}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-600 mb-1">🆕 Dữ liệu mới</h4>
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-xs max-h-72 overflow-auto whitespace-pre-wrap font-mono transition-all duration-300">
              {JSON.stringify(log.new_data || {}, null, 2)}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-md bg-indigo-500 text-white hover:bg-indigo-600 transition-all duration-200 shadow-sm"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
