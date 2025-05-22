import { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Typography,
  Button,
  MenuItem,
  Box
} from '@mui/material';
import ThumbnailUpload from '../ThumbnailUpload';
import MediaUpload from '../MediaUpload';
import TinyEditor from '../../../../components/Admin/TinyEditor';
import { variantService } from '../../../../services/admin/variantService';

const ProductForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    description: '',
    thumbnail: '',
    orderIndex: 0,
    isActive: true,
    hasVariants: false,
    categoryId: '',
    brandId: '',
    variants: [],
    skus: []
  });

  const [thumbnail, setThumbnail] = useState(null); // { file, url }
  const [media, setMedia] = useState([]);           // array of { file, url, type }
  const [availableVariants, setAvailableVariants] = useState([]);
  const [customVariants, setCustomVariants] = useState([]);

  useEffect(() => {
    if (formData.hasVariants) {
      variantService.getVariants().then(res => {
        setAvailableVariants(res.data);
      });
    }
  }, [formData.hasVariants]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSkuChange = (i, key, value) => {
    const updated = [...formData.skus];
    updated[i][key] = value;
    setFormData({ ...formData, skus: updated });
  };

  const addSku = () => {
    if (!formData.hasVariants && formData.skus.length >= 1) return;
    setFormData(prev => ({
      ...prev,
      skus: [
        ...prev.skus,
        {
          skuCode: '',
          originalPrice: '',
          price: '',
          stock: '',
          height: '',
          width: '',
          length: '',
          weight: '',
          mediaUrls: [''],
          variantValueIds: []
        }
      ]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    formData.variants = customVariants;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={4}>

        {/* Cột bên trái */}
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth required label="Tên sản phẩm"
            name="name" value={formData.name}
            onChange={handleChange} sx={{ mb: 2 }}
          />
          <TextField
            fullWidth label="Mô tả ngắn"
            name="shortDescription" value={formData.shortDescription}
            onChange={handleChange} sx={{ mb: 2 }}
          />

          <TinyEditor
            value={formData.description}
            onChange={(val) => setFormData(prev => ({ ...prev, description: val }))}
            height={300}
          />

          {/* ❌ CHỈ hiện nếu không có biến thể */}
          {!formData.hasVariants && (
            <Box mt={3}>
              <MediaUpload files={media} onChange={setMedia} />
            </Box>
          )}
        </Grid>

        {/* Cột bên phải */}
        <Grid item xs={12} md={4}>
          <ThumbnailUpload value={thumbnail} onChange={setThumbnail} />

          <TextField
            select fullWidth label="Danh mục"
            name="categoryId" value={formData.categoryId}
            onChange={handleChange} sx={{ mt: 3, mb: 2 }}
          >
            <MenuItem value={1}>Điện thoại</MenuItem>
            <MenuItem value={2}>Laptop</MenuItem>
          </TextField>

          <TextField
            select fullWidth label="Thương hiệu"
            name="brandId" value={formData.brandId}
            onChange={handleChange} sx={{ mb: 2 }}
          >
            <MenuItem value={1}>Apple</MenuItem>
            <MenuItem value={2}>Samsung</MenuItem>
          </TextField>

          <TextField
            fullWidth type="number" label="Thứ tự hiển thị"
            name="orderIndex" value={formData.orderIndex}
            onChange={handleChange} sx={{ mb: 2 }}
          />

          <TextField
            select fullWidth label="Trạng thái"
            name="isActive" value={formData.isActive ? '1' : '0'}
            onChange={(e) =>
              handleChange({
                target: { name: 'isActive', value: e.target.value === '1' }
              })
            }
            sx={{ mb: 2 }}
          >
            <MenuItem value="1">Hiển thị</MenuItem>
            <MenuItem value="0">Ẩn</MenuItem>
          </TextField>
        </Grid>

        {/* Dropdown "Có biến thể" */}
        <Grid item xs={12}>
          <TextField
            select fullWidth label="Có biến thể?"
            name="hasVariants" value={formData.hasVariants ? '1' : '0'}
            onChange={(e) =>
              handleChange({
                target: { name: 'hasVariants', value: e.target.value === '1' }
              })
            }
          >
            <MenuItem value="1">Có</MenuItem>
            <MenuItem value="0">Không</MenuItem>
          </TextField>
        </Grid>

        {/* Danh sách SKU */}
        <Grid item xs={12}>
          {(formData.hasVariants || formData.skus.length === 0) && (
            <Button onClick={addSku} variant="outlined" sx={{ mb: 2 }}>
              + Thêm SKU
            </Button>
          )}

          {formData.skus.map((sku, i) => (
            <Grid container spacing={2} key={i} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth label="SKU Code"
                  value={sku.skuCode}
                  onChange={(e) => handleSkuChange(i, 'skuCode', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth type="number" label="Giá gốc"
                  value={sku.originalPrice}
                  onChange={(e) => handleSkuChange(i, 'originalPrice', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth type="number" label="Giá bán"
                  value={sku.price}
                  onChange={(e) => handleSkuChange(i, 'price', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth type="number" label="Tồn kho"
                  value={sku.stock}
                  onChange={(e) => handleSkuChange(i, 'stock', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth type="number" label="Chiều rộng (cm)"
                  value={sku.width}
                  onChange={(e) => handleSkuChange(i, 'width', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth type="number" label="Chiều cao (cm)"
                  value={sku.height}
                  onChange={(e) => handleSkuChange(i, 'height', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth type="number" label="Chiều dài (cm)"
                  value={sku.length}
                  onChange={(e) => handleSkuChange(i, 'length', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth type="number" label="Khối lượng (kg)"
                  value={sku.weight}
                  onChange={(e) => handleSkuChange(i, 'weight', e.target.value)}
                />
              </Grid>

              {formData.hasVariants && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth label="Media URLs (cách nhau bằng dấu phẩy)"
                    value={sku.mediaUrls.join(',')}
                    onChange={(e) => handleSkuChange(i, 'mediaUrls', e.target.value.split(','))}
                  />
                </Grid>
              )}
            </Grid>
          ))}
        </Grid>

        <Grid item xs={12}>
          <Button type="submit" variant="contained">
            Lưu sản phẩm
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ProductForm;
