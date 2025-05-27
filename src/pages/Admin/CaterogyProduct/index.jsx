import { useState, useEffect, useCallback } from "react";
import Cropper from 'react-easy-crop';
import { categoryService } from '../../../services/admin/categoryService';
import {
    Card, CardContent, CardActions, CardHeader, TextField, Select, MenuItem,
    InputLabel, FormControl, Switch, FormControlLabel, Button, Box, Typography,
    FormHelperText
} from "@mui/material";
import { Trash2 } from 'lucide-react';

const CategoryMain = ({ initialData = null, onSubmit, errors = {} }) => {
    const [parentCategories, setParentCategories] = useState([]);
    const [category, setCategory] = useState({
        name: '',
        slug: '',
        description: '',
        thumbnail: null,
        parentId: '',
        isActive: true,
        isDefault: false,
        orderIndex: 0
    });

    const [preview, setPreview] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [showCrop, setShowCrop] = useState(false);
    const [cropSrc, setCropSrc] = useState(null);

    useEffect(() => {
        const fetchParentCategories = async () => {
            try {
                const res = await categoryService.getAll();
                const list = res?.data?.data || [];
                const filtered = initialData ? list.filter(c => c.id !== initialData.id) : list;
                setParentCategories(filtered);
            } catch (err) {
                console.error("❌ Lỗi lấy danh mục cha:", err);
            }
        };
        fetchParentCategories();

        if (initialData) {
            setCategory({
                name: initialData.name || '',
                slug: initialData.slug || '',
                description: initialData.description || '',
                thumbnail: null,
                parentId: initialData.parentId || '',
                isActive: initialData.isActive ?? true,
                isDefault: initialData.isDefault ?? false,
                orderIndex: initialData.orderIndex ?? 0
            });
            if (initialData.thumbnail) setPreview(initialData.thumbnail);
        }
    }, [initialData]);

    const handleChange = (field, value) => {
        setCategory((prev) => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.dataTransfer?.files?.[0] || e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setCropSrc(reader.result);
                setShowCrop(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const onCropComplete = useCallback((_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const createImage = (url) => new Promise((resolve, reject) => {
        const image = new Image();
        image.src = url;
        image.onload = () => resolve(image);
        image.onerror = reject;
    });

    const getCroppedImg = async (imageSrc, cropArea) => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = cropArea.width;
        canvas.height = cropArea.height;
        ctx.drawImage(
            image,
            cropArea.x * scaleX,
            cropArea.y * scaleY,
            cropArea.width * scaleX,
            cropArea.height * scaleY,
            0,
            0,
            cropArea.width,
            cropArea.height
        );
        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                const file = new File([blob], 'cropped.jpg', { type: 'image/jpeg' });
                resolve({ file, preview: URL.createObjectURL(file) });
            }, 'image/jpeg');
        });
    };

    const handleCropDone = async () => {
        const { file, preview } = await getCroppedImg(cropSrc, croppedAreaPixels);
        setCategory((prev) => ({ ...prev, thumbnail: file }));
        setPreview(preview);
        setShowCrop(false);
        setCropSrc(null);
    };

    const handleRemoveImage = () => {
        setPreview(null);
        setCategory((prev) => ({ ...prev, thumbnail: null }));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        handleFileChange(e);
    };

    return (
        <Box maxWidth="full" py={4}>
            <Card>
                <CardHeader
                    title={initialData ? "Cập nhật danh mục" : "Thêm danh mục"}
                    subheader="Điền thông tin danh mục sản phẩm"
                />
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                        {/* Left Column */}
                        <div className="flex flex-col gap-6">
                            <TextField
                                label="Tên danh mục"
                                value={category.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                required
                                fullWidth
                                error={!!errors.name}
                                helperText={errors.name}
                            />

                            <TextField
                                label="Mô tả"
                                multiline
                                rows={3}
                                value={category.description}
                                onChange={(e) => handleChange("description", e.target.value)}
                                fullWidth
                            />

                            <div>
                                <label className="block font-semibold mb-2">Thumbnail</label>
                                <div
                                    onDrop={handleDrop}
                                    onDragOver={(e) => e.preventDefault()}
                                    className={`
            flex items-center justify-center w-full h-40 px-4 transition bg-gray-50 border-2 border-dashed 
            rounded-md cursor-pointer hover:border-blue-400 hover:bg-blue-50
            ${errors.thumbnail ? 'border-red-500' : 'border-gray-300'}
          `}
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="thumbnail"
                                    />
                                    <label htmlFor="thumbnail" className="cursor-pointer text-gray-500 text-sm">
                                        Kéo thả hoặc bấm để chọn ảnh từ máy
                                    </label>
                                </div>

                                {preview && (
                                    <div className="relative mt-3 w-32 h-32 rounded-lg border border-gray-300 overflow-hidden shadow-sm">
                                        <img src={preview} alt="preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute top-1 right-1 bg-white/80 hover:bg-white rounded-full p-1"
                                            title="Xoá ảnh"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )}

                                {errors.thumbnail && (
                                    <p className="text-sm text-red-500 mt-1">{errors.thumbnail}</p>
                                )}
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="flex flex-col gap-6">
                            <TextField
                                label="Slug (tự tạo nếu bỏ trống)"
                                value={category.slug}
                                fullWidth
                                disabled
                            />

                            <FormControl fullWidth error={!!errors.parentId}>
                                <InputLabel>Danh mục cha</InputLabel>
                                <Select
                                    value={category.parentId}
                                    label="Danh mục cha"
                                    onChange={(e) => handleChange("parentId", e.target.value ? parseInt(e.target.value) : null)}
                                >
                                    <MenuItem value="">Không có</MenuItem>
                                    {parentCategories.map((parent) => (
                                        <MenuItem key={parent.id} value={parent.id}>
                                            {parent.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.parentId && <FormHelperText>{errors.parentId}</FormHelperText>}
                            </FormControl>

                            <TextField
                                label="Thứ tự hiển thị"
                                type="number"
                                value={category.orderIndex}
                                onChange={(e) => handleChange("orderIndex", parseInt(e.target.value))}
                                fullWidth
                                error={!!errors.orderIndex}
                                helperText={errors.orderIndex}
                            />

                            <Box display="flex" gap={4}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={category.isDefault}
                                            onChange={(e) => handleChange("isDefault", e.target.checked)}
                                        />
                                    }
                                    label={category.isDefault ? "Mặc định" : "Không mặc định"}
                                    sx={{ m: 0 }}
                                />

                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={category.isActive}
                                            onChange={(e) => handleChange("isActive", e.target.checked)}
                                        />
                                    }
                                    label={category.isActive ? "Hiển thị" : "Ẩn"}
                                    sx={{ m: 0 }}
                                />
                            </Box>
                        </div>
                    </div>
                </CardContent>

                <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
                    <Button variant="outlined" onClick={() => window.history.back()}>
                        Hủy
                    </Button>
                    <Button variant="contained" onClick={() => onSubmit(category)}>
                        {initialData ? "Cập nhật" : "Thêm mới"}
                    </Button>
                </CardActions>
            </Card>

            {/* Crop modal */}
            {showCrop && cropSrc && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-md shadow-md w-[90vw] max-w-md">
                        <div className="relative h-64">
                            <Cropper
                                image={cropSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outlined" onClick={() => setShowCrop(false)}>Huỷ</Button>
                            <Button variant="contained" onClick={handleCropDone}>Cắt & dùng ảnh</Button>
                        </div>
                    </div>
                </div>
            )}
        </Box>
    );
};

export default CategoryMain;
