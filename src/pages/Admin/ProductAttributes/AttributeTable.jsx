import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Edit, Settings, Trash } from 'lucide-react';
import AttributeEditModal from './AttributeEditModal';

const initialData = [
  {
    id: 1,
    name: 'Màu sắc',
    code: 'color',
    type: 'Màu sắc',
    sortOrder: 'đặt hàng theo yêu cầu',
    terms: ['#ff0000', '#00ff00', '#0000ff'],
  },
  {
    id: 2,
    name: 'Kích thước',
    code: 'size',
    type: 'cái nút',
    sortOrder: 'tên số',
    terms: ['S', 'M', 'L'],
  },
];

const AttributeTable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(initialData);
  const [selectedItems, setSelectedItems] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAttr, setEditingAttr] = useState(null);

  const isAllSelected = selectedItems.length === data.length;

  const toggleSelectAll = () => {
    setSelectedItems(isAllSelected ? [] : data.map((item) => item.id));
  };

  const toggleSelectOne = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleEdit = (attr) => {
    setEditingAttr(attr);
    setIsModalOpen(true);
    setDropdownOpen(null);
  };

  const handleEditTerms = (attr) => {
  
    navigate(`/admin/product-attributes/${attr.id}/terms`);
  };

  const handleSave = (updated) => {
    setData((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
    setIsModalOpen(false);
  };

  return (
    <div className="border border-gray-200 rounded shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr className="text-left text-sm font-semibold text-gray-600">
            <th className="px-4 py-3">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={toggleSelectAll}
              />
            </th>
            <th className="px-4 py-3">Tên</th>
            <th className="px-4 py-3">Mã</th>
            <th className="px-4 py-3">Kiểu</th>
            <th className="px-4 py-3">Đặt hàng theo</th>
            <th className="px-4 py-3">Điều khoản</th>
            <th className="px-4 py-3 text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-sm">
          {data.map((attr) => (
            <tr key={attr.id} className="hover:bg-gray-50">
              <td className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(attr.id)}
                  onChange={() => toggleSelectOne(attr.id)}
                />
              </td>
              <td className="px-4 py-2">{attr.name}</td>
              <td className="px-4 py-2">{attr.code}</td>
              <td className="px-4 py-2">{attr.type}</td>
              <td className="px-4 py-2">{attr.sortOrder}</td>
              <td className="px-4 py-2">
                <div className="flex flex-wrap gap-1">
                  {attr.terms?.map((t, i) => {
                    if (attr.code === 'color' || attr.type === 'Màu sắc') {
                      return (
                        <span
                          key={i}
                          className="w-5 h-5 rounded-full border border-gray-300"
                          style={{ backgroundColor: t }}
                          title={t}
                        />
                      );
                    }

                    if (attr.code === 'image' || attr.type === 'image') {
                      return (
                        <img
                          key={i}
                          src={t}
                          alt={`term-${i}`}
                          className="w-10 h-10 object-cover rounded border"
                        />
                      );
                    }

                    return (
                      <span
                        key={i}
                        className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs"
                      >
                        {t}
                      </span>
                    );
                  })}
                </div>
              </td>

              <td className="px-4 py-2 text-center relative">
                <button
                  className="p-1 hover:bg-gray-100 rounded"
                  onClick={() =>
                    setDropdownOpen(dropdownOpen === attr.id ? null : attr.id)
                  }
                >
                  <MoreVertical size={18} />
                </button>
                {dropdownOpen === attr.id && (
                  <div className="absolute right-4 mt-1 bg-white border rounded shadow w-36 z-10">
                    <button
                      onClick={() => handleEdit(attr)}
                      className="w-full flex items-center px-3 py-2 text-sm hover:bg-gray-100"
                    >
                      <Edit size={14} className="mr-2" />
                      Sửa
                    </button>
                    <button
                      onClick={() => handleEditTerms(attr)}
                      className="w-full flex items-center px-3 py-2 text-sm hover:bg-gray-100"
                    >
                      <Settings size={14} className="mr-2" />
                      Thuộc tính
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Bạn có chắc muốn xóa thuộc tính này?')) {
                          setData((prev) =>
                            prev.filter((item) => item.id !== attr.id)
                          );
                        }
                        setDropdownOpen(null);
                      }}
                      className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <Trash size={14} className="mr-2" />
                      Xóa
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AttributeEditModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={editingAttr}
        onSave={handleSave}
      />
    </div>
  );
};

export default AttributeTable;
