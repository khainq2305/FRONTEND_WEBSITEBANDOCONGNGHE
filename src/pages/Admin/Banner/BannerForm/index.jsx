// src/components/admin/BannerForm/BannerForm.jsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  CircularProgress,
  Grid,
  FormHelperText,
  Chip,
  OutlinedInput,
  Autocomplete
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { sliderService } from '../../../../services/admin/sliderService';
import { toast } from 'react-toastify';
import LoaderAdmin from '../../../../components/Admin/LoaderVip';
import Breadcrumb from '../../../../components/common/Breadcrumb';

const BANNER_TYPES = [
  { value: 'topbar', label: 'Banner Trên Đầu (Topbar)' },
  { value: 'slider-main', label: 'Slider Trang Chủ (Carousel)' },
  { value: 'slider-side', label: 'Banner Nhỏ Cạnh Slider' },
  { value: 'mid-poster', label: 'Banner Ở Giữa Trang' },
  { value: 'category-banner', label: 'Banner cho trang Danh mục cụ thể' },
  { value: 'product-banner', label: 'Banner cho trang Sản phẩm cụ thể' },
  { value: 'slider-footer', label: 'Banner Cuối Trang (Footer)' },
  { value: 'banner-left-right', label: 'Banner Hai Bên Trang' },
  { value: 'popup-banner', label: 'Banner Popup (Hiển thị nổi)' }
];

const imageSizeMap = {
  topbar: { width: 200, height: 40 },
  'slider-main': { width: 300, height: 120 },
  'slider-side': { width: 150, height: 150 },
  'mid-poster': { width: 200, height: 100 },
  'category-banner': { width: 300, height: 100 },
  'product-banner': { width: 300, height: 100 },
  'footer-banner': { width: 300, height: 80 }
};

const BannerForm = () => {
  const { slug } = useParams();
  const isEditing = Boolean(slug);
  const navigate = useNavigate();

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [title, setTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [type, setType] = useState('');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isActive, setIsActive] = useState(true);
  // Thay đổi từ giá trị đơn thành mảng
  const [categoryIds, setCategoryIds] = useState([]);
  const [productIds, setProductIds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [flatCategories, setFlatCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});


  useEffect(() => {
    const fetchSelectData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([sliderService.getCategoriesForSelect(), sliderService.getProductsForSelect()]);
        const nestedCats = catRes.data.data || [];
        setCategories(nestedCats);
        const flatten = (items, depth = 0) =>
          items.flatMap((item) => {
            const cur = { ...item, depth };
            return [cur, ...(item.children ? flatten(item.children, depth + 1) : [])];
          });
        setFlatCategories(flatten(nestedCats));
        setProducts(prodRes.data.data || []);
      } catch (error) {
        toast.error('Lỗi khi tải danh sách danh mục hoặc sản phẩm.');
      }
    };
    fetchSelectData();
  }, []);

  useEffect(() => {
    if (!isEditing) return;

    const fetchBannerById = async () => {
      try {
        setLoadingInit(true);
        const res = await sliderService.getById(slug);
        const b = res?.data?.data || {};

        setTitle(b.title ?? '');
        setLinkUrl(b.linkUrl ?? '');
        setAltText(b.altText ?? '');
        setType(b.type ?? '');
        setDisplayOrder(Number.isFinite(Number(b.displayOrder)) ? Number(b.displayOrder) : 1);
        setStartDate(b.startDate ? String(b.startDate).slice(0, 16) : '');
        setEndDate(b.endDate ? String(b.endDate).slice(0, 16) : '');
        setIsActive(Boolean(b.isActive));
        setImagePreviews(b.imageUrl ? [b.imageUrl] : []);


        let catIds = [];
        if (Array.isArray(b.categoryIds) && b.categoryIds.length) {
          catIds = b.categoryIds;
        } else if (Array.isArray(b.categories) && b.categories.length) {
          catIds = b.categories.map((c) => c.id);
        } else if (Array.isArray(b.Categories) && b.Categories.length) {
          catIds = b.Categories.map((c) => c.id);
        }
        setCategoryIds(catIds.map((n) => Number(n)).filter(Number.isFinite));


        let prodIds = [];
        if (Array.isArray(b.productIds) && b.productIds.length) {
          prodIds = b.productIds;
        } else if (Array.isArray(b.products) && b.products.length) {
          prodIds = b.products.map((p) => p.id);
        } else if (Array.isArray(b.Products) && b.Products.length) {
          prodIds = b.Products.map((p) => p.id);
        } else if (Array.isArray(b.items) && b.items.length) {
          prodIds = b.items.map((it) => it?.product?.id).filter((id) => id != null);
        }
        setProductIds(prodIds.map((n) => Number(n)).filter(Number.isFinite));
      } catch (err) {
        toast.error('Không tìm thấy banner để sửa.');
        navigate('/admin/banners');
      } finally {
        setLoadingInit(false);
      }
    };

    fetchBannerById();
  }, [slug, isEditing, navigate]);

  useEffect(() => {
    if (type === 'category-banner' && categoryIds.length > 0) {
      setLinkUrl(`/danh-muc?ids=${categoryIds.join(',')}`);
    } else if (type === 'product-banner' && productIds.length > 0) {
      setLinkUrl(`/san-pham?ids=${productIds.join(',')}`);
    } else if (type !== 'category-banner' && type !== 'product-banner') {
      setLinkUrl('');
    }
  }, [categoryIds, productIds, type]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImageFiles(files);
      setImagePreviews(files.map((file) => URL.createObjectURL(file)));
    }
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    setLinkUrl('');
    setCategoryIds([]);
    setProductIds([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});

    
    const missingErrors = {};
    if (!title.trim()) missingErrors.title = 'Vui lòng nhập tiêu đề.';
    if (!type) missingErrors.type = 'Vui lòng chọn loại banner.';
    if (!imageFiles.length && !isEditing) missingErrors.image = 'Vui lòng chọn ảnh banner.';

    if (type === 'category-banner' && categoryIds.length === 0) {
      missingErrors.categoryIds = 'Vui lòng chọn ít nhất một danh mục.';
    }
    if (type === 'product-banner' && productIds.length === 0) {
      missingErrors.productIds = 'Vui lòng chọn ít nhất một sản phẩm.';
    }

    if (Object.keys(missingErrors).length > 0) {
      setFieldErrors(missingErrors);
      toast.error('Vui lòng nhập đầy đủ thông tin bắt buộc!');
      setLoading(false);
      return;
    }

    
    const formData = new FormData();
    if (imageFiles.length > 0) formData.append('image', imageFiles[0]);
    formData.append('title', title);
    formData.append('linkUrl', linkUrl);
    formData.append('altText', altText);
    formData.append('type', type);
    formData.append('displayOrder', displayOrder);
    if (startDate) formData.append('startDate', startDate);
    if (endDate) formData.append('endDate', endDate);
    formData.append('isActive', isActive ? 'true' : 'false');

    
    if (type === 'category-banner') {
      formData.append('categoryIds', JSON.stringify(categoryIds));
    }
    if (type === 'product-banner') {
      formData.append('productIds', JSON.stringify(productIds));
    }

    
    try {
      if (isEditing) {
        await sliderService.update(slug, formData);
        toast.success('Cập nhật banner thành công!');
        setTimeout(() => navigate('/admin/banners'), 500);
      } else {
        await sliderService.create(formData);
        toast.success('Tạo banner thành công!');
        setTimeout(() => navigate('/admin/banners'), 500);
      }
    } catch (err) {
      const backendErrors = err?.response?.data?.errors || [];
      const mapped = {};
      if (backendErrors.length > 0) {
        backendErrors.forEach((err) => (mapped[err.field] = err.message));
      }
      setFieldErrors(mapped);
      toast.error(isEditing ? 'Cập nhật thất bại.' : 'Tạo mới thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const renderCategoryMenuItems = (items, depth = 0) => {
    return items.flatMap((item) => {
      const currentItem = (
        <MenuItem key={item.id} value={item.id} sx={{ pl: depth * 2 + 2 }}>
          {depth > 0 ? '├ ' : ''}
          {item.name}
        </MenuItem>
      );
      if (item.children && item.children.length > 0) {
        return [currentItem, ...renderCategoryMenuItems(item.children, depth + 1)];
      }
      return [currentItem];
    });
  };


  const renderMultiSelectValue = (selectedIds, allItems) => {
    const selectedNames = allItems.filter((item) => selectedIds.includes(item.id)).map((item) => item.name);
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {selectedNames.map((name) => (
          <Chip key={name} label={name} />
        ))}
      </Box>
    );
  };

  if (loading || (isEditing && loadingInit)) {
    return <LoaderAdmin fullscreen />;
  }

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Breadcrumb
          items={[
            { label: 'Trang chủ', href: '/admin' },
            { label: 'Quản lý banner', href: '/admin/banners' },
            { label: isEditing ? 'Chỉnh sửa' : 'Thêm mới' }
          ]}
        />
      </Box>
      <Paper sx={{ p: { xs: 2, sm: 3, md: 4, mt: 2 }, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" component="h1" fontWeight={600}>
          {isEditing ? 'Chỉnh sửa Banner' : 'Thêm mới Banner'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            {/* Cột Trái - Upload Ảnh */}
            <Grid item xs={12} md={5}>
              <FormControl fullWidth error={!!fieldErrors.image}>
                <InputLabel shrink htmlFor="banner-image-upload">
                  Ảnh Banner <span style={{ color: 'red' }}>*</span>
                </InputLabel>
                <Box
                  component="label"
                  htmlFor="banner-image-upload"
                  sx={{
                    mt: 3,
                    width: '100%',
                    height: 180,
                    border: '2px dashed',
                    borderColor: fieldErrors.image ? 'error.main' : 'grey.400',
                    borderRadius: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    bgcolor: 'grey.50',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'grey.100' }
                  }}
                >
                  <input id="banner-image-upload" type="file" accept="image/*" hidden onChange={handleImageChange} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Kéo thả hoặc chọn 1 ảnh
                  </Typography>
                </Box>
                {fieldErrors.image && <FormHelperText>{fieldErrors.image}</FormHelperText>}
                {imagePreviews.length > 0 && (
                  <Box mt={2}>
                    <Typography variant="subtitle2">Xem trước:</Typography>
                    <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                      {imagePreviews.map((src, idx) => {
                        const size = imageSizeMap[type] || { width: 120, height: 70 };
                        return (
                          <Box
                            key={idx}
                            sx={{ width: size.width, height: size.height, overflow: 'hidden', border: '1px solid #ddd', borderRadius: 1 }}
                          >
                            <img src={src} alt={`Preview ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={7}>
              <Grid container spacing={2.5}>
                <Grid item xs={12}>
                  <TextField
                    label={
                      <span>
                        Tiêu đề <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    error={!!fieldErrors.title}
                    helperText={fieldErrors.title}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!fieldErrors.type}>
                    <InputLabel id="type-label">
                      <span>
                        Loại Banner <span style={{ color: 'red' }}>*</span>
                      </span>
                    </InputLabel>
                    <Select
                      labelId="type-label"
                      value={type}
                      label={
                        <span>
                          Loại Banner <span style={{ color: 'red' }}>*</span>
                        </span>
                      }
                      onChange={(e) => handleTypeChange(e.target.value)}
                    >
                      {BANNER_TYPES.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.type && <FormHelperText>{fieldErrors.type}</FormHelperText>}
                  </FormControl>
                </Grid>

                {type && type !== 'category-banner' && type !== 'product-banner' && (
                  <Grid item xs={12}>
                    <TextField
                      label="Link URL (khi click)"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      fullWidth
                      error={!!fieldErrors.linkUrl}
                      helperText={fieldErrors.linkUrl || 'Nhập link nội bộ (vd: /flash-sale) hoặc link ngoài.'}
                    />
                  </Grid>
                )}

                {type === 'category-banner' && (
                  <Grid item xs={12}>
                    <FormControl fullWidth error={!!fieldErrors.categoryIds}>
                      <Autocomplete
                        multiple
                        options={flatCategories}
                        value={flatCategories.filter((c) => categoryIds.includes(c.id))}
                        onChange={(_, newVal) => setCategoryIds(newVal.map((c) => Number(c.id)))}
                        getOptionLabel={(opt) => opt?.name ?? ''}
                        isOptionEqualToValue={(o, v) => o.id === v.id}
                        filterSelectedOptions
                        disableCloseOnSelect
                        renderTags={() => null}
                        renderOption={(props, option) => (
                          <li {...props} style={{ paddingLeft: (option.depth ?? 0) * 16 + 12 }}>
                            {option.depth > 0 ? '├ ' : ''}
                            {option.name}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={
                              <span>
                                Gắn với Danh mục <span style={{ color: 'red' }}>*</span>
                              </span>
                            }
                            placeholder="Tìm danh mục…"
                          />
                        )}
                      />
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                        {flatCategories
                          .filter((c) => categoryIds.includes(c.id))
                          .map((item) => (
                            <Chip
                              key={item.id}
                              label={item.name}
                              onDelete={() => setCategoryIds((prev) => prev.filter((id) => id !== item.id))}
                            />
                          ))}
                      </Box>
                      {fieldErrors.categoryIds && <FormHelperText>{fieldErrors.categoryIds}</FormHelperText>}
                    </FormControl>
                  </Grid>
                )}

                {type === 'product-banner' && (
                  <Grid item xs={12}>
                    <FormControl fullWidth error={!!fieldErrors.productIds}>
                      <Autocomplete
                        multiple
                        options={products}
                        value={products.filter((p) => productIds.includes(p.id))}
                        onChange={(_, newVal) => setProductIds(newVal.map((p) => Number(p.id)))}
                        getOptionLabel={(opt) => opt?.name ?? ''}
                        isOptionEqualToValue={(o, v) => o.id === v.id}
                        filterSelectedOptions
                        disableCloseOnSelect
                        renderTags={() => null}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={
                              <span>
                                Gắn với Sản phẩm <span style={{ color: 'red' }}>*</span>
                              </span>
                            }
                            placeholder="Tìm sản phẩm…"
                          />
                        )}
                      />
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                        {products
                          .filter((p) => productIds.includes(p.id))
                          .map((item) => (
                            <Chip
                              key={item.id}
                              label={item.name}
                              onDelete={() => setProductIds((prev) => prev.filter((id) => id !== item.id))}
                            />
                          ))}
                      </Box>
                      {fieldErrors.productIds && <FormHelperText>{fieldErrors.productIds}</FormHelperText>}
                    </FormControl>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <TextField
                    label="Alt Text (mô tả ảnh, tốt cho SEO)"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    fullWidth
                    error={!!fieldErrors.altText}
                    helperText={fieldErrors.altText}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Thứ tự hiển thị"
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 1)}
                    fullWidth
                    error={!!fieldErrors.displayOrder}
                    helperText={fieldErrors.displayOrder}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />}
                    label={isActive ? 'Đang hoạt động' : 'Đang ẩn'}
                    sx={{ pt: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Ngày bắt đầu"
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    fullWidth
                    error={!!fieldErrors.startDate}
                    helperText={fieldErrors.startDate}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Ngày kết thúc"
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    fullWidth
                    error={!!fieldErrors.endDate}
                    helperText={fieldErrors.endDate}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
            <Button variant="outlined" onClick={() => navigate('/admin/banners')} disabled={loading}>
              Hủy
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Lưu lại'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </>
  );
};

export default BannerForm;
