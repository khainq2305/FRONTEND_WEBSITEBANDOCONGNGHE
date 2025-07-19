import React, { useState, useEffect } from 'react';
import { shippingService } from '../../../../services/client/shippingService';
import { userAddressService } from '../../../../services/client/userAddressService';
import { toast } from 'react-toastify';
import { Listbox, Transition } from '@headlessui/react'; // Import Transition
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Fragment } from 'react'; // Import Fragment

const AddressForm = ({ onSave, onCancel }) => {
  /* ------------------------ LOCAL STATE ------------------------ */
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    streetAddress: '',
    isDefault: false,
    label: 'Nhà Riêng', // Giá trị mặc định
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [loading, setLoading] = useState({
    provinces: false,
    districts: false,
    wards: false,
  });

  // Các lựa chọn cho label địa chỉ
  const addressLabels = ['Nhà Riêng', 'Công Ty', 'Khác'];

  /* ---------------------- FETCH LOCATION ----------------------- */
  /* Tỉnh/Thành */
  useEffect(() => {
    (async () => {
      setLoading((s) => ({ ...s, provinces: true }));
      try {
        const data = await shippingService.getProvinces();
        setProvinces(data || []);
      } catch (e) {
        console.error('[Province]', e);
        toast.error('Không thể tải Tỉnh/Thành phố.');
      } finally {
        setLoading((s) => ({ ...s, provinces: false }));
      }
    })();
  }, []);

  /* Quận/Huyện */
  useEffect(() => {
    if (!selectedProvince) return;
    (async () => {
      setLoading((s) => ({ ...s, districts: true }));
      setDistricts([]);
      setWards([]);
      setSelectedDistrict(null);
      setSelectedWard(null);
      try {
        const data = await shippingService.getDistricts(selectedProvince.id);
        setDistricts(data || []);
      } catch (e) {
        console.error('[District]', e);
        toast.error('Không thể tải Quận/Huyện.');
      } finally {
        setLoading((s) => ({ ...s, districts: false }));
      }
    })();
  }, [selectedProvince]);

  /* Phường/Xã */
  useEffect(() => {
    if (!selectedDistrict) return;
    (async () => {
      setLoading((s) => ({ ...s, wards: true }));
      setWards([]);
      setSelectedWard(null);
      try {
        const data = await shippingService.getWards(selectedDistrict.id);
        setWards(data || []);
      } catch (e) {
        console.error('[Ward]', e);
        toast.error('Không thể tải Phường/Xã.');
      } finally {
        setLoading((s) => ({ ...s, wards: false }));
      }
    })();
  }, [selectedDistrict]);

  /* ----------------------- HANDLERS ---------------------------- */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleLabelChange = (value) => {
    setFormData((prev) => ({ ...prev, label: value }));
  };

  /* ----------------------- VALIDATION -------------------------- */
  const validate = () => {
    const newErr = {};

    if (!formData.fullName.trim()) newErr.fullName = 'Vui lòng nhập họ tên.';
    if (!/^0\d{9}$/.test(formData.phone.trim()))
      newErr.phone = 'Số điện thoại phải đủ 10 số và bắt đầu bằng 0.';
    if (!selectedProvince) newErr.province = 'Vui lòng chọn Tỉnh/Thành phố.';
    if (!selectedDistrict) newErr.district = 'Vui lòng chọn Quận/Huyện.';
    if (!selectedWard) newErr.ward = 'Vui lòng chọn Phường/Xã.';
    if (!formData.streetAddress.trim()) newErr.streetAddress = 'Vui lòng nhập địa chỉ cụ thể.';
    if (!formData.label.trim()) newErr.label = 'Vui lòng chọn loại địa chỉ.'; // Thêm validation cho label

    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  /* ------------------------ SUBMIT ----------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || !validate()) return;

    setIsSubmitting(true);
    try {
      await userAddressService.create({
        ...formData,
        provinceId: selectedProvince.id,
        districtId: selectedDistrict.id,
        wardId: selectedWard.id, // BE cần ID nội bộ của Phường/Xã
      });

      toast.success('Đã thêm địa chỉ mới!');
      onSave(); // refetch list ở component cha
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi khi tạo địa chỉ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------------------- RENDER HELPERS ----------------------- */
  const renderError = (field) =>
    errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>;

 const boxClass = (hasErr, disabled) =>
  `w-full cursor-default border rounded-md bg-white py-2 pl-3 pr-10 text-left
   focus:outline-none transition
   ${disabled ? 'bg-gray-100' : 'focus:ring-1 focus:ring-sky-300'}
   ${hasErr ? 'border-red-300' : 'border-gray-200'} hover:border-gray-300`;

  /* -------------------------- JSX ------------------------------ */
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Họ tên & Điện thoại */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <input
            autoComplete="off"
            type="text"
            name="fullName"
            placeholder="Họ và tên"
            value={formData.fullName}
            onChange={handleInputChange}
            className={`w-full border rounded-md px-3 py-2 focus:outline-none ${
              errors.fullName ? 'border-red-500' : 'border-gray-300 focus:ring-1 focus:ring-sky-500'
            }`}
          />
          {renderError('fullName')}
        </div>
        <div>
          <input
            autoComplete="off"
            type="tel"
            name="phone"
            placeholder="Số điện thoại"
            value={formData.phone}
            onChange={handleInputChange}
            className={`w-full border rounded-md px-3 py-2 focus:outline-none ${
              errors.phone ? 'border-red-500' : 'border-gray-300 focus:ring-1 focus:ring-sky-500'
            }`}
          />
          {renderError('phone')}
        </div>
      </div>

      {/* Tỉnh / Quận / Phường */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Province */}
        <div>
          <Listbox value={selectedProvince} onChange={setSelectedProvince}>
            <div className="relative">
              <Listbox.Button className={boxClass(!!errors.province, loading.provinces)}>
                <span className="block truncate">
                  {loading.provinces
                    ? 'Đang tải...'
                    : selectedProvince?.name || 'Chọn Tỉnh/Thành'}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none text-sm">
                  {provinces.map((p) => (
                    <Listbox.Option
                      key={p.id}
                      value={p}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-sky-100 text-sky-900' : 'text-gray-900'
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {p.name}
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
              </Transition>
            </div>
          </Listbox>
          {renderError('province')}
        </div>

        {/* District */}
        <div>
          <Listbox
            value={selectedDistrict}
            onChange={setSelectedDistrict}
            disabled={!selectedProvince || loading.districts}
          >
            <div className="relative">
              <Listbox.Button
                className={boxClass(!!errors.district, !selectedProvince || loading.districts)}
              >
                <span className="block truncate">
                  {loading.districts
                    ? 'Đang tải...'
                    : selectedDistrict?.name || 'Chọn Quận/Huyện'}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none text-sm">
                  {districts.map((d) => (
                    <Listbox.Option
                      key={d.id}
                      value={d}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-sky-100 text-sky-900' : 'text-gray-900'
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {d.name}
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
              </Transition>
            </div>
          </Listbox>
          {renderError('district')}
        </div>

        {/* Ward */}
        <div>
          <Listbox
            value={selectedWard}
            onChange={setSelectedWard}
            disabled={!selectedDistrict || loading.wards}
          >
            <div className="relative">
              <Listbox.Button
                className={boxClass(!!errors.ward, !selectedDistrict || loading.wards)}
              >
                <span className="block truncate">
                  {loading.wards ? 'Đang tải...' : selectedWard?.name || 'Chọn Phường/Xã'}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none text-sm">
                  {wards.map((w) => (
                    <Listbox.Option
                      key={w.id} // Sửa key từ w.code sang w.id nếu BE trả về id
                      value={w}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-sky-100 text-sky-900' : 'text-gray-900'
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {w.name}
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
              </Transition>
            </div>
          </Listbox>
          {renderError('ward')}
        </div>
      </div>

      {/* Địa chỉ chi tiết */}
      <div>
        <input
          autoComplete="off"
          type="text"
          name="streetAddress"
          placeholder="Số nhà, tên đường"
          value={formData.streetAddress}
          onChange={handleInputChange}
          className={`w-full border rounded-md px-3 py-2 focus:outline-none ${
            errors.streetAddress
              ? 'border-red-500'
              : 'border-gray-300 focus:ring-1 focus:ring-sky-500'
          }`}
        />
        {renderError('streetAddress')}
      </div>

      {/* Label địa chỉ */}
      <div>
        <Listbox value={formData.label} onChange={handleLabelChange}>
          <div className="relative">
            <Listbox.Button className={boxClass(!!errors.label, false)}>
              <span className="block truncate">{formData.label || 'Chọn loại địa chỉ'}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none text-sm">
                {addressLabels.map((labelOption, index) => (
                  <Listbox.Option
                    key={index}
                    value={labelOption}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-sky-100 text-sky-900' : 'text-gray-900'
                      }`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {labelOption}
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
            </Transition>
          </div>
        </Listbox>
        {renderError('label')}
      </div>

      {/* Checkbox "Đặt làm mặc định" */}
      <div className="flex items-center">
        <input
          id="isDefault"
          name="isDefault"
          type="checkbox"
          checked={formData.isDefault}
          onChange={handleInputChange}
          className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
        />
        <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900 cursor-pointer">
          Đặt làm địa chỉ mặc định
        </label>
      </div>

      {/* BTN */}
      <div className="flex justify-between items-center pt-2">
        <button
          type="submit"
          disabled={isSubmitting || Object.values(loading).some(Boolean)}
          className="bg-sky-500 disabled:opacity-60 text-white font-semibold py-2 px-6 rounded-md hover:bg-sky-600"
        >
          {isSubmitting ? 'Đang lưu...' : 'Hoàn thành'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-sm text-gray-600 hover:text-black">
            Quay lại
          </button>
        )}
      </div>
    </form>
  );
};

export default AddressForm;