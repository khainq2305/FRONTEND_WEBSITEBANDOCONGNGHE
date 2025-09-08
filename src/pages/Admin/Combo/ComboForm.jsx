import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, FormControlLabel, Switch, Box, Button, Typography, Paper, IconButton, Chip, Tooltip } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { comboService } from '../../../services/admin/comboService';
import { toast } from 'react-toastify';
import AddIcon from '@mui/icons-material/Add';
import ProductSelectModal from '../../../components/Admin/ProductSelectModal';
import { useFormContext } from 'react-hook-form';
import { Stack } from '@mui/material';
import { formatCurrencyVND } from '../../../utils/formatCurrency';
import Breadcrumb from '../../../components/common/Breadcrumb'; // 👈 import breadcrumb
import DeleteIcon from '@mui/icons-material/Delete';
import slugify from 'slugify';
import { useMemo } from 'react';
import TinyEditor from '../../../components/Admin/TinyEditor';

const ComboForm = ({ isEdit = false, initialData = {} }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: initialData.name || '',
    price: initialData.price || '',
    originalPrice: initialData.originalPrice || '',
    expiredAt: initialData.expiredAt || '',
    weight: initialData.weight || '',
    width: initialData.width || '',
    height: initialData.height || '',
    length: initialData.length || '',
    description: initialData.description || '',
    isActive: initialData.isActive ?? true,
    isFeatured: initialData.isFeatured ?? false,
    thumbnail: null,
    slug: initialData.slug || '',
    quantity: initialData.quantity || '',
    startAt: initialData.startAt || '',
    sold: initialData.sold || '',
    comboSkus: initialData.comboSkus || [] // ⬅️ Thêm comboSkus vào form
  });

  const [preview, setPreview] = useState(initialData.thumbnail || '');
  const [loading, setLoading] = useState(false);
  const [manualSlug, setManualSlug] = useState(false);
  const [errors, setErrors] = useState({});
  const [modalSelectedSkus, setModalSelectedSkus] = useState([]);
  const [category, setCategory] = useState('ALL'); // filter theo category

  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    if (initialData && isEdit) {
      setForm({
        name: initialData.name || '',
        price: initialData.price || '',
        originalPrice: initialData.originalPrice || '',
        expiredAt: initialData.expiredAt || '',
        weight: initialData.weight || '',
        width: initialData.width || '',
        height: initialData.height || '',
        length: initialData.length || '',
        description: initialData.description || '',
        isActive: initialData.isActive ?? true,
        isFeatured: initialData.isFeatured ?? false,
        thumbnail: null, // reset lại file để tránh lỗi formData
        slug: initialData.slug || '',
        quantity: initialData.quantity || '',
        startAt: initialData.startAt || '',
        sold: initialData.sold || '',
        comboSkus: initialData.comboSkus || []
      });

      setPreview(initialData.thumbnail || '');
    }
  }, [initialData, isEdit]);
