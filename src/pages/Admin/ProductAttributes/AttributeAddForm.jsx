import { useState } from 'react';

const AttributeAddForm = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [archived, setArchived] = useState(false);
  const [displayType, setDisplayType] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  const handleSubmit = () => {
    if (!name || !code) return alert("Vui lòng nhập đầy đủ thông tin");

    onAdd({
      id: Date.now(),
      name,
      code,
      archived,
      displayType,
      sortOrder,
      terms: [],
    });

    // Reset form
    setName('');
    setCode('');
    setArchived(false);
    setDisplayType('');
    setSortOrder('');
  };

  return (
    <div className="w-full bg-white p-6 rounded shadow-md">
      <h2 className="text-lg font-semibold mb-4">Thêm thuộc tính mới</h2>
      <div className="space-y-4">
        <div>
          <p>Thêm thuộc tính mới
            Thuộc tính cho phép bạn xác định dữ liệu sản phẩm bổ sung, chẳng hạn như kích thước hoặc màu sắc. Bạn có thể sử dụng các thuộc tính này trong thanh bên cửa hàng bằng cách sử dụng tiện ích "điều hướng theo lớp".</p><br />
          <label className="block text-sm font-medium">Tên thuộc tính</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-3 py-1.5 mt-1" />
          <p>Tên cho thuộc tính (hiển thị ở giao diện).</p>
        </div>
        <div>
          <label className="block text-sm font-medium">Mã</label>
          <input value={code} onChange={(e) => setCode(e.target.value)} className="w-full border rounded px-3 py-1.5 mt-1" />
          <p>Slug/tham chiếu duy nhất cho thuộc tính; không được dài quá 28 ký tự.</p>
        </div>
        <div className="items-center gap-2">
          <input type="checkbox" checked={archived} onChange={(e) => setArchived(e.target.checked)} />
          <label className="text-sm">Bật lưu trữ ?</label>
          <p>Bật tùy chọn này nếu bạn muốn thuộc tính này có trong kho lưu trữ sản phẩm trong cửa hàng của bạn.</p>
        </div>
        <div>
          <label className="block text-sm font-medium">Kiểu hiển thị</label>
          <select value={displayType} onChange={(e) => setDisplayType(e.target.value)} className="w-full border rounded px-3 py-1.5 mt-1">
            <option value="">Chọn kiểu hiển thị</option>
            <option value="color">Màu sắc</option>
            <option value="image">Hình ảnh</option>
            <option value="button">Cái nút</option>
            <option value="radio">Radio</option>
          </select>
          <p>Xác định cách hiển thị giá trị của thuộc tính này.</p>
        </div>
        <div>
          <label className="block text-sm font-medium">Thứ tự sắp xếp mặc định</label>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="w-full border rounded px-3 py-1.5 mt-1">
            <option value="">Chọn thứ tự</option>
            <option value="custom">Đặt hàng theo yêu cầu</option>
            <option value="name">Tên</option>
            <option value="name_num">Tên số</option>
            <option value="sku">Mã số học kỳ</option>
          </select>
          <p>Xác định thứ tự sắp xếp của các thuật ngữ trên các trang sản phẩm của cửa hàng frontend. Nếu sử dụng thứ tự tùy chỉnh, bạn có thể kéo và thả các thuật ngữ trong thuộc tính này.</p>
        </div>
        <div className="flex justify-start pt-3">
          <button onClick={handleSubmit} className="px-4 py-1.5 bg-blue-600 text-white rounded">Thêm thuộc tính</button>
        </div>
      </div>
    </div>
  );
};

export default AttributeAddForm;
