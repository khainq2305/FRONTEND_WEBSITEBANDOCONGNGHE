// AddressPageContent.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Plus, ChevronDown, Search as SearchIcon, X as CloseIcon } from 'lucide-react';
import { shippingService } from '../../../../services/client/shippingService';
import { userAddressService } from '../../../../services/client/userAddressService';
import SuccessModal from '../SuccessModal';
import { confirmDelete } from '../../../../components/common/ConfirmDeleteDialog';
import Loader from '../../../../components/common/Loader';

const sortAddresses = (addressList) => {
  if (!addressList) return [];
  const sorted = [...addressList];
  sorted.sort((a, b) => {
    if (a.isDefault && !b.isDefault) return -1;
    if (!a.isDefault && b.isDefault) return 1;

    return 0;
  });
  return sorted;
};
const getAddressIcon = (label) => {
  if (!label) return 'src/assets/Client/images/Logo/pngtree-vector-house-icon-png-image_3996106.jpg';
  switch (label.toLowerCase()) {
    case 'nhà riêng':
      return 'src/assets/Client/images/Logo/pngtree-vector-house-icon-png-image_3996106.jpg';
    case 'văn phòng':
      return 'src/assets/Client/images/pngtree-factory-icon-for-personal-and-commercial-use-png-image_1044904.jpg';
    case 'nhà người yêu':
      return 'src/assets/Client/images/Logo/nhanguoiyeu.png';
    default:
      return 'src/assets/Client/images/Logo/pngtree-vector-house-icon-png-image_3996106.jpg';
  }
};

