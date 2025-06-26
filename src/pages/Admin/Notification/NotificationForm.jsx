import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { TextField, Checkbox, FormControlLabel, FormControl, InputLabel, Select, MenuItem, Chip, FormGroup, Switch } from '@mui/material';
import TinyEditor from '@/components/Admin/TinyEditor';
import { notificationService } from '@/services/admin/notificationService';

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
    userIds: [],
    type: 'system',
    isActive: true,
    startAt: '',
    imageFile: null,
    slug: ''
  });

  const [preview, setPreview] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Tiêu đề không được để trống';
    if (!form.type) newErrors.type = 'Vui lòng chọn loại thông báo';
    if (form.type === 'order') {
      if (!form.targetId || isNaN(Number(form.targetId)) || Number(form.targetId) <= 0)
        newErrors.targetId = 'ID mục tiêu phải là số nguyên dương';
      if (!form.link.trim()) {
        newErrors.link = 'Link điều hướng không được để trống';
      } else if (!/^https:\/\/.+/.test(form.link.trim()) && !/^\/[a-zA-Z0-9]/.test(form.link.trim())) {
        newErrors.link = 'Link không hợp lệ! Phải bắt đầu bằng https:// hoặc /';
      }
    }
    if (!form.startAt) newErrors.startAt = 'Vui lòng chọn ngày bắt đầu hiển thị';
    if (!editing && !form.imageFile && !preview) newErrors.image = 'Vui lòng chọn ảnh';
    if (!form.isGlobal && (!Array.isArray(form.userIds) || form.userIds.length === 0)) {
      newErrors.userIds = 'Vui lòng chọn ít nhất 1 người dùng';
    }
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
    accept: { 'image/jpeg': ['.jpeg', '.jpg'], 'image/png': ['.png'] },
    multiple: false
  });

  useEffect(() => {
    if (editing) {
      const formattedStartAt = editing.startAt ? new Date(editing.startAt).toISOString().slice(0, 16) : '';
      const newForm = {
        ...editing,
        startAt: formattedStartAt,
        slug: editing.slug || '',
        userIds: [],
        imageFile: null
      };
      if (!editing.isGlobal && editing.id) {
        notificationService
          .getUsersByNotification(editing.id)
          .then((res) => {
            const users = Array.isArray(res.data) ? res.data : [];
            newForm.userIds = users.map((u) => u.userId || u.User?.id).filter(Boolean);
            setForm(newForm);
          })
          .catch(() => setForm(newForm));
      } else {
        setForm(newForm);
      }
      setPreview(editing.imageUrl || '');
    } else {
      const draft = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          const { preview, ...rest } = parsed;
          setForm({
            ...rest,
            userIds: Array.isArray(rest.userIds) ? rest.userIds : []
          });
          if (preview) setPreview(preview);
        } catch {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      }
    }
  }, [editing]);

  useEffect(() => {
    if (!form.isGlobal) {
      notificationService
        .getUsers()
        .then((userList) => setUsers(Array.isArray(userList) ? userList : []))
        .catch(() => setUsers([]));
    }
  }, [form.isGlobal]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'type' ? { targetType: value } : {})
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
        } else if (key === 'userIds') {
          formData.append('userIds', JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      if (editing) {
        await notificationService.update(editing.id, formData);
      } else {
        await notificationService.create(formData);
      }

      localStorage.removeItem(LOCAL_STORAGE_KEY);
      onSuccess();
    } catch (error) {
      const errMsg = error?.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
      setErrors({ title: errMsg }); // gán lỗi vào trường title đã tồn tại
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6" encType="multipart/form-data">
      {/* <h1 className="text-3xl font-semibold text-gray-800">{editing ? 'Sửa thông báo' : 'Thêm thông báo mới'}</h1> */}

      <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-6">
        {/* Left column: Nội dung */}
        <div className="space-y-6">
          <TextField
            label="Tiêu đề"
            name="title"
            value={form.title}
            onChange={handleChange}
            fullWidth
            error={!!errors.title}
            helperText={errors.title}
          />

          <div>
            <TinyEditor value={form.message} onChange={(val) => setForm((prev) => ({ ...prev, message: val }))} height={350} />
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
          </div>
        </div>

        {/* Right column: Sidebar */}
        <div className="flex flex-col gap-4">
          <TextField
            label="Ngày bắt đầu hiển thị"
            name="startAt"
            type="datetime-local"
            value={form.startAt}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={!!errors.startAt}
            helperText={errors.startAt}
          />

          <FormGroup className="border border-gray-300 rounded-md px-4 py-2">
            <FormControlLabel
              control={<Switch checked={form.isGlobal} onChange={handleChange} name="isGlobal" color="primary" />}
              label="Gửi tất cả người dùng"
            />
          </FormGroup>

          <FormGroup className="border border-gray-300 rounded-md px-4 py-2">
            <FormControlLabel
              control={<Switch checked={form.isActive} onChange={handleChange} name="isActive" color="primary" />}
              label="Hiển thị thông báo"
            />
          </FormGroup>

          {!form.isGlobal && (
            <FormControl fullWidth error={!!errors.userIds}>
              <InputLabel id="user-select-label">Chọn người dùng</InputLabel>
              <Select
                labelId="user-select-label"
                multiple
                value={Array.isArray(form.userIds) ? form.userIds : []}
                name="userIds"
                onChange={(e) => setForm((prev) => ({ ...prev, userIds: e.target.value }))}
                renderValue={(selected) => (
                  <div className="flex flex-wrap gap-1">
                    {users
                      .filter((u) => selected.includes(u.id))
                      .map((u) => (
                        <Chip key={u.id} label={u.fullName} />
                      ))}
                  </div>
                )}
              >
                {users.length > 0 ? (
                  users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.fullName} ({user.email})
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Không có user nào</MenuItem>
                )}
              </Select>
              {errors.userIds && <p className="text-red-500 text-sm mt-1">{errors.userIds}</p>}
            </FormControl>
          )}
          <FormControl fullWidth error={!!errors.type}>
            <InputLabel>Loại thông báo</InputLabel>
            <Select name="type" value={form.type} onChange={handleChange}>
              <MenuItem value="system">System</MenuItem>
              <MenuItem value="order">Order</MenuItem>
            </Select>
          </FormControl>
          {form.type === 'order' && (
            <>
              <TextField
                label="Target ID"
                name="targetId"
                type="number"
                value={form.targetId}
                onChange={handleChange}
                fullWidth
                error={!!errors.targetId}
                helperText={errors.targetId}
              />
              <TextField
                label="Link điều hướng"
                name="link"
                value={form.link}
                onChange={handleChange}
                fullWidth
                error={!!errors.link}
                helperText={errors.link}
              />
            </>
          )}

          <div
            {...getRootProps()}
            className={`w-full border-[2px] border-dashed rounded-md px-3 py-4 text-center cursor-pointer
    ${isDragActive ? 'bg-blue-50 border-blue-500' : 'border-blue-400 bg-white'}
    hover:border-blue-500 hover:bg-blue-50 transition-all`}
          >
            <input {...getInputProps()} />
            {preview ? (
              <img src={preview} alt="preview" className="max-h-32 mx-auto object-contain" />
            ) : (
              <p className="text-gray-700 text-sm">Kéo ảnh vào hoặc nhấp để chọn ảnh</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6">
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-2 rounded text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? 'Đang gửi...' : editing ? 'Cập nhật' : 'Tạo mới'}
        </button>
        <button type="button" onClick={onCancel} className="px-6 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300">
          Trở về
        </button>
      </div>
    </form>
  );
};

export default NotificationForm;
