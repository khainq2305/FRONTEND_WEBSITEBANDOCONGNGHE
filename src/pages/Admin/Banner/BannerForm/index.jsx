// src/components/admin/BannerForm/BannerForm.jsx

import React, { useState, useEffect, useRef } from 'react';
import {
    Box, Button, Paper, Typography, TextField, Select, MenuItem,
    FormControl, InputLabel, Switch, FormControlLabel, CircularProgress,
    Grid, FormHelperText
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
    'topbar': { width: 200, height: 40 },
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
    const [categoryId, setCategoryId] = useState('');
    const [productId, setProductId] = useState('');
    const [categories, setCategories] = useState([]);
    const [flatCategories, setFlatCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingInit, setLoadingInit] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    useEffect(() => {
        const fetchSelectData = async () => {
            try {
                const [catRes, prodRes] = await Promise.all([
                    sliderService.getCategoriesForSelect(),
                    sliderService.getProductsForSelect()
                ]);
                const nestedCats = catRes.data.data || [];
                setCategories(nestedCats);
                const flatten = (items) => items.flatMap(item => [item, ...(item.children ? flatten(item.children) : [])]);
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
                const b = res.data.data;
                setTitle(b.title || '');
                setLinkUrl(b.linkUrl || '');
                setAltText(b.altText || '');
                setType(b.type || '');
                setDisplayOrder(b.displayOrder || 1);
                setStartDate(b.startDate ? b.startDate.slice(0, 10) : '');
                setEndDate(b.endDate ? b.endDate.slice(0, 10) : '');
                setIsActive(b.isActive);
                setImagePreviews([b.imageUrl]);
                setCategoryId(b.categoryId || '');
                setProductId(b.productId || '');
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
        if (type === 'category-banner' && categoryId) {
            const selectedCategory = flatCategories.find(c => c.id === categoryId);
            const slug = selectedCategory?.slug || categoryId;
            setLinkUrl(`/danh-muc/${slug}`);
        } else if (type === 'product-banner' && productId) {
            const selectedProduct = products.find(p => p.id === productId);
            const slug = selectedProduct?.slug || productId;
            setLinkUrl(`/san-pham/${slug}`);
        }
    }, [categoryId, productId, type, flatCategories, products]);

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
        setCategoryId('');
        setProductId('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFieldErrors({});

        // ✅ Kiểm tra thiếu thông tin
        const hasMissing = !title.trim()
            || !type
            || (!imageFiles.length && !isEditing)
            || (type === 'category-banner' && !categoryId)
            || (type === 'product-banner' && !productId);

        if (hasMissing) {
            const mappedErrors = {};
            if (!title.trim()) mappedErrors.title = 'Vui lòng nhập tiêu đề.';
            if (!type) mappedErrors.type = 'Vui lòng chọn loại banner.';
            if (!imageFiles.length && !isEditing) mappedErrors.image = 'Vui lòng chọn ảnh banner.';
            if (type === 'category-banner' && !categoryId) mappedErrors.categoryId = 'Vui lòng chọn danh mục.';
            if (type === 'product-banner' && !productId) mappedErrors.productId = 'Vui lòng chọn sản phẩm.';

            setFieldErrors(mappedErrors);
            toast.error('Vui lòng nhập đầy đủ thông tin bắt buộc!');
            setLoading(false);
            return;
        }

        // ✅ Tạo form data
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
        if (type === 'category-banner' && categoryId) {
            formData.append('categoryId', Number(categoryId));
        }
        if (type === 'product-banner' && productId) {
            formData.append('productId', Number(productId));
        }

        // ✅ Gửi API
        try {
            if (isEditing) {
                await sliderService.update(slug, formData);
                toast.success('Cập nhật banner thành công!');
            } else {
                await sliderService.create(formData);
                toast.success('Tạo banner thành công!');
            }
            navigate('/admin/banners');
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
        return items.flatMap(item => {
            const currentItem = (
                <MenuItem
                    key={item.id}
                    value={item.id}
                    sx={{ pl: depth * 2 + 2 }}
                >

                    {depth > 0 ? '├ ' : ''}{item.name}
                </MenuItem>
            );

            if (item.children && item.children.length > 0) {
                return [currentItem, ...renderCategoryMenuItems(item.children, depth + 1)];
            }
            return [currentItem];
        });
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
                                        mt: 3, width: '100%', height: 180, border: '2px dashed',
                                        borderColor: fieldErrors.image ? 'error.main' : 'grey.400',
                                        borderRadius: 2, display: 'flex', justifyContent: 'center',
                                        alignItems: 'center', flexDirection: 'column', bgcolor: 'grey.50',
                                        cursor: 'pointer', '&:hover': { bgcolor: 'grey.100' },
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
                                                    <Box key={idx} sx={{ width: size.width, height: size.height, overflow: 'hidden', border: '1px solid #ddd', borderRadius: 1 }}>
                                                        <img src={src} alt={`Preview ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                    </Box>
                                                );
                                            })}
                                        </Box>
                                    </Box>
                                )}
                            </FormControl>
                        </Grid>

                        {/* Cột Phải - Các trường thông tin */}
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
                                            Loại Banner <span style={{ color: 'red' }}>*</span>
                                        </InputLabel>
                                        <Select labelId="type-label" value={type} label={
                                            <span>
                                                Loại Banner <span style={{ color: 'red' }}>*</span>
                                            </span>
                                        } onChange={(e) => handleTypeChange(e.target.value)}>
                                            {BANNER_TYPES.map((opt) => (
                                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
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
                                            helperText={fieldErrors.linkUrl || "Nhập link nội bộ (vd: /flash-sale) hoặc link ngoài."}
                                        />
                                    </Grid>
                                )}

                                {type === 'category-banner' && (
                                    <Grid item xs={12}>
                                        <FormControl fullWidth error={!!fieldErrors.categoryId}>
                                            <InputLabel id="category-select-label">
                                                Gắn với Danh mục <span style={{ color: 'red' }}>*</span>
                                            </InputLabel>
                                            <Select
                                                labelId="category-select-label"
                                                value={categoryId}
                                                label={
                                                    <span>
                                                        Gắn với Danh mục <span style={{ color: 'red' }}>*</span>
                                                    </span>
                                                }
                                                onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : '')}
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 400,
                                                        },
                                                    },
                                                }}
                                            >
                                                <MenuItem value=""><em>-- Chọn một danh mục --</em></MenuItem>
                                                {renderCategoryMenuItems(categories)}
                                            </Select>
                                            {fieldErrors.categoryId && <FormHelperText>{fieldErrors.categoryId}</FormHelperText>}
                                        </FormControl>
                                    </Grid>
                                )}

                                {type === 'product-banner' && (
                                    <Grid item xs={12}>
                                        <FormControl fullWidth error={!!fieldErrors.productId}>
                                            <InputLabel id="product-select-label">
                                                Gắn với Sản phẩm <span style={{ color: 'red' }}>*</span>
                                            </InputLabel>
                                            <Select
                                                labelId="product-select-label"
                                                value={productId}
                                                label={
                                                    <span>
                                                        Gắn với Sản phẩm <span style={{ color: 'red' }}>*</span>
                                                    </span>
                                                }
                                                onChange={(e) => setProductId(e.target.value ? Number(e.target.value) : '')}
                                            >
                                                <MenuItem value=""><em>-- Chọn một sản phẩm --</em></MenuItem>
                                                {products.map((prod) => (
                                                    <MenuItem key={prod.id} value={prod.id}>{prod.name}</MenuItem>
                                                ))}
                                            </Select>
                                            {fieldErrors.productId && <FormHelperText>{fieldErrors.productId}</FormHelperText>}
                                        </FormControl>
                                    </Grid>
                                )}

                                <Grid item xs={12}>
                                    <TextField label="Alt Text (mô tả ảnh, tốt cho SEO)" value={altText} onChange={(e) => setAltText(e.target.value)} fullWidth error={!!fieldErrors.altText} helperText={fieldErrors.altText} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Thứ tự hiển thị" type="number" value={displayOrder} onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 1)} fullWidth error={!!fieldErrors.displayOrder} helperText={fieldErrors.displayOrder} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControlLabel control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />} label={isActive ? 'Đang hoạt động' : 'Đang ẩn'} sx={{ pt: 1 }} />
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