const handleRemoveThumbnail = (e) => {
  e.stopPropagation();              // ⛔️ đừng mở file picker khi bấm xoá
  setPreview('');
  setForm((prev) => ({ ...prev, thumbnail: null }));
  setErrors((prev) => ({ ...prev, thumbnail: '' }));
};

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setForm((prev) => ({ ...prev, thumbnail: file }));

      // 👉 XÓA lỗi nếu có
      setErrors((prev) => ({ ...prev, thumbnail: undefined }));

      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // ❌ Xóa lỗi ngay khi người dùng nhập lại hợp lệ
    setErrors((prev) => ({
      ...prev,
      [name]: '' // hoặc undefined cũng được
    }));
  };
  const handleSlugChange = (e) => {
    setManualSlug(true);
    setForm((prev) => ({ ...prev, slug: e.target.value }));
  };

  useEffect(() => {
    if (!isEdit && form.name) {
      const newSlug = slugify(form.name, { lower: true, strict: true });
      setForm((prev) => ({ ...prev, slug: newSlug }));
    }
  }, [form.name]);

  // Thay thế hoàn toàn danh sách bằng những gì đang chọn ở modal
  const handleSelectSkus = (selectedSkuObjects = []) => {
    // Giữ lại quantity cũ nếu có
    const qtyMap = new Map(form.comboSkus.map((it) => [it.skuId, it.quantity || 1]));

    // Chuẩn hóa dữ liệu từ modal
    const mapped = selectedSkuObjects.map((sku) => {
      const id = sku.skuId ?? sku.id;
      return {
        skuId: id,
        productId: sku.productId,
        quantity: 1,
        price: Number(sku.price ?? 0),
        stock: sku.stock ?? 0,
        thumbnail: sku.thumbnail || '/placeholder.png',
        productName: sku.productName || sku.name || '',
        variants: sku.variants || []
      };
    });

    // De-dupe theo skuId
    const comboSkus = [];
    const seen = new Set();
    for (const it of mapped) {
      if (!seen.has(it.skuId)) {
        seen.add(it.skuId);
        comboSkus.push(it);
      }
    }

    // Tính lại tạm tính gốc
    const originalPrice = comboSkus.reduce((sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 1), 0);

    setForm((prev) => ({
      ...prev,
      comboSkus,
      originalPrice
    }));

    // Xóa lỗi nếu có, hoặc báo lỗi nếu rỗng
    setErrors((prev) => ({
      ...prev,
      comboSkus: comboSkus.length ? undefined : 'Vui lòng chọn ít nhất 1 sản phẩm cho combo'
    }));

    setModalOpen(false);
  };

  const handleRemoveSku = (skuId) => {
    const updated = form.comboSkus.filter((item) => item.skuId !== skuId);
    const originalPrice = updated.reduce((sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 1), 0);

    setForm((prev) => ({
      ...prev,
      comboSkus: updated,
      originalPrice
    }));

    setErrors((prev) => ({
      ...prev,
      comboSkus: updated.length ? undefined : 'Vui lòng chọn ít nhất 1 sản phẩm cho combo'
    }));
  };
  const getCategory = (sku) => sku?.product?.category?.name || sku?.product?.mainCategory?.name || sku?.categoryName || 'Khác';

  const getMaxComboQuantity = () => {
    if (form.comboSkus.length === 0) return 1;

    return form.comboSkus.reduce((min, sku) => {
      if (!sku.quantity || sku.quantity < 1) return min;
      const possible = Math.floor(sku.stock / sku.quantity);
      return Math.min(min, possible);
    }, Infinity);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    const newErrors = {};
    if (!form.name?.trim()) newErrors.name = 'Tên combo không được để trống';
    if (!form.thumbnail && !preview) {
      newErrors.thumbnail = 'Vui lòng chọn ảnh đại diện cho combo';
    }

    if (!form.startAt) newErrors.startAt = 'Vui lòng chọn ngày bắt đầu hiển thị';
    if (!form.expiredAt) {
      newErrors.expiredAt = 'Vui lòng chọn ngày kết thúc';
    } else {
      const start = new Date(form.startAt);
      const end = new Date(form.expiredAt);

      if (end <= start) {
        newErrors.expiredAt = 'Ngày kết thúc phải sau ngày bắt đầu';
      }
    }

    if (form.comboSkus.length === 0) newErrors.comboSkus = 'Vui lòng chọn ít nhất 1 sản phẩm cho combo';
    if (form.comboSkus.length > 0) {
      if (form.price === '' || form.price === null) {
        newErrors.price = 'Giá combo không được để trống';
      } else if (Number(form.price) <= 0) {
        newErrors.price = 'Giá combo phải lớn hơn 0';
      } else if (Number(form.price) > Number(form.originalPrice)) {
        newErrors.price = 'Giá combo phải nhỏ hơn giá gốc';
      }

      if (form.quantity === '' || form.quantity === null) {
        newErrors.quantity = 'Số lượng combo không được để trống';
      } else if (Number(form.quantity) <= 0) {
        newErrors.quantity = 'Số lượng combo phải lớn hơn 0';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    const hasInvalidQty = form.comboSkus.some((item) => !item.quantity || item.quantity < 1);
    if (hasInvalidQty) {
      toast.error('Số lượng mỗi SKU phải >= 1');
      return;
    }
    const comboQty = parseInt(form.quantity, 10) || 1;

    const insufficientSku = form.comboSkus.find((item) => {
      const Qty = comboQty * (item.quantity || 1);
      return item.stock < Qty;
    });

    if (insufficientSku) {
      toast.error(`❌ SKU ID ${insufficientSku.skuId} chỉ còn ${insufficientSku.stock} sản phẩm, không đủ để tạo ${comboQty} combo.`);
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key === 'thumbnail') {
          if (value) formData.append('thumbnail', value);
        } else if (key === 'comboSkus') {
          formData.append('comboSkus', JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      // ✅ In toàn bộ giá trị của form để đảm bảo đầy đủ
      console.log('🧾 Form data (plain):', form);

      // ✅ In từng field trong FormData
      console.log('📦 FormData gửi lên:');
      for (let pair of formData.entries()) {
        console.log(`🔸 ${pair[0]}:`, pair[1]);
      }

      if (isEdit) {
        await comboService.update(initialData.slug, formData);
        toast.success('Cập nhật combo thành công');
      } else {
        await comboService.create(formData);
        toast.success('Tạo combo thành công');
      }

      navigate('/admin/combos');
    } catch (err) {
      if (err.response && Array.isArray(err.response.data?.errors)) {
        const backendErrors = err.response.data.errors;

        const newFieldErrors = {};
        backendErrors.forEach((e) => {
          newFieldErrors[e.field] = e.message;
          toast.error(e.message); // Hiển thị toast nếu muốn
        });

        setErrors((prev) => ({ ...prev, ...newFieldErrors }));
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      }
    }
    setLoading(false);
  };
  const discountInfo = useMemo(() => {
    const p = parseFloat(form.price || 0);
    const o = parseFloat(form.originalPrice || 0);
    console.log('🎯 p =', p, 'o =', o);

    if (!p || !o || p >= o) return null;

    const percent = Math.round(((o - p) / o) * 100);
    const saved = o - p;

    return {
      percent,
      saved: saved.toLocaleString('vi-VN')
    };
  }, [form.price, form.originalPrice]);

  // ✅ Đặt log ở đây, SAU khi discountInfo được gán
  console.log('💡 discountInfo:', discountInfo);

  // Chuẩn hóa tiếng Việt để bắt biến thể "Màu sắc"
  const vnNormalize = (s) =>
    (s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  const isColorVariant = (name) => {
    const n = vnNormalize(name);
    return n.includes('mau') || n.includes('màu') || n.includes('color');
  };

  // Nhóm các SKU theo sản phẩm (ưu tiên productId nếu có, fallback productName)
  const groupedByProduct = React.useMemo(() => {
    const map = new Map();
    for (const it of form.comboSkus || []) {
      const key = it.productId || it.productName; // nếu chưa có productId thì nhóm theo tên
      if (!map.has(key)) {
        map.set(key, {
          key,
          productName: it.productName || 'Sản phẩm',
          thumbnail: it.thumbnail,
          items: []
        });
      }
      map.get(key).items.push(it);
    }
    return Array.from(map.values());
  }, [form.comboSkus]);

  return (
    <>
    <Breadcrumb
    items={[
      { label: 'Trang chủ', href: '/admin' },
      { label: 'Quản lý Combo', href: '/admin/combos' },
      { label: isEdit ? 'Cập nhật Combo' : 'Tạo Combo mới' }
    ]}
  />
    
   <Box sx={{ border: '1px solid #ddd', borderRadius: 2, p: 3, boxShadow: 1, backgroundColor: '#fff', mt: 2 }}>
    
     <form onSubmit={handleSubmit} className="w-full space-y-6"  encType="multipart/form-data">
      <Typography variant="h5" fontWeight={600}>
        {isEdit ? 'Cập nhật combo' : 'Tạo combo mới'}
      </Typography>

      <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-6 mt-3">
        {/* Left */}
        <div className="space-y-6 mb-2">
        <TextField
  label="Tên combo"
  name="name"
  value={form.name}
  onChange={handleChange}
  fullWidth
  error={Boolean(errors.name)}
  helperText={errors.name}
  sx={{ mb: 2 }}        // 👈 thêm dòng này
/>


          <div>
            <Typography className="mb-1 mt-3 font-medium text-sm text-gray-700">Mô tả</Typography>
            <TinyEditor value={form.description} onChange={(val) => setForm((prev) => ({ ...prev, description: val }))} height={250} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <TextField label="Chiều rộng (cm)" name="width" type="number" value={form.width} onChange={handleChange} fullWidth />
            <TextField label="Chiều dài (cm)" name="length" type="number" value={form.length} onChange={handleChange} fullWidth />
            <TextField label="Chiều cao (cm)" name="height" type="number" value={form.height} onChange={handleChange} fullWidth />
            <TextField label="Cân nặng (g)" name="weight" type="number" value={form.weight} onChange={handleChange} fullWidth />
          </div>
          {/* ✅ Sản phẩm trong combo */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Sản phẩm trong combo</h4>

              {form.comboSkus.length > 0 && (
                <Tooltip title="Thêm SKU">
                  <IconButton
                    onClick={() => {
                      setModalSelectedSkus(form.comboSkus.map((item) => item.skuId));
                      setModalOpen(true);
                    }}
                    size="small"
                    color="primary"
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              )}
            </div>

            {errors.comboSkus && (
              <Typography variant="caption" className="text-red-500 ml-1">
                {errors.comboSkus}
              </Typography>
            )}
            {form.comboSkus.length === 0 ? (
              <Box
                className={`flex flex-col items-center justify-center border border-dashed rounded-md py-8 bg-gray-50 text-gray-500 cursor-pointer transition-all hover:border-blue-500 hover:bg-blue-50 ${
                  errors.comboSkus ? 'border-red-500' : 'border-gray-300'
                }`}
                onClick={() => {
                  const selected = form.comboSkus.map((item) => item.skuId);
                  setModalSelectedSkus(selected);
                  setModalOpen(true);
                }}
              >
                <AddIcon fontSize="large" color="primary" />
                <Typography variant="body2" mt={1}>
                  Bạn chưa chọn sản phẩm cho combo
                </Typography>
              </Box>
            ) : (
              <Box className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {form.comboSkus.map((item) => (
                  <Paper
                    key={item.skuId}
                    elevation={0} // ✅ tắt shadow nếu không muốn đổ bóng
                    className="flex w-full items-center gap-4 p-3 border border-gray-200 rounded-xl hover:shadow-sm transition"
                  >
                    {/* Ảnh sản phẩm */}
                    <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.thumbnail || '/placeholder.png'}
                        alt={item.productName || 'product'}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Nội dung */}
                    <div className="flex-1 space-y-1">
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography variant="caption" color="text.secondary">
                          Mã SKU:
                        </Typography>
                        <Typography variant="caption" fontWeight={600}>
                          {item.skuId}
                        </Typography>
                      </Stack>

                      <Typography variant="body2" className="line-clamp-2 text-gray-800">
                        {item.productName}
                      </Typography>
                      {item.variants?.length > 0 && (
                        <Box mt={0.5}>
                          {item.variants.map((v, idx) => (
                            <Chip key={idx} label={`${v.name}: ${v.value}`} size="small" sx={{ mr: 0.5, mb: 0.5, fontSize: '11px' }} />
                          ))}
                        </Box>
                      )}

                      <Typography variant="body2" fontWeight={700} className="text-red-600">
                        {formatCurrencyVND(item.price)}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        Tồn kho: {item.stock}
                      </Typography>
                    </div>

                    {/* Xoá */}
                    <div className="flex flex-col items-center gap-1">
                      <Tooltip title="Xoá sản phẩm khỏi combo">
                        <IconButton size="small" color="error" onClick={() => handleRemoveSku(item.skuId)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </Paper>
                ))}
              </Box>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-4">
          {/* Dropzone cao hơn */}
<div
  {...getRootProps()}
  className={`w-full border-[2px] border-dashed rounded-md text-center cursor-pointer transition-all
    ${isDragActive ? 'bg-blue-50 border-blue-500' : errors.thumbnail ? 'border-red-500 bg-red-50' : 'border-blue-400 bg-white'}
    hover:border-blue-500 hover:bg-blue-50`}
  style={{
    minHeight: 150,           // 👈 tăng chiều cao ô kéo ảnh
    padding: 16,
    display: 'flex',
        backgroundColor: '#F5F5F5', // 👈 nền xám
    alignItems: 'center',
    justifyContent: 'center'
  }}
>
  <input {...getInputProps()} />
  <p className="text-gray-700 text-sm">Kéo ảnh vào hoặc nhấp để chọn ảnh</p>
</div>

{/* Preview full width = đúng bằng ô kéo ảnh (w-full) */}
{preview && (
  <div className="relative mt-3 w-full">
    <img
      src={preview}
      alt="preview"
      className="w-full max-h-40 object-contain rounded-md border"  // 👈 w-full để ngang bằng dropzone
    />
    <IconButton
      size="small"
      color="error"
      onClick={(e) => {
        e.stopPropagation();
        setPreview('');
        setForm((prev) => ({ ...prev, thumbnail: null }));
      }}
      className="!absolute top-1 right-1 bg-white shadow"
      aria-label="Xoá ảnh"
    >
      <DeleteIcon fontSize="small" />
    </IconButton>
  </div>
)}

          {errors.thumbnail && (
            <Typography variant="caption" color="error" sx={{ mt: 1 }}>
              {errors.thumbnail}
            </Typography>
          )}

          <TextField
            label="Giá"
            name="price"
            type="text"
            value={form.price ? formatCurrencyVND(form.price) : ''}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, '');
              setForm((prev) => ({ ...prev, price: raw }));
            }}
            fullWidth
            error={Boolean(errors.price)}
            helperText={errors.price}
            disabled={form.comboSkus.length === 0}
          />

          {discountInfo && (
            <Typography variant="caption" sx={{ color: 'green', mt: -1 }}>
               Giảm: <strong>{discountInfo.percent}%</strong> – Tiết kiệm: {formatCurrencyVND(form.originalPrice - form.price)}
            </Typography>
          )}

          <TextField
            label="Giá gốc"
            name="originalPrice"
            type="text"
            value={form.originalPrice ? formatCurrencyVND(form.originalPrice) : ''}
            InputProps={{ readOnly: true }}
            fullWidth
            disabled={form.comboSkus.length === 0}
          />

          <TextField
            label="Số lượng"
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={(e) => {
              let val = parseInt(e.target.value, 10) || 1;
              const maxQty = getMaxComboQuantity();
              if (val > maxQty) val = maxQty;
              if (val < 1) val = 1;

              setForm((prev) => ({ ...prev, quantity: val }));
              setErrors((prev) => ({ ...prev, quantity: '' }));
            }}
            disabled={form.comboSkus.length === 0} // 👈 ✅ khóa input nếu chưa chọn sp
            error={!!errors.quantity}
            helperText={
              errors.quantity ? (
                <span style={{ color: '#d32f2f' }}>{errors.quantity}</span>
              ) : form.comboSkus.length > 0 ? (
                <span style={{ color: '#6c757d' }}>
                  Tối đa <strong>{getMaxComboQuantity()}</strong> combo
                </span>
              ) : (
                <span style={{ color: '#0288d1', fontWeight: 500 }}>"Vui lòng chọn sản phẩm trước"</span>
              )
            }
          />

          {/* <TextField label="Đã bán (sold)" name="sold" type="number" value={form.sold} onChange={handleChange} disabled fullWidth /> */}

          <TextField
            label="Ngày bắt đầu (startAt)"
            name="startAt"
            type="datetime-local"
            value={form.startAt}
            onChange={handleChange}
            fullWidth
            error={Boolean(errors.startAt)}
            helperText={errors.startAt}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            name="expiredAt"
            type="datetime-local"
            label="Hạn sử dụng"
            value={form.expiredAt}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={Boolean(errors.expiredAt)}
            helperText={errors.expiredAt}
          />
          <Paper
            variant="outlined"
            sx={{
              px: 2,
              py: 1,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Typography fontSize={14}>Kích hoạt</Typography>
            <Switch name="isActive" checked={form.isActive} onChange={handleChange} color="primary" />
          </Paper>
          {/* <Paper
            variant="outlined"
            sx={{
              px: 2,
              py: 1,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Typography fontSize={14}>Combo nổi bật</Typography>
            <Switch name="isFeatured" checked={form.isFeatured} onChange={handleChange} color="primary" />
          </Paper> */}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6">
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-2 rounded text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Tạo mới'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/admin/combos')}
          className="px-6 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
        >
          Trở về
        </button>
      </div>

      {/* ✅ Modal chọn SKU */}
      <ProductSelectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleSelectSkus}
        selectedSkus={modalSelectedSkus} // 👈 THÊM DÒNG NÀY
      />
    </form>
   </Box>
   </>
  );
};

export default ComboForm;