const AddressItem = ({ address, isDefault, onSetDefault, onUpdate, onDelete }) => {
  return (
    <div className={`p-4 sm:p-5 ${isDefault ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-white dark:bg-gray-800'}`}>
      <div className="flex flex-col sm:flex-row justify-between">
        <div className="flex flex-1 mb-3 sm:mb-0 sm:mr-4 items-start">
          <img
            src={getAddressIcon(address.label || address.label)}
            alt="icon"
            className="w-10 h-10 rounded-full border border-gray-200 mr-3 object-cover flex-shrink-0"
          />
          <div className="flex flex-col">
            <div className="flex items-center mb-1.5">
              <span className="font-semibold text-gray-800 dark:text-gray-200 text-base mr-2 sm:mr-3 truncate">{address.fullName}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 sm:border-l sm:border-gray-300 dark:sm:border-gray-600 sm:pl-2 sm:ml-1">
                (+84) {String(address.phone || '').substring(1)}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-0.5">{address.streetAddress}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {`${address.ward?.name || ''}${address.ward?.name && (address.district?.name || address.province?.name) ? ', ' : ''}${address.district?.name || ''}${address.district?.name && address.province?.name ? ', ' : ''}${address.province?.name || ''}`}
            </p>
            {isDefault && (
              <span className="mt-1.5 inline-flex text-xs border border-primary text-primary px-1.5 py-0.5 rounded-sm w-fit">Mặc định</span>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 flex sm:flex-col items-start sm:items-end justify-between sm:justify-start">
          <div className="flex mb-0 sm:mb-2.5">
            <button
              onClick={() => onUpdate(address.id)}
              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mr-3 sm:mr-4"
            >
              Cập nhật
            </button>
            {!isDefault && (
              <button
                onClick={() => onDelete(address.id)}
                className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Xóa
              </button>
            )}
          </div>
          <button
            onClick={() => onSetDefault(address.id)}
            disabled={isDefault}
            className={`text-xs border px-2.5 py-1 rounded-sm transition-colors ${isDefault ? 'bg-gray-200 text-gray-500 border-gray-200 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400 dark:border-gray-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:border-gray-500'}`}
          >
            Thiết lập mặc định
          </button>
        </div>
      </div>
    </div>
  );
};

const AddressPageContent = () => {
  const addressLabels = ['Nhà Riêng', 'Văn Phòng', 'Nhà Người Yêu'];
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [addresses, setAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
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

  const [formData, setFormData] = useState(initialFormState);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [locationPickerTab, setLocationPickerTab] = useState('city');
  const [locationSearchTerm, setLocationSearchTerm] = useState('');
  const locationPickerRef = useRef(null);
  const locationTriggerRef = useRef(null);
  const addressInputRef = useRef(null);

  const [successMessage, setSuccessMessage] = useState('');

  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (showAddressModal) {
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
  }, [showAddressModal]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await userAddressService.getList();
        setAddresses(sortAddresses(res.data.data || [])); 
      } catch (err) {
        console.error('Lỗi khi lấy địa chỉ:', err);
        setAddresses([]); 
      }
    };
    fetchAddresses();
  }, []);

  useEffect(() => {
    if (showAddressModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAddressModal]);

  useEffect(() => {
    if (editingAddress) {
      if (showAddressModal && provinceList.length > 0) {
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

          shippingService
            .getDistricts(provObj.ProvinceID || provObj.id)
            .then((districts) => {
              setDistrictList(districts || []);
              const distObj = (districts || []).find(
                (d) => d.id === editingAddress.districtId || d.DistrictID === editingAddress.districtId
              );
              if (distObj) {
                setFormData((prev) => ({ ...prev, district: distObj.name, districtObj: distObj }));
                shippingService
                  .getWards(distObj.DistrictID || distObj.id)
                  .then((wards) => {
                    setWardList(wards || []);
                    const wardObj = (wards || []).find((w) => w.code === editingAddress.wardCode || w.WardCode === editingAddress.wardCode);
                    if (wardObj) {
                      setFormData((prev) => ({ ...prev, ward: wardObj.name, wardObj: wardObj }));
                    } else {
                      setFormData((prev) => ({ ...prev, ward: '', wardObj: null }));
                    }
                  })
                  .catch((err) => {
                    console.error('Error fetching wards for edit:', err);
                    setFormData((prev) => ({ ...prev, ward: '', wardObj: null }));
                    setWardList([]);
                  });
              } else {
                setFormData((prev) => ({ ...prev, district: '', districtObj: null, ward: '', wardObj: null }));
                setWardList([]);
              }
            })
            .catch((err) => {
              console.error('Error fetching districts for edit:', err);
              setFormData((prev) => ({ ...prev, district: '', districtObj: null, ward: '', wardObj: null }));
              setDistrictList([]);
              setWardList([]);
            });
        } else {
          setFormData({
            fullName: editingAddress.fullName || '',
            phone: editingAddress.phone || '',
            city: '',
            cityObj: null,
            district: '',
            districtObj: null,
            ward: '',
            wardObj: null,
            streetAddress: editingAddress.streetAddress || '',
            isDefault: editingAddress.isDefault || false,
            label: editingAddress.label || 'Nhà Riêng'
          });
          setDistrictList([]);
          setWardList([]);
        }
      } else if (showAddressModal && editingAddress) {
        // Added editingAddress check here
        setFormData({
          fullName: editingAddress.fullName || '',
          phone: editingAddress.phone || '',
          city: '',
          cityObj: null,
          district: '',
          districtObj: null,
          ward: '',
          wardObj: null,
          streetAddress: editingAddress.streetAddress || '',
          isDefault: editingAddress.isDefault || false,
          label: editingAddress.label || 'Nhà Riêng'
        });
      }
    }
  }, [editingAddress, showAddressModal, provinceList]);

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
  };

  const handleLocationSelect = async (type, value) => {
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

  const handleSetDefault = async (id) => {
    if (!id) {
      console.error('❌ ID không hợp lệ:', id);
      alert('ID không hợp lệ khi thiết lập mặc định.');
      return;
    }

    try {
      await userAddressService.setDefault(id);
      setAddresses((prevAddresses) => {
        const newAddresses = prevAddresses.map((addr) => ({
          ...addr,
          isDefault: addr.id === id
        }));
        return sortAddresses(newAddresses);
      });
      setSuccessMessage('Địa chỉ mặc định đã được cập nhật!');
    } catch (err) {
      console.error('Lỗi khi thiết lập mặc định:', err);
      alert('Có lỗi xảy ra khi thiết lập địa chỉ mặc định.');
    }
  };

  const handleUpdate = (id) => {
    const addressToEdit = addresses.find((addr) => addr.id === id);
    setEditingAddress(addressToEdit);
    setShowAddressModal(true);
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmDelete('xoá', 'địa chỉ này');
    if (!confirmed) return;

    try {
      setLoading(true);
      await userAddressService.remove(id);
      const newAddresses = addresses.filter((addr) => addr.id !== id);
      setAddresses(sortAddresses(newAddresses));
      setSuccessMessage('Xóa địa chỉ thành công!');
    } catch (err) {
      console.error('Lỗi khi xóa địa chỉ:', err);
      alert('Có lỗi xảy ra khi xóa địa chỉ.');
    } finally {
      setLoading(false);
    }
  };

  const closeModalAndPicker = () => {
    setShowAddressModal(false);
    setEditingAddress(null);
    setShowLocationPicker(false);
    setFormData(initialFormState); 
  };

  const handleOpenNewAddressModal = () => {
    setEditingAddress(null);
    setFormData(initialFormState);
    setShowAddressModal(true);
    setShowLocationPicker(false);
    setDistrictList([]); 
    setWardList([]);
  };

  const handleCloseModalOnBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModalAndPicker();
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();

    setLoading(true);
    const provinceId = formData.cityObj?.id || formData.cityObj?.ProvinceID;
    const districtId = formData.districtObj?.id || formData.districtObj?.DistrictID;
    const wardCode = formData.wardObj?.code || formData.wardObj?.WardCode;

    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Họ tên không được để trống.';
    if (!formData.phone.trim()) newErrors.phone = 'Số điện thoại không được để trống.';
    if (!provinceId || !districtId || !wardCode) {
      newErrors.city = 'Vui lòng nhập Tỉnh/Thành phố, Quận/Huyện và Phường/Xã';
    }
    if (!formData.streetAddress.trim()) newErrors.streetAddress = 'Địa chỉ cụ thể không được để trống.';

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      setLoading(false);
      return;
    }

    const selectedProvince = formData.cityObj;
    const selectedDistrict = formData.districtObj;
    const selectedWard = formData.wardObj;

    const autoSetDefault = addresses.length === 0;

    const addressDataToSave = {
      fullName: formData.fullName,
      phone: formData.phone,
      streetAddress: formData.streetAddress,
      provinceId,
      districtId,
      wardCode,
      isDefault: autoSetDefault ? true : formData.isDefault,
      label: formData.label
    };

    try {
      if (editingAddress) {
        await userAddressService.update(editingAddress.id, addressDataToSave);
        setAddresses((prev) =>
          sortAddresses(
            prev.map((addr) =>
              addr.id === editingAddress.id
                ? { ...addr, ...addressDataToSave, province: selectedProvince, district: selectedDistrict, ward: selectedWard }
                : addressDataToSave.isDefault
                  ? { ...addr, isDefault: false }
                  : addr
            )
          )
        );
        setSuccessMessage('Cập nhật địa chỉ thành công!');
      } else {
        const res = await userAddressService.create(addressDataToSave);
        const newAddress = {
          id: res.data.id,
          ...addressDataToSave,
          province: selectedProvince,
          district: selectedDistrict,
          ward: selectedWard
        };
        setAddresses((prev) => {
          let newList = [...prev];
          if (newAddress.isDefault) newList = newList.map((a) => ({ ...a, isDefault: false }));
          return sortAddresses([...newList, newAddress]);
        });
        setSuccessMessage('Đã thêm địa chỉ mới thành công!');
      }
      closeModalAndPicker();
    } catch (err) {
      console.error('Lỗi khi lưu địa chỉ:', err);
      if (err.response?.status === 400 && err.response?.data?.errors) {
        const apiErrors = {};
        err.response.data.errors.forEach((err) => {
          apiErrors[err.field] = err.message;
        });
        setFormErrors(apiErrors);
      } else {
        alert('Có lỗi xảy ra khi lưu địa chỉ. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const locationInputDisplay = [formData.city, formData.district, formData.ward].filter(Boolean).join(' / ');

  return (
    <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 shadow-sm rounded-md border border-gray-200 dark:border-gray-700 min-h-[calc(100vh-150px)]">
      <div className="flex justify-between items-center mb-4 sm:mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
        {' '}
        {/* Restored border-b */}
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200">Địa chỉ của tôi</h1>
        <button
          onClick={handleOpenNewAddressModal}
          className="flex items-center bg-primary hover-primary text-white text-xs sm:text-sm font-medium py-2 px-3 sm:px-4 rounded-sm transition-colors"
        >
          <Plus size={16} className="mr-1 sm:mr-1.5" /> Thêm địa chỉ mới
        </button>
      </div>

      {addresses.length > 0 ? (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {' '}
          {/* Removed extra border-t from here for cleaner look with AddressItem's own structure */}
          {addresses.map((addr) => (
            <AddressItem
              key={addr.id}
              address={addr}
              isDefault={addr.isDefault}
              onSetDefault={handleSetDefault}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          {' '}
          <p>Bạn chưa có địa chỉ nào.</p>{' '}
        </div>
      )}

      {showAddressModal && (
        <div
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
          className="fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-6 md:p-8"
          onClick={handleCloseModalOnBackdropClick}
        >
          <div
            className="bg-white dark:bg-gray-800 p-0 rounded-sm shadow-xl w-full max-w-md h-[80vh] sm:h-[75vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center py-3 px-4 sm:px-5 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200">
                {editingAddress ? 'Cập nhật địa chỉ' : 'Địa chỉ mới'}
              </h2>
              <button
                onClick={closeModalAndPicker}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                {' '}
                <CloseIcon size={20} />{' '}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <form id="addressFormInModal" onSubmit={handleSaveAddress} className="space-y-5 p-4 sm:p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                  <div className="w-full">
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Họ và tên"
                      className={`w-full p-2.5 border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                        formErrors.fullName ? 'border-red-500' : 'border-gray-300'
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
                      className={`w-full p-2.5 border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                        formErrors.phone ? 'border-red-500' : 'border-gray-300'
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
                        className={`w-full p-2.5 border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                          formErrors.city || formErrors.district || formErrors.ward ? 'border-red-500' : 'border-gray-300'
                        } dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 cursor-pointer pr-10 placeholder-gray-400 dark:placeholder-gray-400`}
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
                            className={`flex-1 py-2 px-2 text-sm font-medium focus:outline-none
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
                            className="w-full py-1.5 pl-8 pr-2 border border-gray-300 dark:border-gray-600 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:ring-blue-500/50 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                          />
                        </div>
                      </div>
                      <ul className="overflow-y-auto flex-1">
                        {filteredLocationItems().map((item) => (
                          <li
                            key={item}
                            onClick={() => handleLocationSelect(locationPickerTab, item)}
                            className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-600 cursor-pointer"
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
                    className={`w-full p-2.5 border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                      formErrors.streetAddress ? 'border-red-500' : 'border-gray-300'
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
                          className="form-radio text-primary focus:ring-primary mr-1.5"
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
                  <label htmlFor="isDefaultAddressModal" className="text-sm text-gray-700 dark:text-gray-200">
                    Đặt làm địa chỉ mặc định
                  </label>
                </div>
              </form>
            </div>

            <div className="flex-shrink-0 py-3 px-4 sm:px-5 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2.5 bg-white dark:bg-gray-800">
              <button
                type="button"
                onClick={closeModalAndPicker}
                className="px-5 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-sm border border-gray-300 dark:border-gray-600"
              >
                Trở Lại
              </button>
              <button
                type="submit"
                form="addressFormInModal"
                className="px-5 py-1.5 text-sm font-medium text-white bg-primary hover-primary rounded-sm"
              >
                {editingAddress ? 'Lưu' : 'Hoàn thành'}
              </button>
            </div>
          </div>
          {loading && <Loader fullscreen />}
        </div>
      )}
      {successMessage && <SuccessModal message={successMessage} onClose={() => setSuccessMessage('')} />}
    </div>
  );
};

export default AddressPageContent;
