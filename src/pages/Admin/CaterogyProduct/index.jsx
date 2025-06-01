import { useState, useEffect, useCallback } from "react";
import Cropper from 'react-easy-crop';
import { categoryService } from '../../../services/admin/categoryService';
import {
    Card, CardContent, CardActions, CardHeader, TextField, Select, MenuItem,
    InputLabel, FormControl, Switch, FormControlLabel, Button, Box, Typography,
    FormHelperText
} from "@mui/material";
import { Trash2 } from 'lucide-react';
import TinyEditor from '../../../components/Admin/TinyEditor';
import { normalizeCategoryList } from '@/utils';

const CategoryMain = ({ initialData = null, onSubmit, errors = {}, setErrors }) => {
    const [parentCategories, setParentCategories] = useState([]);

    const [category, setCategory] = useState({
        name: '',
        slug: '',
        description: '',
        thumbnail: null,
        parentId: '',
        isActive: true,
        isDefault: false,
        sortOrder: 0
    });

    const isValidForm = () => {
        return category.name.trim() !== ''
            && (initialData || category.thumbnail)
            && !isNaN(category.sortOrder) && category.sortOrder >= 0;
    };

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
                const levelcategories = normalizeCategoryList(res.data.data);
                setParentCategories(levelcategories);
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
                sortOrder: Number.isInteger(initialData.sortOrder) ? initialData.sortOrder : 0
            });
            if (initialData.thumbnail) setPreview(initialData.thumbnail);
        }
    }, [initialData]);

    const handleChange = (field, value) => {
        setCategory((prev) => ({ ...prev, [field]: value }));

        if (setErrors && errors[field]) {
            const isValid =
                (field === 'name' && value.trim() !== '') ||
                (field === 'sortOrder' && !isNaN(value) && Number(value) >= 0) ||
                (field === 'thumbnail' && value);

            if (isValid) {
                setErrors((prev) => {
                    const clone = { ...prev };
                    delete clone[field];
                    return clone;
                });
            }
        }
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

        if (setErrors && errors.thumbnail) {
            setErrors((prev) => {
                const clone = { ...prev };
                delete clone.thumbnail;
                return clone;
            });
        }
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
                    <div className="flex flex-col gap-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <TextField
                                label="Tên danh mục"
                                value={category.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                required
                                fullWidth
                                error={!!errors.name}
                                helperText={errors.name}
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
                                            {'— '.repeat(parent.level) + parent.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.parentId && <FormHelperText>{errors.parentId}</FormHelperText>}
                            </FormControl>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Typography fontWeight={500} mb={1}>Mô tả</Typography>
                                <TinyEditor
                                    value={category.description}
                                    onChange={(val) => handleChange("description", val)}
                                    height={300}
                                />
                            </div>

                            <div>
                                <Typography fontWeight={500} mb={1}>Thumbnail</Typography>
                                <label
                                    htmlFor="thumbnail"
                                    onDrop={handleDrop}
                                    onDragOver={(e) => e.preventDefault()}
                                    className={`
    flex items-center justify-center w-full h-72 px-4 transition bg-gray-50 border-2 border-dashed 
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
                                    <span className="text-gray-500 text-sm">
                                        Kéo thả hoặc bấm để chọn ảnh từ máy
                                    </span>
                                </label>


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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <TextField
                                label="Thứ tự hiển thị"
                                type="number"
                                value={category.sortOrder}
                                onChange={(e) => handleChange("sortOrder", parseInt(e.target.value))}
                                fullWidth
                                error={!!errors.sortOrder}
                                helperText={errors.sortOrder}
                            />

                            <div className="flex items-center gap-6 mt-2">
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={category.isActive}
                                            onChange={(e) => handleChange("isActive", e.target.checked)}
                                        />
                                    }
                                    label={category.isActive ? "Hiển thị" : "Ẩn"}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>

                <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
                    <Button variant="outlined" onClick={() => window.history.back()}>
                        Hủy
                    </Button>
                    <Button
                        variant="contained"
                        disabled={!isValidForm()}
                        onClick={async () => {
                            try {
                                await onSubmit(category);
                            } catch (err) {
                                console.error('❌ Submit thất bại:', err);
                            }
                        }}
                    >
                        {initialData ? "Cập nhật" : "Thêm mới"}
                    </Button>
                </CardActions>
            </Card>

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
