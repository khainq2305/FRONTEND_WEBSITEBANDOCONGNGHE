import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Tabs from '../Tabs';
import BulkActions from '../BulkActions';
import TermForm from './TermForm';
import TermTable from './TermTable';

const TermPage = () => {
  const { id } = useParams();
  const [tab, setTab] = useState('visible');
  const [selectedItems, setSelectedItems] = useState([]);
  const [terms, setTerms] = useState([]);

  // Giả lập attribute theo id
  const attribute = {
    id,
    name: 'Màu sắc',
    displayType: 'color', // 'color', 'image', 'button', 'radio'
  };

  const handleAdd = (term) => {
    setTerms((prev) => [
      ...prev,
      { ...term, id: Date.now(), status: 'visible' }
    ]);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Thuộc tính: {attribute.name}</h2>
      <Tabs tab={tab} setTab={setTab} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <TermForm onAdd={handleAdd} displayType={attribute.displayType} />
        <div className="flex flex-col gap-3">
          <BulkActions tab={tab} selectedItems={selectedItems} />
          <TermTable
            tab={tab}
            terms={terms}
            displayType={attribute.displayType}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />
        </div>
      </div>
    </div>
  );
};

export default TermPage;
