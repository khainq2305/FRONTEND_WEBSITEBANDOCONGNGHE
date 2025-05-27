import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
    Box, Button, Paper, TextField, Typography,
    Divider, Avatar, FormControlLabel, Switch
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from 'react-toastify';
import { brandService } from '@/services/admin/brandService';
import slugify from 'slugify';

const BrandEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [imageFile, setImageFile] = useState(null);
    const [currentImage, setCurrentImage] = useState('');
    const [orderIndex, setOrderIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchBrand = async () => {
            try {
                const res = await brandService.getById(id);
                const brand = res.data.data;
                setName(brand.name);
                setSlug(brand.slug || '');
                setDescription(brand.description || '');
                setIsActive(brand.isActive);
                setCurrentImage(brand.logoUrl);
                setOrderIndex(brand.orderIndex || 0);
            } catch (err) {
                toast.error('Không tìm thấy thương hiệu');
                navigate('/admin/brands');
            }
        };

        fetchBrand();
    }, [id]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/x-icon'];
        const maxSize = 2 * 1024 * 1024;

        if (!validTypes.includes(file.type)) {
            toast.error('Chỉ chấp nhận JPG, PNG, WEBP, SVG, ICO');
            return;
        }

        if (file.size > maxSize) {
            toast.error('Dung lượng tối đa là 2MB');
            return;
        }

        setImageFile(file);
        setErrors(prev => ({ ...prev, logoUrl: undefined }));
    };

    const handleNameChange = (e) => {
        const value = e.target.value;
        setName(value);
        setSlug(slugify(value, { lower: true, strict: true }));
        setErrors(prev => ({ ...prev, name: undefined }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        if (!name.trim()) {
            setErrors(prev => ({ ...prev, name: 'Tên thương hiệu là bắt buộc' }));
            return;
        }

        try {
            setLoading(true);
            const payload = {
                name,
                slug,
                description,
                isActive,
                orderIndex
            };

            if (imageFile) {
                payload.logoUrl = imageFile;
            }

            const res = await brandService.update(id, payload);
            toast.success(res.data?.message || '✅ Cập nhật thương hiệu thành công');
            navigate('/admin/brands');
        } catch (err) {
            const msg = err?.response?.data?.message;
            const field = err?.response?.data?.field;

            if (field) {
                setErrors(prev => ({ ...prev, [field]: msg }));
            }

            toast.error(msg || 'Cập nhật thương hiệu thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, width: '100%' }}>
            <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                sx={{ mb: 3 }}
            >
                Quay lại
            </Button>

            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                    Chỉnh sửa thương hiệu
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <form onSubmit={handleSubmit}>
                    {/* logoUrl */}
                    <Box sx={{ mb: 3 }}>
                        <Typography fontWeight={500} gutterBottom>
                            Logo thương hiệu
                        </Typography>

                        <Box
                            onClick={() => document.getElementById('brand-image-input')?.click()}
                            sx={{
                                border: '2px dashed #ccc',
                                borderRadius: 2,
                                width: 100,
                                height: 100,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: '#f9f9f9',
                                overflow: 'hidden'
                            }}
                        >
                            <Avatar
                                src={imageFile ? URL.createObjectURL(imageFile) : currentImage}
                                alt="logo"
                                variant="rounded"
                                sx={{ width: '100%', height: '100%' }}
                            />
                            <input
                                id="brand-image-input"
                                type="file"
                                hidden
                                accept=".jpg,.jpeg,.png,.webp,.svg,.ico"
                                onChange={handleImageChange}
                            />
                        </Box>

                        {errors.logoUrl && (
                            <Typography variant="caption" color="error">
                                {errors.logoUrl}
                            </Typography>
                        )}

                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            Click để chọn ảnh. Chấp nhận JPG, PNG, SVG, WEBP. Tối đa 2MB.
                        </Typography>
                    </Box>

                    <TextField
                        label="Tên thương hiệu"
                        value={name}
                        onChange={handleNameChange}
                        fullWidth
                        margin="normal"
                        error={Boolean(errors.name)}
                        helperText={errors.name}
                    />


                    <TextField
                        label="Thứ tự (STT)"
                        type="number"
                        value={orderIndex}
                        onChange={(e) => setOrderIndex(Number(e.target.value))}
                        fullWidth
                        margin="normal"
                        inputProps={{ min: 0 }}
                        helperText="STT càng nhỏ sẽ hiển thị trước"
                    />

                    <TextField
                        label="Mô tả"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        multiline
                        minRows={4}
                        margin="normal"
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                color="primary"
                            />
                        }
                        label={isActive ? 'Trạng thái: Hiển thị' : 'Trạng thái: Ẩn'}
                        sx={{ mt: 2 }}
                    />

                    <Divider sx={{ my: 4 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="contained" type="submit" disabled={loading}>
                            {loading ? 'Đang lưu...' : 'Cập nhật'}
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default BrandEditPage;
