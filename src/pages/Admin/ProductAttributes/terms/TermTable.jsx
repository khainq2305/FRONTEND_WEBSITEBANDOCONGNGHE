import TermRow from './TermRow';

const TermTable = ({ terms, tab, displayType, selectedItems, setSelectedItems }) => {
  const filtered = terms.filter(t => {
    if (tab === 'visible') return !t.status || t.status === 'visible';
    return t.status === tab;
  });

  const toggle = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-white border rounded shadow">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">
              <input
                type="checkbox"
                checked={selectedItems.length === filtered.length}
                onChange={(e) =>
                  setSelectedItems(e.target.checked ? filtered.map(t => t.id) : [])
                }
              />
            </th>
            <th className="p-2">Tên</th>
            <th className="p-2">Slug</th>
            <th className="p-2">Mô tả</th>
            <th className="p-2">Lượt</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((term) => (
            <TermRow
              key={term.id}
              term={term}
              displayType={displayType}
              checked={selectedItems.includes(term.id)}
              onToggle={() => toggle(term.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TermTable;
