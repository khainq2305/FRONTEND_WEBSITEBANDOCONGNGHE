export default function SearchFilter() {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <input
        type="text"
        placeholder="Tìm theo tên thuộc tính..."
        className="border px-4 py-2 rounded-md w-full sm:w-1/3"
      />
      {/* Thêm các bộ lọc nâng cao nếu cần */}
    </div>
  )
}
