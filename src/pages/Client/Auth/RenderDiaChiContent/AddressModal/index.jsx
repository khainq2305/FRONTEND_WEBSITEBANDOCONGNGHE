// components/common/AddressModal.jsx (hoặc bất cứ đâu bạn đã lưu nó)

import React, { useState, useEffect, useRef } from 'react';
import { Plus, ChevronDown, Search as SearchIcon, X as CloseIcon } from 'lucide-react';
import { shippingService } from '../../../../../services/client/shippingService'; // Đảm bảo đường dẫn đúng
import Loader from '../../../../../components/common/Loader'; // Đảm bảo đường dẫn đúng

const addressLabels = ['Nhà Riêng', 'Văn Phòng', 'Nhà Người Yêu'];

const initialFormState = {
    fullName: '',
    phone: '',
    city: '',
    cityObj: null,
    district: '',
    districtObj: null,
    ward: '',
    wardObj: null,
    streetAddress: '',
    isDefault: false,
    label: 'Nhà Riêng'
};

const AddressModal = ({ open, onClose, onSave, editingAddress, loading }) => {
    const [formData, setFormData] = useState(initialFormState);
    const [formErrors, setFormErrors] = useState({});

    const [showLocationPicker, setShowLocationPicker] = useState(false);
    const [locationPickerTab, setLocationPickerTab] = useState('city');
    const [locationSearchTerm, setLocationSearchTerm] = useState('');
    const locationPickerRef = useRef(null);
    const locationTriggerRef = useRef(null);

    const [provinceList, setProvinceList] = useState([]);
    const [districtList, setDistrictList] = useState([]);
    const [wardList, setWardList] = useState([]);

    // Fetch provinces when modal opens
    useEffect(() => {
        if (open) {
            shippingService
                .getProvinces()
                .then((res) => {
                    setProvinceList(res || []);
                })
                .catch((err) => {
                    console.error('Lỗi gọi API getProvinces:', err);
                    setProvinceList([]);
                });
        }
    }, [open]);

    // Populate form data if editing an existing address
    useEffect(() => {
        if (editingAddress && open) {
            setFormErrors({}); // Clear errors when editing
            const provObj = provinceList.find((p) => p.id === editingAddress.provinceId || p.ProvinceID === editingAddress.provinceId);

            if (provObj) {
                setFormData({
                    fullName: editingAddress.fullName || '',
                    phone: editingAddress.phone || '',
                    city: provObj.name,
                    cityObj: provObj,
                    district: '',
                    districtObj: null,
                    ward: '',
                    wardObj: null,
                    streetAddress: editingAddress.streetAddress || '',
                    isDefault: editingAddress.isDefault || false,
                    label: editingAddress.label || 'Nhà Riêng'
                });

                // Fetch districts and wards for existing address
                shippingService.getDistricts(provObj.ProvinceID || provObj.id)
                    .then((districts) => {
                        setDistrictList(districts || []);
                        const distObj = (districts || []).find((d) => d.id === editingAddress.districtId || d.DistrictID === editingAddress.districtId);
                        if (distObj) {
                            setFormData((prev) => ({ ...prev, district: distObj.name, districtObj: distObj }));
                            shippingService.getWards(distObj.DistrictID || distObj.id)
                                .then((wards) => {
                                    setWardList(wards || []);
                                    const wardObj = (wards || []).find((w) => w.id === editingAddress.wardId);
                                    if (wardObj) {
                                        setFormData((prev) => ({ ...prev, ward: wardObj.name, wardObj: wardObj }));
                                    }
                                })
                                .catch((err) => console.error('Error fetching wards for edit:', err));
                        }
                    })
                    .catch((err) => console.error('Error fetching districts for edit:', err));
            } else {
                setFormData({
                    fullName: editingAddress.fullName || '',
                    phone: editingAddress.phone || '',
                    city: '', cityObj: null,
                    district: '', districtObj: null,
                    ward: '', wardObj: null,
                    streetAddress: editingAddress.streetAddress || '',
                    isDefault: editingAddress.isDefault || false,
                    label: editingAddress.label || 'Nhà Riêng'
                });
            }
        } else if (open && !editingAddress) {
            setFormData(initialFormState); // Reset form for new address
            setFormErrors({});
            setDistrictList([]);
            setWardList([]);
        }
    }, [editingAddress, open, provinceList]); // Depend on provinceList to ensure it's loaded before processing editingAddress

    // Handle clicks outside location picker
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                locationPickerRef.current &&
                !locationPickerRef.current.contains(event.target) &&
                locationTriggerRef.current &&
                !locationTriggerRef.current.contains(event.target)
            ) {
                setShowLocationPicker(false);
            }
        }
        if (showLocationPicker) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showLocationPicker]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        setFormErrors((prev) => ({ ...prev, [name]: '' })); // Clear error when input changes
    };

    const handleLocationSelect = async (type, value) => {
        setFormErrors((prev) => ({ ...prev, city: '', district: '', ward: '' })); // Clear location errors

        if (type === 'city') {
            const selected = provinceList.find((p) => p.name === value);
            if (!selected) return;

            try {
                const districts = await shippingService.getDistricts(selected.ProvinceID || selected.id);
                setDistrictList(districts || []);
            } catch (err) {
                console.error('Error fetching districts:', err);
                setDistrictList([]);
            }

            setFormData((prev) => ({
                ...prev,
                city: selected.name,
                cityObj: selected,
                district: '',
                districtObj: null,
                ward: '',
                wardObj: null
            }));
            setLocationPickerTab('district');
            setLocationSearchTerm('');
        } else if (type === 'district') {
            const selected = districtList.find((d) => d.name === value);
            if (!selected) return;

            try {
                const wards = await shippingService.getWards(selected.DistrictID || selected.id);
                setWardList(wards || []);
            } catch (err) {
                console.error('Error fetching wards:', err);
                setWardList([]);
            }

            setFormData((prev) => ({
                ...prev,
                district: selected.name,
                districtObj: selected,
                ward: '',
                wardObj: null
            }));
            setLocationPickerTab('ward');
            setLocationSearchTerm('');
        } else if (type === 'ward') {
            const selected = wardList.find((w) => w.name === value);
            if (!selected) return;
            setFormData((prev) => ({
                ...prev,
                ward: selected.name,
                wardObj: selected
            }));
            setShowLocationPicker(false);
            setLocationSearchTerm('');
        }
    };

    const filteredLocationItems = () => {
        let items = [];
        if (locationPickerTab === 'city') items = provinceList.map((p) => p.name);
        else if (locationPickerTab === 'district') items = districtList.map((d) => d.name);
        else if (locationPickerTab === 'ward') items = wardList.map((w) => w.name);

        if (locationSearchTerm) {
            return items.filter((item) => item.toLowerCase().includes(locationSearchTerm.toLowerCase()));
        }
        return items;
    };

    const handleSave = async (e) => {
        e.preventDefault();

        const provinceId = formData.cityObj?.id || formData.cityObj?.ProvinceID;
        const districtId = formData.districtObj?.id || formData.districtObj?.DistrictID;
        const wardId = formData.wardObj?.id;

        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Họ tên không được để trống.';
        if (!formData.phone.trim()) newErrors.phone = 'Số điện thoại không được để trống.';
        if (!provinceId || !districtId || !wardId) {
            newErrors.city = 'Vui lòng chọn Tỉnh/Thành phố, Quận/Huyện và Phường/Xã.';
        }
        if (!formData.streetAddress.trim()) newErrors.streetAddress = 'Địa chỉ cụ thể không được để trống.';

        if (Object.keys(newErrors).length > 0) {
            setFormErrors(newErrors);
            return;
        }

        // Pass data and selected objects back to parent for saving
        onSave({
            ...formData,
            provinceId,
            districtId,
            wardId,
            selectedProvince: formData.cityObj,
            selectedDistrict: formData.districtObj,
            selectedWard: formData.wardObj
        });
    };

    const locationInputDisplay = [formData.city, formData.district, formData.ward].filter(Boolean).join(' / ');

    return (
        <div
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
            // THAY ĐỔI z-index TỪ z-[1000] LÊN z-[2000] HOẶC CAO HƠN
            className="fixed inset-0 flex items-center justify-center z-[2000] p-4 sm:p-6 md:p-8" // Đã thay đổi z-index
            onClick={onClose} // Close on backdrop click
        >
            <div
                className="bg-white dark:bg-gray-800 p-0 rounded-sm shadow-xl w-full max-w-md h-[80vh] sm:h-[75vh] flex flex-col"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
                <div className="flex justify-between items-center py-3 px-4 sm:px-5 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200">
                        {editingAddress ? 'Cập nhật địa chỉ' : 'Địa chỉ mới'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                    >
                        <CloseIcon size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <form id="addressFormInModal" onSubmit={handleSave} className="space-y-5 p-4 sm:p-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                            <div className="w-full">
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="Họ và tên"
                                    className={`w-full p-2.5 border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                                        formErrors.fullName ? 'border-red-500' : 'border-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                                    } dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-400`}
                                />
                                {formErrors.fullName && <p className="text-xs text-red-500 mt-1">{formErrors.fullName}</p>}
                            </div>

                            <div className="w-full">
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="Số điện thoại"
                                    className={`w-full p-2.5 border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                                        formErrors.phone ? 'border-red-500' : 'border-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                                    } dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-400`}
                                />
                                {formErrors.phone && <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="w-full">
                                <div className="relative">
                                    <input
                                        ref={locationTriggerRef}
                                        type="text"
                                        name="locationTrigger"
                                        id="locationTrigger"
                                        readOnly
                                        value={locationInputDisplay || ''}
                                        onClick={() => {
                                            setShowLocationPicker((prev) => !prev);
                                            setLocationPickerTab('city');
                                            setLocationSearchTerm('');
                                        }}
                                        placeholder="Tỉnh/Thành phố, Quận/Huyện, Phường/Xã"
                                        className={`w-full p-2.5 border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors cursor-pointer pr-10
                                            ${
                                                formErrors.city || formErrors.district || formErrors.ward
                                                    ? 'border-red-500'
                                                    : 'border-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                                            } dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-400`}
                                    />
                                    <ChevronDown
                                        size={16}
                                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none transition-transform duration-200 ${
                                            showLocationPicker ? 'rotate-180' : ''
                                        }`}
                                    />
                                </div>

                                {(formErrors.city || formErrors.district || formErrors.ward) && (
                                    <div className="mt-1 space-y-0.5">
                                        {formErrors.city && <p className="block text-xs text-red-500 mt-1">{formErrors.city}</p>}
                                        {formErrors.district && <p className="block text-xs text-red-500 mt-0.5">{formErrors.district}</p>}
                                        {formErrors.ward && <p className="block text-xs text-red-500 mt-0.5">{formErrors.ward}</p>}
                                    </div>
                                )}
                            </div>

                            {showLocationPicker && (
                                <div
                                    ref={locationPickerRef}
                                    className="absolute top-full mt-px left-0 w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-sm shadow-lg z-30 max-h-72 flex flex-col"
                                >
                                    <div className="flex border-b border-gray-200 dark:border-gray-600 flex-shrink-0">
                                        {[
                                            { key: 'city', label: 'Tỉnh/Thành phố' },
                                            { key: 'district', label: 'Quận/Huyện' },
                                            { key: 'ward', label: 'Phường/Xã' }
                                        ].map((tab) => (
                                            <button
                                                type="button"
                                                key={tab.key}
                                                onClick={() => {
                                                    if (tab.key === 'district' && !formData.city) return;
                                                    if (tab.key === 'ward' && !formData.district) return;
                                                    setLocationPickerTab(tab.key);
                                                    setLocationSearchTerm('');
                                                }}
                                                disabled={(tab.key === 'district' && !formData.city) || (tab.key === 'ward' && !formData.district)}
                                                className={`flex-1 py-2 px-2 text-sm font-medium focus:outline-none transition-colors
                                                    ${locationPickerTab === tab.key ? 'text-primary border-b-2 border-primary' : 'text-gray-600 dark:text-gray-300 hover:text-primary/80 dark:hover:text-blue-400/80'}
                                                    ${(tab.key === 'district' && !formData.city) || (tab.key === 'ward' && !formData.district) ? 'text-gray-300 dark:text-gray-500 cursor-not-allowed hover:text-gray-300 dark:hover:text-gray-500' : ''}
                                                `}
                                            >
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="p-2 border-b border-gray-200 dark:border-gray-600 flex-shrink-0">
                                        <div className="relative">
                                            <SearchIcon
                                                size={16}
                                                className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Tìm kiếm..."
                                                value={locationSearchTerm}
                                                onChange={(e) => setLocationSearchTerm(e.target.value)}
                                                className="w-full py-1.5 pl-8 pr-2 border border-gray-300 dark:border-gray-600 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:ring-blue-500/50 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200 transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <ul className="overflow-y-auto flex-1">
                                        {filteredLocationItems().map((item) => (
                                            <li
                                                key={item}
                                                onClick={() => handleLocationSelect(locationPickerTab, item)}
                                                className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                                            >
                                                {item}
                                            </li>
                                        ))}
                                        {filteredLocationItems().length === 0 && (
                                            <li className="px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 text-center">Không tìm thấy kết quả.</li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                name="streetAddress"
                                value={formData.streetAddress}
                                onChange={handleInputChange}
                                placeholder="Địa chỉ cụ thể"
                                className={`w-full p-2.5 border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                                    formErrors.streetAddress ? 'border-red-500' : 'border-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                                } dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-400`}
                            />
                            {formErrors.streetAddress && <p className="text-xs text-red-500 mt-1">{formErrors.streetAddress}</p>}
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Ví dụ: Số nhà 123, Tên đường (Tên tòa nhà)</p>
                        </div>

                        <div className="flex items-center space-x-3 pt-0.5">
                            <span className="text-sm text-gray-700 dark:text-gray-200">Loại địa chỉ:</span>
                            <div className="flex items-center flex-wrap gap-3">
                                {addressLabels.map((option) => (
                                    <label key={option} className="flex items-center text-sm text-gray-700 dark:text-gray-200 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="label"
                                            value={option}
                                            checked={formData.label === option}
                                            onChange={handleInputChange}
                                            className="form-radio text-primary border-gray-300 dark:border-gray-600 focus:ring-primary mr-1.5 focus:ring-blue-500/50"
                                        />
                                        {option}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center pt-1">
                            <input
                                type="checkbox"
                                name="isDefault"
                                id="isDefaultAddressModal"
                                checked={formData.isDefault}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-primary border-gray-300 dark:border-gray-600 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:ring-blue-500/50 mr-2"
                            />
                            <label htmlFor="isDefaultAddressModal" className="text-sm text-gray-700 dark:text-gray-200 cursor-pointer hover:text-gray-900 dark:hover:text-gray-50">
                                Đặt làm địa chỉ mặc định
                            </label>
                        </div>
                    </form>
                </div>

                <div className="flex-shrink-0 py-3 px-4 sm:px-5 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2.5 bg-white dark:bg-gray-800">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-sm border border-gray-300 dark:border-gray-600 transition-colors"
                    >
                        Trở Lại
                    </button>
                    <button
                        type="submit"
                        form="addressFormInModal"
                        className="px-5 py-1.5 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-sm transition-colors"
                    >
                        {editingAddress ? 'Lưu' : 'Hoàn thành'}
                    </button>
                </div>
            </div>
            {loading && <Loader fullscreen />}
        </div>
    );
};

export default AddressModal;