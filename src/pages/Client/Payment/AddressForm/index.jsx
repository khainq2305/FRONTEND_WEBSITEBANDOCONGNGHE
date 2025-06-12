import React, { useState, useEffect } from 'react';
import { shippingService } from '../../../../services/client/shippingService';
import { userAddressService } from '../../../../services/client/userAddressService';
import { toast } from 'react-toastify';
import { Listbox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

const AddressForm = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        fullName: '', phone: '', streetAddress: '', isDefault: false, label: 'Nhà Riêng'
    });
    
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
    const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
    const [isLoadingWards, setIsLoadingWards] = useState(false);

    useEffect(() => {
        const fetchProvinces = async () => {
    setIsLoadingProvinces(true);
    try {
        const data = await shippingService.getProvinces();
        console.log("📌 Provinces API trả về:", data); // <== Thêm dòng này
        if (data && data.length > 0) {
            setProvinces(data);
        } else {
            toast.error("Không có dữ liệu tỉnh/thành để hiển thị.");
        }
    } catch (error) {
        console.error("LỖI KHI TẢI TỈNH/THÀNH PHỐ:", error);
        toast.error("Không thể tải danh sách Tỉnh/Thành phố.");
        setProvinces([]);
    } finally {
        setIsLoadingProvinces(false);
    }
};

        fetchProvinces();
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            const fetchDistricts = async () => {
                setIsLoadingDistricts(true);
                setDistricts([]); setWards([]); setSelectedDistrict(null); setSelectedWard(null);
                try {
                    const data = await shippingService.getDistricts(selectedProvince.id);

                    setDistricts(data || []);
                } catch (error) {
                    console.error("LỖI KHI TẢI QUẬN/HUYỆN:", error);
                    toast.error("Không thể tải danh sách Quận/Huyện.");
                } finally {
                    setIsLoadingDistricts(false);
                }
            };
            fetchDistricts();
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedDistrict) {
            const fetchWards = async () => {
                setIsLoadingWards(true);
                setWards([]); setSelectedWard(null);
                try {
                   const data = await shippingService.getWards(selectedDistrict.id);

                    setWards(data || []);
                } catch (error) {
                    console.error("LỖI KHI TẢI PHƯỜNG/XÃ:", error);
                    toast.error("Không thể tải danh sách Phường/Xã.");
                } finally {
                    setIsLoadingWards(false);
                }
            };
            fetchWards();
        }
    }, [selectedDistrict]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSelectChange = (e, type) => {
        const selectedId = e.target.value;
        if (!selectedId) return;

        if (type === 'province') {
  const province = provinces.find(p => p.id === Number(selectedId)); // ✅ FIXED
  setSelectedProvince(province);
}
else if (type === 'district') {
  const district = districts.find(d => d.id === Number(selectedId));
  setSelectedDistrict(district);
}else if (type === 'ward') {
  const ward = wards.find(w => String(w.code) === selectedId); // nếu code là string
  setSelectedWard(ward);
}


    };

    const validate = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = "Vui lòng nhập họ tên.";
        if (!/^(0\d{9,10})$/.test(formData.phone)) newErrors.phone = "Số điện thoại không hợp lệ.";
        if (!selectedProvince) newErrors.province = "Vui lòng chọn Tỉnh/Thành phố.";
        if (!selectedDistrict) newErrors.district = "Vui lòng chọn Quận/Huyện.";
    if (!selectedWard || !selectedWard.code)
  newErrors.ward = "Vui lòng chọn Phường/Xã.";


        if (!formData.streetAddress.trim()) newErrors.streetAddress = "Vui lòng nhập địa chỉ cụ thể.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate() || isSubmitting) return;

        setIsSubmitting(true);
        const addressData = {
  ...formData,
  provinceId: selectedProvince.id,       // ✅ ĐÚNG!
  districtId: selectedDistrict.id,       // ✅ ĐÚNG!
wardCode: selectedWard.code,
           // hoặc selectedWard.code nếu BE cần mã GHN
};


        try {
            await userAddressService.create(addressData);
            toast.success("Đã thêm địa chỉ mới!");
            onSave();
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi tạo địa chỉ.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderError = (fieldName) => errors[fieldName] && <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>;

    return (
        <form onSubmit={handleSubmit} className="space-y-4 transition-all duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <input type="text" name="fullName" placeholder="Họ và tên" value={formData.fullName} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500" />
                    {renderError('fullName')}
                </div>
                <div>
                    <input type="tel" name="phone" placeholder="Số điện thoại" value={formData.phone} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500" />
                    {renderError('phone')}
                </div>
            </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {/* Tỉnh / Thành phố */}
  <div>
    <Listbox value={selectedProvince} onChange={(val) => setSelectedProvince(val)}>
      <div className="relative">
        <Listbox.Button className="w-full cursor-default border border-gray-300 rounded-md bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500">
          <span className="block truncate">
            {isLoadingProvinces ? 'Đang tải...' : selectedProvince?.name || 'Chọn Tỉnh/Thành'}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
          </span>
        </Listbox.Button>
        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none text-sm">
          {provinces.map((province) => (
            <Listbox.Option
              key={province.id}
              value={province}
              className={({ active }) =>
                `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                  active ? 'bg-sky-100 text-sky-900' : 'text-gray-900'
                }`
              }
            >
              {({ selected }) => (
                <>
                  <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                    {province.name}
                  </span>
                  {selected && (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sky-600">
                      <CheckIcon className="h-5 w-5" />
                    </span>
                  )}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
    {renderError('province')}
  </div>

  {/* Quận / Huyện */}
  <div>
    <Listbox
      value={selectedDistrict}
      onChange={(val) => setSelectedDistrict(val)}
      disabled={!selectedProvince || isLoadingDistricts}
    >
      <div className="relative">
        <Listbox.Button className="w-full cursor-default border border-gray-300 rounded-md bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 disabled:bg-gray-100">
          <span className="block truncate">
            {isLoadingDistricts ? 'Đang tải...' : selectedDistrict?.name || 'Chọn Quận/Huyện'}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
          </span>
        </Listbox.Button>
        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none text-sm">
          {districts.map((district) => (
            <Listbox.Option
              key={district.id}
              value={district}
              className={({ active }) =>
                `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                  active ? 'bg-sky-100 text-sky-900' : 'text-gray-900'
                }`
              }
            >
              {({ selected }) => (
                <>
                  <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                    {district.name}
                  </span>
                  {selected && (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sky-600">
                      <CheckIcon className="h-5 w-5" />
                    </span>
                  )}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
    {renderError('district')}
  </div>

  {/* Phường / Xã */}
  <div>
    <Listbox
      value={selectedWard}
      onChange={(val) => setSelectedWard(val)}
      disabled={!selectedDistrict || isLoadingWards}
    >
      <div className="relative">
        <Listbox.Button className="w-full cursor-default border border-gray-300 rounded-md bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 disabled:bg-gray-100">
          <span className="block truncate">
            {isLoadingWards ? 'Đang tải...' : selectedWard?.name || 'Chọn Phường/Xã'}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
          </span>
        </Listbox.Button>
        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none text-sm">
          {wards.map((ward) => (
            <Listbox.Option
              key={ward.code}
              value={ward}
              className={({ active }) =>
                `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                  active ? 'bg-sky-100 text-sky-900' : 'text-gray-900'
                }`
              }
            >
              {({ selected }) => (
                <>
                  <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                    {ward.name}
                  </span>
                  {selected && (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sky-600">
                      <CheckIcon className="h-5 w-5" />
                    </span>
                  )}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
    {renderError('ward')}
  </div>
</div>

            <div>
                <input type="text" name="streetAddress" placeholder="Số nhà, tên đường" value={formData.streetAddress} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500" />
                {renderError('streetAddress')}
            </div>
            <div className="flex justify-between items-center pt-2">
                <button type="submit" disabled={isSubmitting} className="bg-sky-500 text-white font-semibold py-2 px-6 rounded-md hover:bg-sky-600 disabled:bg-sky-300">
                    {isSubmitting ? 'Đang lưu...' : 'Hoàn thành'}
                </button>
                {onCancel && <button type="button" onClick={onCancel} className="text-sm text-gray-600 hover:text-black">Quay lại</button>}
            </div>
        </form>
    );
};
export default AddressForm;