const TermRow = ({ term, checked, onToggle, displayType }) => {
  return (
    <tr className="border-t">
      <td className="p-2 text-center">
        <input type="checkbox" checked={checked} onChange={onToggle} />
      </td>
      <td className="p-2 flex items-center gap-2">
        {displayType === 'color' && term.color && (
          <span className="w-4 h-4 rounded-full border" style={{ backgroundColor: term.color }}></span>
        )}
        {displayType === 'image' && term.image && (
          <img src={term.image} alt="term" className="w-6 h-6 object-cover rounded" />
        )}
        {term.name}
      </td>
      <td className="p-2 ">{term.slug}</td>
      <td className="p-2">{term.description}</td>
      <td className="p-2 text-center">{term.count || 0}</td>
    </tr>
  );
};

export default TermRow;
