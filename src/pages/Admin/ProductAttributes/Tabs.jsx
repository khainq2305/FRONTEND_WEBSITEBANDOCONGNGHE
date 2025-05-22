export default function Tabs({ tab, setTab }) {
  const tabs = [
    { key: 'visible', label: 'Hiển thị', count: 12 },
    { key: 'hidden', label: 'Ẩn', count: 4 },
    { key: 'trash', label: 'Thùng rác', count: 2 },
  ]

  return (
    <div className="flex gap-6 border-b">
      {tabs.map(t => (
        <button
          key={t.key}
          onClick={() => setTab(t.key)}
          className={`pb-2 border-b-2 ${
            tab === t.key ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-600'
          }`}
        >
          {t.label} ({t.count})
        </button>
      ))}
    </div>
  )
}
