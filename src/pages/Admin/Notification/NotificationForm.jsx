import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { notificationService } from '../../../services/admin/notificationService';

const LOCAL_STORAGE_KEY = 'notificationFormDraft';

const NotificationForm = ({ editing, onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    title: '',
    message: '',
    imageUrl: '',
    link: '',
    targetType: 'system',
    targetId: '',
    isGlobal: true,
    type: 'system',
    isActive: true,
    imageFile: null
  });
  const [preview, setPreview] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Tiêu đề không được để trống';
    if (!form.message.trim()) newErrors.message = 'Nội dung không được để trống';
    if (!form.link.trim()) {
      newErrors.link = 'Link điều hướng không được để trống';
    } else if (!/^https:\/\/.+\..+/.test(form.link.trim())) {
      newErrors.link = 'Link không hợp lệ! Phải bắt đầu bằng https://';
    }
    if (!form.type) newErrors.type = 'Vui lòng chọn loại thông báo';
    if (!form.targetId || isNaN(Number(form.targetId)) || Number(form.targetId) <= 0)
      newErrors.targetId = 'ID mục tiêu phải là số nguyên dương';
    if (!editing && !form.imageFile && !preview) newErrors.image = 'Vui lòng chọn ảnh';
    return newErrors;
  };

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles?.length > 0) {
      const file = acceptedFiles[0];
      setForm((prev) => ({ ...prev, imageFile: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        if (!editing) {
          const currentDraft = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ ...currentDraft, preview: reader.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  useEffect(() => {
    if (editing) {
      setForm({ ...editing, imageFile: null });
      setPreview(editing.imageUrl || '');
    } else {
      const draft = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          const { preview, ...rest } = parsed;
          setForm(rest);
          if (preview) setPreview(preview);
        } catch {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      }
    }
  }, [editing]);

  useEffect(() => {
    if (!editing) {
      const { imageFile, ...formToSave } = form;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ ...formToSave, preview }));
    }
  }, [form, preview, editing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'imageFile') {
          if (value) formData.append('image', value);
        } else {
          formData.append(key, value);
        }
      });

      // ❗ Không truyền headers vì crud.js không hỗ trợ config
      if (editing) {
        await notificationService.update(editing.id, formData);
      } else {
        await notificationService.create(formData);
      }

      localStorage.removeItem(LOCAL_STORAGE_KEY);
      onSuccess();
    } catch (error) {
      console.error('❌ Lỗi khi gửi form:', error);
      alert(error.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white p-6 sm:p-8 border border-gray-200 space-y-6"
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          {editing ? '✏️ Sửa thông báo' : 'Thêm thông báo mới'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Tiêu đề</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 focus:outline-none"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Link điều hướng</label>
            <input
              name="link"
              value={form.link}
              onChange={handleChange}
              placeholder="https://example.com"
              className="w-full border border-gray-300 px-3 py-2 focus:outline-none"
            />
            {errors.link && <p className="text-red-500 text-sm mt-1">{errors.link}</p>}
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Nội dung</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 px-3 py-2 focus:outline-none"
            />
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Loại thông báo</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 focus:outline-none"
            >
              <option value="system">System</option>
              <option value="promotion">Promotion</option>
              <option value="order">Order</option>
              <option value="news">News</option>
            </select>
            {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Target Type</label>
            <select
              name="targetType"
              value={form.targetType}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 focus:outline-none"
            >
              <option value="system">System</option>
              <option value="promotion">Promotion</option>
              <option value="order">Order</option>
              <option value="news">News</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Target ID</label>
            <input
              type="number"
              name="targetId"
              value={form.targetId}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 focus:outline-none"
            />
            {errors.targetId && <p className="text-red-500 text-sm mt-1">{errors.targetId}</p>}
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" name="isGlobal" checked={form.isGlobal} onChange={handleChange} />
            <label className="text-sm">Gửi toàn bộ user</label>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
            <label className="text-sm">Hiển thị thông báo</label>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Ảnh thông báo (Kéo & thả hoặc click)</label>
            <div
              {...getRootProps()}
              className={`w-[200px] h-[200px] border border-dashed border-gray-300 flex items-center justify-center cursor-pointer ${
                isDragActive ? 'bg-blue-50 border-blue-400' : 'bg-white'
              }`}
            >
              <input {...getInputProps()} />
              {preview ? (
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <p className="text-gray-500 text-sm text-center px-2">Kéo & thả hoặc bấm để chọn ảnh</p>
              )}
            </div>
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? 'Đang gửi...' : editing ? 'Cập nhật' : 'Tạo mới'}
          </button>

          <button type="button" onClick={onCancel} className="px-6 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300">
            Trở về
          </button>
        </div>
      </form>
    </div>
  );
};

export default NotificationForm;
