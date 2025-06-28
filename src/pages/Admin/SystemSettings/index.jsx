import {
    Card, CardHeader, CardContent, CardActions, TextField,
    Button, Box, Grid, Typography, FormGroup,
    FormControlLabel, InputAdornment, CircularProgress, Collapse
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ThumbnailUpload from './ThumbnailUpload';
import SwitchCustom from '@/components/Admin/SwitchCustom';
import Autocomplete from '@mui/material/Autocomplete';
import { useSystemSetting } from '@/contexts/SystemSettingContext';
import { systemSettingService } from '@/services/admin/systemSettingService';
import TinyEditor from '@/components/Admin/TinyEditor';
import Loader from '@/components/Admin/Loader';
export default function SystemSettingsMain() {
    const { settings, fetchSettings } = useSystemSetting();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        site_name: '', site_description: '', website_url: '', address: '',
        hotline: '', hotline_sales: '', hotline_warranty: '', hotline_feedback: '', email_contact: '',
        site_logo: null, favicon: null,
        facebook_enabled: true, instagram_enabled: true, tiktok_enabled: true, youtube_enabled: true, zalo_enabled: true,
        low_stock_threshold: ''
    });

    const [preview, setPreview] = useState({ site_logo: '', favicon: '' });
    const [errors, setErrors] = useState({});
    const [expandedSections, setExpandedSections] = useState({
        general: false,
        contact: false,
        media: false,
        social: false,
        stock: false
    });

    const toggleSection = (key) => {
        setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    useEffect(() => {
        if (!settings) return;
        setFormData({
            site_name: settings.site_name || '',
            site_description: settings.site_description || '',
            website_url: settings.website_url || '',
            address: settings.address || '',
            hotline: settings.hotline || '',
            hotline_sales: settings.hotline_sales || '',
            hotline_warranty: settings.hotline_warranty || '',
            hotline_feedback: settings.hotline_feedback || '',
            email_contact: settings.email_contact || '',
            site_logo: settings.site_logo || null,
            favicon: settings.favicon || null,
            facebook_enabled: settings.facebook_enabled ?? true,
            instagram_enabled: settings.instagram_enabled ?? true,
            tiktok_enabled: settings.tiktok_enabled ?? true,
            youtube_enabled: settings.youtube_enabled ?? true,
            zalo_enabled: settings.zalo_enabled ?? true,
            low_stock_threshold: settings.low_stock_threshold || ''
        });
        setPreview({
            site_logo: settings.site_logo || '',
            favicon: settings.favicon || ''
        });
    }, [settings]);

    const handleChange = (e) => {
        const { name, value, files, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else if (files?.length) {
            const file = files[0];
            setFormData((prev) => ({ ...prev, [name]: file }));
            setPreview((prev) => ({ ...prev, [name]: URL.createObjectURL(file) }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }

        if (value?.toString().trim()) {
            setErrors((prev) => {
                const updated = { ...prev };
                delete updated[name];
                return updated;
            });
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const payload = new FormData();
        Object.entries(formData).forEach(([k, v]) => {
            if (v instanceof File) payload.append(k, v);
            else payload.append(k, typeof v === 'boolean' ? v.toString() : v);
        });

        try {
            await systemSettingService.update(payload);
            toast.success('Cập nhật thành công!');
            setErrors({});
            fetchSettings?.();
        } catch (err) {
            const serverErrors = err.response?.data?.errors || [];
            const formatted = {};
            serverErrors.forEach((e) => (formatted[e.field] = e.message));
            setErrors(formatted);
            toast.error('Vui lòng kiểm tra lại thông tin!');
        } finally {
            setLoading(false);
        }
    };
    const renderAutocompleteInput = (label, name, type = 'text') => (
        <Autocomplete
            freeSolo
            options={[]}
            inputValue={formData[name]?.toString() || ''}
            onInputChange={(e, val) => {
                setFormData((prev) => ({ ...prev, [name]: val }));
                if (val.trim()) {
                    setErrors((prev) => {
                        const updated = { ...prev };
                        delete updated[name];
                        return updated;
                    });
                }
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    type={type}
                    label={label}
                    name={name}
                    error={!!errors[name]}
                    helperText={errors[name]}
                    fullWidth
                />
            )}
        />
    );

    if (!settings || loading) return <Loader />;

    return (
        <Box py={4}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardHeader
                    title="Cài đặt hệ thống"
                    subheader="Chỉnh sửa các thông tin cơ bản và cấu hình hiển thị của website"
                    titleTypographyProps={{ variant: 'h5', fontWeight: 700, color: 'primary.dark' }}
                    subheaderTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    sx={{ pb: 0, pt: 4, px: 4 }}
                />
                <form onSubmit={handleSubmit}>
                    <CardContent sx={{ px: 4, pt: 2 }}>
                        <Box display="flex" flexDirection="column" gap={4}>
                            {renderSection('Thông tin chung', 'general', (
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>{renderAutocompleteInput('Tên website', 'site_name')}</Grid>
                                    <Grid item xs={12}>{renderAutocompleteInput('Mô tả trang web', 'site_description')}</Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" fontWeight={500} mb={1}>Địa chỉ</Typography>
                                        <TinyEditor
                                            value={formData.address}
                                            onChange={(val) => {
                                                setFormData((prev) => ({ ...prev, address: val }));
                                                if (val.trim()) {
                                                    setErrors((prev) => {
                                                        const updated = { ...prev };
                                                        delete updated.address;
                                                        return updated;
                                                    });
                                                }
                                            }}
                                            height={200}
                                        />
                                        {errors.address && <Typography variant="body2" color="error">{errors.address}</Typography>}
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            label="Địa chỉ website"
                                            name="website_url"
                                            value={formData.website_url}
                                            fullWidth
                                            disabled
                                            InputProps={{
                                                readOnly: true,
                                                startAdornment: <InputAdornment position="start">https://</InputAdornment>
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            ))}

                            {renderSection('Thông tin liên hệ', 'contact', (
                                <Grid container spacing={3}>
                                    {[
                                        { label: 'Hotline chính', name: 'hotline' },
                                        { label: 'Hotline mua nhanh', name: 'hotline_sales' },
                                        { label: 'Hotline bảo hành', name: 'hotline_warranty' },
                                        { label: 'Hotline phản ánh', name: 'hotline_feedback' },
                                        { label: 'Email liên hệ', name: 'email_contact', type: 'email' }
                                    ].map(({ label, name, type = 'text' }) => (
                                        <Grid item xs={12} sm={6} key={name}>
                                            {renderAutocompleteInput(label, name, type)}
                                        </Grid>
                                    ))}
                                </Grid>
                            ))}

                            {renderSection('Hình ảnh hiển thị', 'media', (
                                <Grid container spacing={4}>
                                    {['site_logo', 'favicon'].map((name) => (
                                        <Grid item xs={12} md={6} key={name}>
                                            <ThumbnailUpload
                                                label={name === 'site_logo' ? 'Logo website' : 'Favicon (biểu tượng tab)'}
                                                value={preview[name] ? { url: preview[name] } : null}
                                                onChange={(val) => {
                                                    setFormData((prev) => ({ ...prev, [name]: val?.file || null }));
                                                    setPreview((prev) => ({ ...prev, [name]: val?.url || '' }));
                                                }}
                                            />
                                            {errors[name] && <Typography variant="body2" color="error">{errors[name]}</Typography>}
                                        </Grid>
                                    ))}
                                </Grid>
                            ))}

                            {renderSection('Mạng xã hội', 'social', (
                                <FormGroup row sx={{ gap: 3, flexWrap: 'wrap' }}>
                                    {['facebook', 'instagram', 'tiktok', 'youtube', 'zalo'].map(n => (
                                        <FormControlLabel
                                            key={n}
                                            control={<SwitchCustom checked={formData[`${n}_enabled`]} onChange={handleChange} name={`${n}_enabled`} />}
                                            label={n.charAt(0).toUpperCase() + n.slice(1)}
                                            sx={{ flex: '1 1 140px', m: 0 }}
                                        />
                                    ))}
                                </FormGroup>
                            ))}

                            {renderSection('Cảnh báo tồn kho', 'stock', (
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        {renderAutocompleteInput('Ngưỡng tồn kho thấp', 'low_stock_threshold', 'number')}
                                    </Grid>
                                </Grid>
                            ))}
                        </Box>
                    </CardContent>

                    <CardActions sx={{ justifyContent: 'flex-end', px: 4, py: 3 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={loading}
                            endIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                            sx={{ minWidth: 140, fontWeight: 600 }}
                        >
                            {loading ? 'Đang lưu...' : 'Cập nhật'}
                        </Button>
                    </CardActions>
                </form>
            </Card>
        </Box>
    );

    function renderSection(title, key, children) {
        return (
            <Box sx={{ border: '1px solid #ddd', p: 3, borderRadius: 2 }}>
                <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    mb={2}
                    onClick={() => toggleSection(key)}
                    sx={{ cursor: 'pointer' }}
                >
                    <Typography variant="h6" fontWeight={600}>{title}</Typography>
                    <ExpandMoreIcon
                        fontSize="small"
                        sx={{
                            transform: expandedSections[key] ? 'rotate(0deg)' : 'rotate(-90deg)',
                            transition: 'transform 0.2s'
                        }}
                    />
                </Box>
                <Collapse in={expandedSections[key]}>
                    {children}
                </Collapse>
            </Box>
        );
    }
}
