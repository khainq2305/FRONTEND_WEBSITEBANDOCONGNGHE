import { useState } from 'react';
import Tabs from './Tabs';
import SearchFilter from './SearchFilter';
import BulkActions from './BulkActions';
import AttributeTable from './AttributeTable';
import AttributeAddForm from './AttributeAddForm';

export default function ProductAttributes() {
  const [tab, setTab] = useState('visible'); // visible | hidden | trash
  const [selectedItems, setSelectedItems] = useState([]);
  const [data, setData] = useState([]);

  const handleAdd = (newAttr) => {
    setData(prev => [...prev, newAttr]);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Quản lý thuộc tính sản phẩm</h1>
      <Tabs tab={tab} setTab={setTab} />

      {/* Layout ngang: Form 40% - Table 60% */}
      <div className="mt-4 flex gap-6">
        {/* Left: Form thêm mới */}
        <div className="w-[40%]">
          <AttributeAddForm onAdd={handleAdd} />
        </div>

        {/* Right: Tìm kiếm + Table */}
        <div className="w-[60%] flex flex-col gap-4">
          <SearchFilter />
          <BulkActions tab={tab} selectedItems={selectedItems} />
          <AttributeTable
            tab={tab}
            data={data}
            setData={setData}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />
        </div>
      </div>
    </div>
  );
}
