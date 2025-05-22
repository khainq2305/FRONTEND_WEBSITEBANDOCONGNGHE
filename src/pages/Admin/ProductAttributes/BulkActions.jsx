export default function BulkActions({ tab, selectedItems }) {
  const handleApply = () => {
    if (tab === 'trash') {
      // xử lý khôi phục hoặc xóa vĩnh viễn
    } else {
      // xử lý ẩn/hiện/xóa
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
      <select className="border rounded px-3 py-2 text-sm w-full sm:w-auto">
        {tab === 'trash' ? (
          <>
            <option>Khôi phục</option>
            <option>Xóa vĩnh viễn</option>
          </>
        ) : (
          <>
            <option>Ẩn</option>
            <option>Hiển thị</option>
            <option>Đưa vào thùng rác</option>
          </>
        )}
      </select>
      <button
        onClick={handleApply}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm w-full sm:w-auto"
      >
        Áp dụng
      </button>
    </div>
  );
}
