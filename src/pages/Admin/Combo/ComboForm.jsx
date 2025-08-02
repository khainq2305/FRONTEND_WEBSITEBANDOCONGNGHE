import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, FormControlLabel, Switch, Box, Button, Typography, Paper, IconButton, Chip, Tooltip } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { comboService } from '../../../services/admin/comboService';
import { toast } from 'react-toastify';
import TinyEditor from '../../../components/admin/TinyEditor';
import ProductSelectModal from '@/components/admin/ProductSelectModal';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import slugify from 'slugify';
import { useMemo } from 'react';

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

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setForm((prev) => ({ ...prev, thumbnail: file }));
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
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

  const handleSelectSkus = async (selectedSkuObjects) => {
    const newSkus = selectedSkuObjects
      .filter((sku) => !form.comboSkus.some((item) => item.skuId === sku.id))
      .map((sku) => {
        const price = parseFloat(sku.price || 0);
        console.log('🎯 SKU selected:', sku.id, 'name:', sku.name, 'price:', price);
        return {
          skuId: sku.id,
          quantity: 1,
          price,
          stock: sku.stock || 0
        };
      });

    const updatedComboSkus = [...form.comboSkus, ...newSkus];

    // ✅ Tính originalPrice
    const calculatedOriginalPrice = updatedComboSkus.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

    setForm((prev) => ({
      ...prev,
      comboSkus: updatedComboSkus,
      originalPrice: calculatedOriginalPrice
    }));
  };

  const handleRemoveSku = (skuId) => {
    setForm((prev) => ({
      ...prev,
      comboSkus: prev.comboSkus.filter((item) => item.skuId !== skuId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!form.name || !form.price) {
      toast.error('Vui lòng nhập tên và giá combo');
      return;
    }
    if (form.comboSkus.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 sản phẩm cho combo');
      return;
    }

    const hasInvalidQty = form.comboSkus.some((item) => !item.quantity || item.quantity < 1);
    if (hasInvalidQty) {
      toast.error('Số lượng mỗi SKU phải >= 1');
      return;
    }
    const comboQty = parseInt(form.quantity, 10) || 1;

    const insufficientSku = form.comboSkus.find((item) => {
      const requiredQty = comboQty * (item.quantity || 1);
      return item.stock < requiredQty;
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
      toast.error('Đã xảy ra lỗi khi lưu combo');
      console.error('[❌ COMBO SUBMIT ERROR]', err);
    } finally {
      setLoading(false);
    }
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

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6" encType="multipart/form-data">
      <Typography variant="h5" fontWeight={600}>
        {isEdit ? 'Cập nhật combo' : 'Tạo combo mới'}
      </Typography>

      <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-6">
        {/* Left */}
        <div className="space-y-6">
          <TextField label="Tên combo" name="name" value={form.name} onChange={handleChange} fullWidth required />

          <div>
            <Typography className="mb-1 mt-1 font-medium text-sm text-gray-700">Mô tả</Typography>
            <TinyEditor value={form.description} onChange={(val) => setForm((prev) => ({ ...prev, description: val }))} height={430} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <TextField label="Chiều rộng (cm)" name="width" type="number" value={form.width} onChange={handleChange} fullWidth />
            <TextField label="Chiều dài (cm)" name="length" type="number" value={form.length} onChange={handleChange} fullWidth />
            <TextField label="Chiều cao (cm)" name="height" type="number" value={form.height} onChange={handleChange} fullWidth />
            <TextField label="Cân nặng (g)" name="weight" type="number" value={form.weight} onChange={handleChange} fullWidth />
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-4">
          <TextField label="Giá combo" name="price" type="number" value={form.price} onChange={handleChange} fullWidth required />
          {discountInfo && (
            <Typography variant="caption" sx={{ color: 'green', mt: -1 }}>
              💥 Giảm: <strong>{discountInfo.percent}%</strong> – Tiết kiệm: <strong>{discountInfo.saved}₫</strong>
            </Typography>
          )}

          <TextField
            label="Giá gốc (originalPrice)"
            name="originalPrice"
            type="number"
            value={form.originalPrice}
            InputProps={{
              readOnly: true
            }}
            fullWidth
            disabled={form.comboSkus.length === 0}
          />

          <TextField
            label="Số lượng combo (quantity)"
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            fullWidth
          />
          <TextField label="Đã bán (sold)" name="sold" type="number" value={form.sold} onChange={handleChange} disabled fullWidth />

          <TextField
            label="Ngày bắt đầu (startAt)"
            name="startAt"
            type="datetime-local"
            value={form.startAt}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="expiredAt"
            type="datetime-local"
            label="Hạn sử dụng (expiredAt)"
            value={form.expiredAt}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <FormControlLabel control={<Switch name="isActive" checked={form.isActive} onChange={handleChange} />} label="Kích hoạt" />
          <FormControlLabel
            control={<Switch name="isFeatured" checked={form.isFeatured} onChange={handleChange} />}
            label="Combo nổi bật"
          />

          <div
            {...getRootProps()}
            className={`w-full border-[2px] border-dashed rounded-md px-3 py-10 text-center cursor-pointer
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
      {/* ✅ Sản phẩm trong combo */}
      <div className="space-y-3 pt-2">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold">Sản phẩm trong combo</h4>
          <Tooltip title="Thêm SKU">
            <IconButton onClick={() => setModalOpen(true)} size="small" color="primary">
              <AddIcon />
            </IconButton>
          </Tooltip>
        </div>

        {form.comboSkus.length === 0 ? (
          <p className="text-sm text-gray-500">Chưa chọn sản phẩm</p>
        ) : (
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {form.comboSkus.map((item) => (
              <Paper
                key={item.skuId}
                elevation={1}
                className="flex items-center justify-between px-3 py-2 rounded-md border border-gray-200"
              >
                <div>
                  <div className="space-y-1">
                    <Typography variant="body2" fontWeight={500}>
                      SKU ID: {item.skuId}
                    </Typography>
                    <TextField
                      label="Số lượng"
                      type="number"
                      size="small"
                      value={item.quantity || 1}
                      onChange={(e) => {
                        let qty = parseInt(e.target.value, 10) || 1;

                        // Giới hạn tối đa theo tồn kho
                        if (item.stock && qty > item.stock) {
                          qty = item.stock;
                        }

                        const updatedSkus = form.comboSkus.map((sku) => (sku.skuId === item.skuId ? { ...sku, quantity: qty } : sku));

                        const updatedOriginalPrice = updatedSkus.reduce((sum, sku) => sum + (sku.price || 0) * sku.quantity, 0);

                        setForm((prev) => ({
                          ...prev,
                          comboSkus: updatedSkus,
                          originalPrice: updatedOriginalPrice
                        }));
                      }}
                      inputProps={{ min: 1, max: item.stock || undefined }}
                      sx={{ width: '100px' }}
                    />

                    <Typography variant="caption" sx={{ color: 'gray' }}>
                      Tồn kho: {item.stock ?? '—'}
                    </Typography>
                  </div>

                  {/* Nếu bạn có thêm thông tin SKU (tên, ảnh), có thể thêm ở đây */}
                </div>
                <IconButton size="small" color="error" onClick={() => handleRemoveSku(item.skuId)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Paper>
            ))}
          </Box>
        )}
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
        selectedSkus={form.comboSkus.map((item) => item.skuId)}
      />
    </form>
  );
};

export default ComboForm;
