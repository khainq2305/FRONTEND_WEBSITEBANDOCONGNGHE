import { useState, useEffect } from 'react';

const AttributeEditModal = ({ visible, onClose, data, onSave }) => {
  const [form, setForm] = useState({
    id: null,
    name: '',
    code: '',
    archived: false,
    type: '',
    sortOrder: '',
  });

  useEffect(() => {
    if (data) {
      setForm({
        id: data.id || null,
        name: data.name || '',
        code: data.code || '',
        archived: data.archived || false,
        type: data.type || '',
        sortOrder: data.sortOrder || '',
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-30 z-50 flex items-start justify-center pt-20 overflow-auto">
      <div className="bg-white w-full max-w-xl rounded shadow-md p-8">
        <h2 className="text-xl font-semibold mb-6">Cập nhật thuộc tính sản phẩm</h2>
        <form onSubmit={handleSubmit} className="space-y-6 text-sm text-gray-800">

          {/* Name */}
          <div>
            <label className="block font-medium mb-1">Tên thuộc tính</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
             Tên cho thuộc tính (hiển thị ở giao diện).
            </p>
          </div>

          {/* Slug */}
          <div>
            <label className="block font-medium mb-1">Mã</label>
            <input
              type="text"
              name="code"
              value={form.code}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Slug/tham chiếu duy nhất cho thuộc tính; không được dài quá 28 ký tự.
            </p>
          </div>

          {/* Enable archives */}
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="archived"
                checked={form.archived}
                onChange={handleChange}
              />
              <span className="font-medium">Bật lưu trữ ?</span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Bật tùy chọn này nếu bạn muốn thuộc tính này có trong kho lưu trữ sản phẩm trong cửa hàng của bạn.
            </p>
          </div>

          {/* Type */}
          <div>
            <label className="block font-medium mb-1">Kiểu hiển thị</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Chọn kiểu hiển thị</option>
            <option value="color">Màu sắc</option>
            <option value="image">Hình ảnh</option>
            <option value="button">Cái nút</option>
            <option value="radio">Radio</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Xác định cách hiển thị giá trị của thuộc tính này.
            </p>
          </div>

          {/* Sort order */}
          <div>
            <label className="block font-medium mb-1">Thứ tự sắp xếp mặc định</label>
            <select
              name="sortOrder"
              value={form.sortOrder}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Chọn thứ tự</option>
              <option value="custom">Đặt hàng theo yêu cầu</option>
              <option value="name">Tên</option>
              <option value="name_num">Tên (số)</option>
              <option value="sku">Mã số học kỳ</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Xác định thứ tự sắp xếp của các thuật ngữ trên các trang sản phẩm của cửa hàng frontend. Nếu sử dụng thứ tự tùy chỉnh, bạn có thể kéo và thả các thuật ngữ trong thuộc tính này.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border text-gray-700 bg-gray-100 hover:bg-gray-200"
            >
              Quay lại
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {form.id ? 'Cập nhật' : 'Thêm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttributeEditModal;
