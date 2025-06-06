import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify'; // Đảm bảo bạn đã cấu hình React-Toastify
import { systemSettingsService } from '../../../services/admin/systemSettingsService'; // Đảm bảo đường dẫn đúng

const defaultForm = {
    site_name: '',
    hotline: '',
    email_contact: '',
    address: '',
    low_stock_threshold: '', // Để rỗng để input type="number" không lỗi
    facebook_page_url: '',
    // site_logo và favicon sẽ được lưu trữ là File object khi người dùng chọn mới,
    // hoặc null/undefined nếu không có file mới được chọn
    site_logo: null,
    favicon: null,
};

export default function SystemSettingsForm() {
    const [form, setForm] = useState(defaultForm);
    const [preview, setPreview] = useState({ logo: '', favicon: '' }); // Lưu URL ảnh để hiển thị preview
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Gọi API để lấy cài đặt hiện tại từ backend
        // systemSettingsService.get() nên gọi đến GET /admin/system-settings
        systemSettingsService.get()
            .then(res => {
                // Sau khi lấy dữ liệu, cập nhật form và preview
                // Đặt site_logo và favicon trong form về null để chỉ gửi file mới nếu có
                setForm({ ...res.data, site_logo: null, favicon: null });
                setPreview({
                    logo: res.data.site_logo || '', // Sử dụng URL hiện có để preview
                    favicon: res.data.favicon || ''
                });
            })
            .catch(() => toast.error('❌ Không thể tải dữ liệu cài đặt.'));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            // Kiểm tra định dạng file là ảnh
            if (!file.type.startsWith('image/')) {
                toast.error('❌ File không hợp lệ. Vui lòng chọn ảnh.');
                return;
            }

            // Lưu File object vào state form để gửi đi
            setForm((prev) => ({ ...prev, [type]: file }));
            // Tạo URL tạm thời để hiển thị preview ngay lập tức
            setPreview((prev) => ({
                ...prev,
                [type === 'site_logo' ? 'logo' : 'favicon']: URL.createObjectURL(file),
            }));
        }
    };

    const handleDrop = (e, type) => {
        e.preventDefault(); // Ngăn chặn hành vi mặc định của trình duyệt
        const file = e.dataTransfer.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error('❌ File không hợp lệ. Vui lòng chọn ảnh.');
                return;
            }

            setForm((prev) => ({ ...prev, [type]: file }));
            setPreview((prev) => ({
                ...prev,
                [type === 'site_logo' ? 'logo' : 'favicon']: URL.createObjectURL(file),
            }));
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const formData = new FormData();

            // Duyệt qua state 'form' để tạo FormData
            for (const key in form) {
                const value = form[key];
                // Chỉ thêm vào formData nếu giá trị không phải null, undefined, hoặc rỗng
                // Điều này quan trọng để không gửi null cho file nếu không có file mới được chọn
                if (value !== null && value !== undefined && value !== '') {
                    formData.append(key, value);
                }
            }

            // Gọi API cập nhật cài đặt
            // systemSettingsService.update() nên gọi đến PUT /admin/system-settings/update
            const response = await systemSettingsService.update(formData);
            const updatedData = response.data?.data;

            if (updatedData) {
                // Cập nhật lại form và preview với dữ liệu mới từ backend (URL Cloudinary)
                setForm({ ...updatedData, site_logo: null, favicon: null });
                setPreview({
                    logo: updatedData.site_logo || '',
                    favicon: updatedData.favicon || '',
                });

                // Cập nhật Favicon trực tiếp trên tab trình duyệt của Admin
                if (updatedData.favicon) {
                    const faviconUrl = updatedData.favicon + '?v=' + new Date().getTime(); // Thêm timestamp để ép cache
                    let link = document.querySelector("link[rel~='icon']");
                    if (link) {
                        link.href = faviconUrl;
                    } else {
                        link = document.createElement('link');
                        link.rel = 'icon';
                        link.href = faviconUrl;
                        document.head.appendChild(link);
                    }
                }
            }

            toast.success('✅ Cập nhật thành công!');
        } catch (err) {
            console.error('Lỗi khi cập nhật cài đặt:', err);
            toast.error(err.response?.data?.message || '❌ Cập nhật thất bại');
        } finally {
            setLoading(false);
        }
    };

    // Component con cho Input Group (để code gọn hơn)
    const InputGroup = ({ name, placeholder, type = 'text' }) => (
        <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">{placeholder}</label>
            <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
        </div>
    );

    // Component con cho File Dropzone (để code gọn hơn)
    const FileDropzone = ({ label, name, previewUrl }) => (
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <div
                onDrop={(e) => handleDrop(e, name)}
                onDragOver={(e) => e.preventDefault()} // Quan trọng để cho phép drop
                className="h-48 border-2 border-dashed rounded-md flex items-center justify-center bg-gray-50 hover:border-blue-400 cursor-pointer relative"
            >
                <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp, image/x-icon"
                    id={name}
                    className="absolute w-full h-full opacity-0 cursor-pointer" // Làm cho input ẩn nhưng vẫn click được
                    onChange={(e) => handleFileChange(e, name)}
                />
                <span className="text-sm text-gray-500">Kéo thả hoặc click để chọn ảnh</span>
            </div>
            {previewUrl && (
                <img src={previewUrl} alt={label} className="mt-1 max-h-28 border p-1 bg-white rounded-md" />
            )}
        </div>
    );

    return (
        <div className="max-w-screen-lg mx-auto px-4 py-6 bg-white shadow rounded-md">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">Cài đặt hệ thống</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup name="site_name" placeholder="Tên website" />
                <InputGroup name="hotline" placeholder="Hotline" />
                <InputGroup name="email_contact" placeholder="Email liên hệ" type="email" />
                <InputGroup name="address" placeholder="Địa chỉ liên hệ" />
                <InputGroup name="facebook_page_url" placeholder="Link fanpage Facebook" />
                <InputGroup name="low_stock_threshold" placeholder="Ngưỡng cảnh báo tồn kho" type="number" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <FileDropzone label="Logo website" name="site_logo" previewUrl={preview.logo} />
                <FileDropzone label="Favicon" name="favicon" previewUrl={preview.favicon} />
            </div>

            <div className="mt-8">
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md"
                    onClick={handleSubmit} // Gọi handleSubmit khi click
                    disabled={loading} // Vô hiệu hóa nút khi đang tải
                >
                    {loading ? 'Đang lưu...' : 'Lưu cài đặt'}
                </button>
            </div>
        </div>
    );
}