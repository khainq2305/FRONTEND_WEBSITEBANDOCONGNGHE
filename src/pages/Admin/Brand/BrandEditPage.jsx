import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
    Box, Button, Paper, TextField, Typography,
    Divider, Avatar, FormControlLabel, Switch
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Toastify from 'components/common/Toastify';

// Dữ liệu giả – nên thay bằng gọi API thực tế
const mockBrands = [
    { id: 1, name: 'Nike', slug: 'nike', image: '/images/brands/nike.png', description: 'Thương hiệu thể thao nổi tiếng', is_active: true },
    { id: 2, name: 'Adidas', slug: 'adidas', image: '/images/brands/adidas.png', description: '', is_active: false }
];

const BrandEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const brand = mockBrands.find((b) => b.id === Number(id));

    const [name, setName] = useState(brand?.name || '');
    const [slug, setSlug] = useState(brand?.slug || '');
    const [description, setDescription] = useState(brand?.description || '');
    const [isActive, setIsActive] = useState(brand?.is_active || false);
    const [imageFile, setImageFile] = useState(null);
    const [currentImage, setCurrentImage] = useState(brand?.image || '');

    if (!brand) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography variant="h6">Không tìm thấy thương hiệu</Typography>
                <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>
                    Quay lại
                </Button>
            </Box>
        );
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/x-icon'];
        const maxSize = 2 * 1024 * 1024;

        if (!validTypes.includes(file.type)) {
            Toastify.error('Chỉ chấp nhận JPG, PNG, WEBP, SVG, ICO');
            return;
        }

        if (file.size > maxSize) {
            Toastify.error('Dung lượng tối đa là 2MB');
            return;
        }

        setImageFile(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim()) {
            Toastify.error('Tên thương hiệu là bắt buộc');
            return;
        }

        if (!slug.trim()) {
            Toastify.error('Slug là bắt buộc');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('slug', slug);
        formData.append('description', description);
        formData.append('is_active', isActive);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        Toastify.success(`Đã cập nhật thương hiệu "${name}"`);
        navigate('/admin/brands');
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

            <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, width: '100%' }}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                    Chỉnh sửa thương hiệu
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <form onSubmit={handleSubmit}>
                    {/* Logo upload */}
                    <Box sx={{ mb: 3 }}>
                        <Typography fontWeight={500} gutterBottom>
                            Logo thương hiệu
                        </Typography>

                        <Box
                            onClick={() => document.getElementById('brand-image-input')?.click()}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                const file = e.dataTransfer.files[0];
                                if (file) handleImageChange({ target: { files: [file] } });
                            }}
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
                                position: 'relative',
                            }}
                        >
                            <Avatar
                                src={imageFile ? URL.createObjectURL(imageFile) : currentImage}
                                alt="Logo"
                                variant="rounded"
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: 2,
                                    objectFit: 'contain',
                                    border: imageFile ? 'none' : '1px dashed #ccc',
                                }}
                            />
                            <input
                                id="brand-image-input"
                                type="file"
                                hidden
                                accept=".jpg,.jpeg,.png,.webp,.svg,.ico"
                                onChange={handleImageChange}
                            />
                        </Box>

                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            Kéo ảnh vào hoặc click để chọn file. Chấp nhận JPG, PNG, SVG, WEBP. Tối đa 2MB.
                        </Typography>
                    </Box>

                    {/* Tên thương hiệu */}
                    <TextField
                        label="Tên thương hiệu"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        required
                        margin="normal"
                    />

                    {/* Slug */}
                    <TextField
                        label="Slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        fullWidth
                        required
                        margin="normal"
                    />

                    {/* Mô tả */}
                    <TextField
                        label="Mô tả"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        multiline
                        minRows={4}
                        margin="normal"
                    />

                    {/* Trạng thái */}
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Hiển thị thương hiệu"
                        sx={{ mt: 2 }}
                    />

                    <Divider sx={{ my: 4 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="contained" size="large" type="submit">
                            Cập nhật
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default BrandEditPage;
