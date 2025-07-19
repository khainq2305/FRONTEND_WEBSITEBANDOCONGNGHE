import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    MenuItem,
    Box,
    DialogActions,
    IconButton,
    Grid, // <-- Nhập Grid để chia cột
    FormControl, // <-- Nhập các component cho Radio Group
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect } from 'react';
import { getAllRoles } from '../../../../services/admin/userService';
import { toast } from 'react-toastify';

const statuses = [
    { label: 'Hoạt động', value: 1 },
    { label: 'Ngưng hoạt động', value: 0 }
];

const UserFormDialog = ({ open, onClose, onSubmit, initialData = {}, asPage = false, errors = {} }) => {
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        roleId: '',
        password: '',
        status: 1
    });

    const [formErrors, setFormErrors] = useState({});
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        if (initialData) {
            setForm({
                fullName: initialData.fullName || '',
                email: initialData.email || '',
                roleId: initialData.roleId || '',
                password: '',
                status: initialData.status ?? 1
            });
        }
    }, [initialData]);

    useEffect(() => {
        setFormErrors(errors || {});
    }, [errors]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const data = await getAllRoles();
                setRoles(data.roles);
                if (data.roles?.length > 0 && !form.roleId) {
                    setForm((prev) => ({ ...prev, roleId: data.roles[0].id }));
                }
            } catch {
                toast.error('Không tải được danh sách vai trò');
            }
        };
        fetchRoles();
    }, [form.roleId]);

    const handleChange = (field, value) => {
        // Chuyển đổi giá trị của radio group thành số nếu cần
        const newValue = field === 'status' ? parseInt(value, 10) : value;
        setForm({ ...form, [field]: newValue });
    };

    const handleSubmit = async () => {
        await onSubmit(form);
    };

    // Nội dung form đã được cập nhật với Grid
    const renderFormContent = () => (
        <Grid container spacing={3} sx={{ pt: 1 }}>
            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    label="Họ tên"
                    variant="outlined"
                    value={form.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    error={!!formErrors.fullName}
                    helperText={formErrors.fullName}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                />
            </Grid>
            {!initialData?.id && (
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Mật khẩu"
                        type="password"
                        variant="outlined"
                        value={form.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        error={!!formErrors.password}
                        helperText={formErrors.password}
                    />
                </Grid>
            )}
            <Grid item xs={12} md={6}>
                <TextField
                    select
                    fullWidth
                    label="Vai trò"
                    variant="outlined"
                    value={form.roleId?.toString() || ''}
                    onChange={(e) => handleChange('roleId', e.target.value)}
                    error={!!formErrors.roleId}
                    helperText={formErrors.roleId}
                >
                    {roles.length > 0 ? (
                        roles.map((role) => (
                            <MenuItem key={role.id} value={role.id.toString()}>
                                {role.name}
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem disabled value="">
                            Không có vai trò
                        </MenuItem>
                    )}
                </TextField>
            </Grid>

            {/* --- Thay thế TextField Status bằng RadioGroup --- */}
            <Grid item xs={12}>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Trạng thái</FormLabel>
                    <RadioGroup
                        row
                        aria-label="status"
                        name="status"
                        value={form.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                    >
                        {statuses.map(({ label, value }) => (
                           <FormControlLabel key={value} value={value} control={<Radio />} label={label} />
                        ))}
                    </RadioGroup>
                </FormControl>
            </Grid>
        </Grid>
    );

    if (asPage) {
        return (
            <Box component="form" noValidate autoComplete="off">
                {renderFormContent()}
                <Box display="flex" justifyContent="flex-end" gap={2} pt={3}>
                    <Button onClick={onClose} variant="outlined">Hủy</Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        Lưu
                    </Button>
                </Box>
            </Box>
        );
    }
    
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" PaperProps={{ component: 'form', onSubmit: (e) => { e.preventDefault(); handleSubmit(); } }}>
             <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {initialData?.id ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản'}
                <IconButton aria-label="close" onClick={onClose} sx={{ color: (theme) => theme.palette.grey[500] }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                {renderFormContent()}
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} color="inherit">Hủy</Button>
                <Button variant="contained" type="submit">
                    Lưu
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserFormDialog;