import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
    Paper
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { spinRewardService } from '@/services/admin/spinRewardService';
import { couponService } from '@/services/admin/couponService';
import LoaderAdmin from '@/components/common/Loader';

const SpinRewardFormPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        name: '',
        couponId: '',
        probability: 10,
        isActive: true
    });

    const [couponList, setCouponList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const res = await couponService.list({ limit: 1000 });
                setCouponList(Array.isArray(res.data?.data) ? res.data.data : []);
            } catch (err) {
                toast.error('Không thể tải danh sách mã giảm giá');
            }
        };
        fetchCoupons();
    }, []);

    useEffect(() => {
        if (isEditing) {
            setLoading(true);
            const fetchReward = async () => {
                try {
                    const res = await spinRewardService.getById(id);
                    setFormData({
                        name: res.data?.name || '',
                        couponId: res.data?.couponId || '',
                        probability: (res.data?.probability || 0) * 100,
                        isActive: res.data?.isActive ?? true
                    });
                } catch (err) {
                    toast.error('Không thể tải phần thưởng');
                    navigate('/admin/spin-rewards');
                } finally {
                    setLoading(false);
                }
            };
            fetchReward();
        }
    }, [id, isEditing, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const validate = () => {
        const temp = {};
        if (!formData.name?.trim()) temp.name = 'Nhập tên phần thưởng';
        if (!formData.couponId) temp.couponId = 'Chọn mã giảm giá';
        if (
            isNaN(parseFloat(formData.probability)) ||
            formData.probability < 0 ||
            formData.probability > 100
        ) {
            temp.probability = 'Tỷ lệ phải từ 0 đến 100';
        }
        setErrors(temp);
        return Object.keys(temp).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const payload = {
                name: formData.name,
                couponId: formData.couponId,
                probability: parseFloat(formData.probability) / 100,
                isActive: formData.isActive
            };

            if (isEditing) {
                await spinRewardService.update(id, payload);
                toast.success('Cập nhật thành công');
            } else {
                await spinRewardService.create(payload);
                toast.success('Tạo mới thành công');
            }

            navigate('/admin/spin-rewards');
        } catch (err) {
            toast.error('Lỗi xử lý phần thưởng');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            {loading && <LoaderAdmin fullscreen />}
            <Typography variant="h6" fontWeight={600} mb={2}>
                {isEditing ? 'Chỉnh Sửa Phần Thưởng' : 'Tạo Mới Phần Thưởng'}
            </Typography>

            <Paper sx={{ p: 3 }}>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Tên phần thưởng"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        error={!!errors.name}
                        helperText={errors.name}
                    />

                    {!isEditing && (
                        <FormControl fullWidth margin="normal" error={!!errors.couponId}>
                            <InputLabel>Mã Giảm Giá</InputLabel>
                            <Select
                                name="couponId"
                                value={formData.couponId}
                                label="Mã Giảm Giá"
                                onChange={handleChange}
                            >
                                {couponList.map((item) => (
                                    <MenuItem key={item.id} value={item.id}>
                                        {item.title} ({item.code})
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.couponId && (
                                <Typography color="error" variant="caption">
                                    {errors.couponId}
                                </Typography>
                            )}
                        </FormControl>
                    )}

                    <TextField
                        label="Tỷ lệ xuất hiện (%)"
                        name="probability"
                        type="number"
                        value={formData.probability}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        error={!!errors.probability}
                        helperText={errors.probability}
                        inputProps={{ min: 0, max: 100, step: 1 }}
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.isActive}
                                onChange={handleChange}
                                name="isActive"
                                color="primary"
                            />
                        }
                        label="Hiển thị"
                        sx={{ mt: 2, mb: 2 }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button variant="outlined" onClick={() => navigate('/admin/spin-rewards')}>
                            Hủy
                        </Button>
                        <Button type="submit" variant="contained">
                            {isEditing ? 'Cập Nhật' : 'Tạo Mới'}
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default SpinRewardFormPage;
