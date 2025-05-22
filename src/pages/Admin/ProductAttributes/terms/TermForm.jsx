import { useState } from 'react';

const TermForm = ({ onAdd, displayType }) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [count, setCount] = useState(0);
  const [color, setColor] = useState('#000000');
  const [image, setImage] = useState('');

  const handleSubmit = () => {
    if (!name || !slug) return alert('Thiếu tên hoặc slug');

    const term = {
      name,
      slug,
      description,
      count,
      ...(displayType === 'color' && { color }),
      ...(displayType === 'image' && { image }),
    };

    onAdd(term);
    setName('');
    setSlug('');
    setDescription('');
    setCount(0);
    setColor('#000000');
    setImage('');
  };

  return (
    <div className="bg-white border rounded shadow p-4">
      <h3 className="font-semibold mb-2">Thêm giá trị</h3>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tên"
        className="w-full border px-3 py-2 rounded mb-2"
      />
      <input
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        placeholder="Slug"
        className="w-full border px-3 py-2 rounded mb-2"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Mô tả"
        className="w-full border px-3 py-2 rounded mb-2"
      />
      <input
        type="number"
        value={count}
        onChange={(e) => setCount(+e.target.value)}
        placeholder="Lượt"
        className="w-full border px-3 py-2 rounded mb-2"
      />

      {displayType === 'color' && (
        <div className="flex items-center gap-2 mb-2">
          <label className="text-sm">Chọn màu:</label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </div>
      )}

      {displayType === 'image' && (
        <div className="mb-2">
          <label className="text-sm block mb-1">Ảnh:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onloadend = () => setImage(reader.result);
              reader.readAsDataURL(file);
            }}
          />
          {image && <img src={image} alt="preview" className="w-12 h-12 mt-2 object-cover rounded" />}
        </div>
      )}

      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
        Thêm
      </button>
    </div>
  );
};

export default TermForm;
