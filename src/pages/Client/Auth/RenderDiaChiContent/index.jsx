// AddressPageContent.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Plus, ChevronDown, Search as SearchIcon, X as CloseIcon } from 'lucide-react';
import { shippingService } from '../../../../services/client/shippingService'; // điều chỉnh path nếu cần
import MapModal from './MapModal'; // chỉnh lại đường dẫn nếu bạn đặt ở nơi khác
import { userAddressService } from '../../../../services/client/userAddressService';
import SuccessModal from '../SuccessModal'; // điều chỉnh đường dẫn nếu cần

// AddressItem component
const AddressItem = ({ address, isDefault, onSetDefault, onUpdate, onDelete }) => {
  return (
    // Sử dụng màu nền nhạt của theme (ví dụ: bg-blue-50 hoặc tạo class riêng)
    <div className={`p-4 sm:p-5 ${isDefault ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-white dark:bg-gray-800'}`}>
      <div className="flex flex-col sm:flex-row justify-between">
        <div className="flex-1 mb-3 sm:mb-0 sm:mr-4">
          <div className="flex items-center mb-1.5">
            <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm mr-2 sm:mr-3 truncate">
              {address.fullName}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 sm:border-l sm:border-gray-300 dark:sm:border-gray-600 sm:pl-2 sm:ml-1">
              (+84) {String(address.phone || '').substring(1)}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{address.street}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {`${address.ward?.name || ''}, ${address.district?.name || ''}, ${address.province?.name || ''}`}
          </p>
          {isDefault && (
            // Sử dụng màu chủ đạo cho tag "Mặc định"
            <span className="mt-1.5 inline-block text-xs border border-primary text-primary px-1.5 py-0.5 rounded-sm">
              Mặc định
            </span>
          )}
        </div>
        <div className="flex-shrink-0 flex sm:flex-col items-start sm:items-end justify-between sm:justify-start">
          <div className="flex mb-0 sm:mb-2.5">
            {/* Có thể đổi màu text-blue-600 thành text-primary nếu muốn */}
            <button onClick={() => onUpdate(address.id)} className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mr-3 sm:mr-4">Cập nhật</button>
            {!isDefault && (<button onClick={() => onDelete(address.id)} className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Xóa</button>)}
          </div>
          <button onClick={() => onSetDefault(address.id)} disabled={isDefault}
            className={`text-xs border px-2.5 py-1 rounded-sm transition-colors ${isDefault ? 'bg-gray-200 text-gray-500 border-gray-200 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400 dark:border-gray-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:border-gray-500'}`}>
            Thiết lập mặc định
          </button>
        </div>
      </div>
    </div>
  );
};

// sampleAddressesData giữ nguyên

const AddressPageContent = () => {
  const [addresses, setAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const initialFormState = {
  fullName: '',
  phone: '',
  city: '', cityObj: null,
  district: '', districtObj: null,
  ward: '', wardObj: null,
  street: '',
  isDefault: false,
  addressType: 'Nhà Riêng',
};

  const [formData, setFormData] = useState(initialFormState);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [locationPickerTab, setLocationPickerTab] = useState('city');
  const [locationSearchTerm, setLocationSearchTerm] = useState('');
  const locationPickerRef = useRef(null);
  const locationTriggerRef = useRef(null);
  const addressInputRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState({ lat: null, lng: null });
  const [mapVisible, setMapVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);

  // useEffects và các hàm xử lý khác giữ nguyên logic, chỉ thay đổi class CSS nếu cần
  useEffect(() => {
    if (showAddressModal) {
      shippingService.getProvinces()
        .then(res => {
          setProvinceList(res);
        })
        .catch(err => {
          console.error("❌ Lỗi gọi API getProvinces:", err);
        });
    }
  }, [showAddressModal]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await userAddressService.getList();
        setAddresses(res.data.data);
      } catch (err) {
        console.error('❌ Lỗi khi lấy địa chỉ:', err);
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
      const selectedProvince = provinceList.find(p => p.id === editingAddress.provinceId);
      const selectedDistrict = districtList.find(d => d.id === editingAddress.districtId);
      const selectedWard = wardList.find(w => w.code === editingAddress.wardCode);

      setFormData({
        fullName: editingAddress.fullName || '',
        phone: editingAddress.phone || '',
        city: selectedProvince?.name || '',
        district: selectedDistrict?.name || '',
        ward: selectedWard?.name || '',
        street: editingAddress.street || '',
        isDefault: editingAddress.isDefault || false,
        addressType: editingAddress.addressType || 'Nhà Riêng',
      });

      if (selectedProvince) {
        shippingService.getDistricts(selectedProvince.id).then(res => setDistrictList(res));
      }
      if (selectedDistrict) {
        shippingService.getWards(selectedDistrict.id).then(res => setWardList(res));
      }
    } else {
      setFormData(initialFormState);
    }
  }, [editingAddress, showAddressModal, provinceList, districtList, wardList]); // Thêm districtList, wardList vào dependencies

  useEffect(() => {
    function handleClickOutside(event) {
      if (locationPickerRef.current && !locationPickerRef.current.contains(event.target) &&
        locationTriggerRef.current && !locationTriggerRef.current.contains(event.target)) {
        setShowLocationPicker(false);
      }
    }
    if (showLocationPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLocationPicker]);

  useEffect(() => {
    if (!showAddressModal || !window.google || !addressInputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(addressInputRef.current, {
      types: ['geocode'],
      componentRestrictions: { country: 'vn' }
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setSelectedLocation({ lat, lng });
        // Cập nhật street và có thể cả phường/xã, quận/huyện, tỉnh/thành nếu API Google trả về đủ chi tiết và bạn muốn tự động điền
        let streetAddress = '';
        const addressComponents = place.address_components;
        if (addressComponents) {
            const route = addressComponents.find(c => c.types.includes('route'))?.long_name;
            const streetNumber = addressComponents.find(c => c.types.includes('street_number'))?.long_name;
            if (streetNumber && route) streetAddress = `${streetNumber} ${route}`;
            else if (route) streetAddress = route;
            else streetAddress = place.name !== place.formatted_address ? place.name : ''; // Fallback
        }
         // Nếu formatted_address chi tiết hơn và bạn muốn dùng nó:
        setFormData(prev => ({ ...prev, street: streetAddress || place.formatted_address.split(',')[0] }));

        // Tùy chọn: tự động điền tỉnh, quận, phường từ place.address_components
        // ... logic để parse và setFormData cho city, district, ward ...
      }
    });
  }, [showAddressModal]);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

const handleLocationSelect = async (type, value) => {
  if (type === 'city') {
    const selected = provinceList.find(p => p.name === value);
    if (!selected) return;

    const districts = await shippingService.getDistricts(selected.ProvinceID || selected.id);
    setDistrictList(districts);

    setFormData(prev => ({
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
  }

  else if (type === 'district') {
    const selected = districtList.find(d => d.name === value);
    if (!selected) return;

    const wards = await shippingService.getWards(selected.DistrictID || selected.id);
    setWardList(wards);

    setFormData(prev => ({
      ...prev,
      district: selected.name,
      districtObj: selected,
      ward: '',
      wardObj: null
    }));

    setLocationPickerTab('ward');
    setLocationSearchTerm('');
  }

  else if (type === 'ward') {
    const selected = wardList.find(w => w.name === value);
    if (!selected) return;

    setFormData(prev => ({
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
    if (locationPickerTab === 'city') items = provinceList.map(p => p.name);
    else if (locationPickerTab === 'district') items = districtList.map(d => d.name);
    else if (locationPickerTab === 'ward') items = wardList.map(w => w.name);

    if (locationSearchTerm) {
      return items.filter(item => item.toLowerCase().includes(locationSearchTerm.toLowerCase()));
    }
    return items;
  };

  const handleSetDefault = async (id) => {
    try {
      await userAddressService.setDefault(id);
      setAddresses(prev =>
        prev.map(addr => ({ ...addr, isDefault: addr.id === id }))
      );
    } catch (err) {
      console.error("❌ Lỗi khi thiết lập mặc định:", err);
    }
  };

  const handleUpdate = (id) => {
    const addressToEdit = addresses.find(addr => addr.id === id);
    setEditingAddress(addressToEdit);
    setShowAddressModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) return;
    try {
      await userAddressService.remove(id);
      setAddresses(prev => prev.filter(addr => addr.id !== id));
      setSuccessMessage("Xóa địa chỉ thành công!");
    } catch (err) {
      console.error("❌ Lỗi khi xóa địa chỉ:", err);
    }
  };
  
  const closeModalAndPicker = () => {
    setShowAddressModal(false); 
    setEditingAddress(null); 
    setShowLocationPicker(false); 
  };

  const handleOpenNewAddressModal = () => { 
    setEditingAddress(null); 
    setFormData(initialFormState); 
    setShowAddressModal(true); 
    setShowLocationPicker(false);
  };
  
  const handleCloseModalOnBackdropClick = (e) => { 
    if (e.target === e.currentTarget) {
      closeModalAndPicker();
    }
  };

  const handleSaveAddress = async (e) => {
  e.preventDefault();

  const provinceId = formData.cityObj?.id || formData.cityObj?.ProvinceID;
  const districtId = formData.districtObj?.id || formData.districtObj?.DistrictID;
  const wardCode = formData.wardObj?.code || formData.wardObj?.WardCode;

  if (!formData.fullName || !formData.phone || !provinceId || !districtId || !wardCode || !formData.street) {
    alert("Vui lòng điền đầy đủ thông tin bắt buộc: Họ tên, Số điện thoại, Tỉnh/Thành, Quận/Huyện, Phường/Xã và Địa chỉ cụ thể.");
    console.error("❌ Thiếu dữ liệu bắt buộc hoặc không tìm thấy ID/code tương ứng", { formData, provinceId, districtId, wardCode });
    return;
  }

  // ✅ Lấy lại object từ formData để dùng sau khi thêm
  const selectedProvince = formData.cityObj;
  const selectedDistrict = formData.districtObj;
  const selectedWard = formData.wardObj;

  const addressDataToSave = {
    fullName: formData.fullName,
    phone: formData.phone,
    street: formData.street,
    provinceId,
    districtId,
    wardCode,
    isDefault: formData.isDefault,
    addressType: formData.addressType,
    ...(selectedLocation.lat && selectedLocation.lng && { latitude: selectedLocation.lat, longitude: selectedLocation.lng }),
  };

  try {
    if (editingAddress) {
      await userAddressService.update(editingAddress.id, addressDataToSave);
      setAddresses(prev =>
        prev.map(addr =>
          addr.id === editingAddress.id
            ? { ...addr, ...addressDataToSave, id: editingAddress.id, province: selectedProvince, district: selectedDistrict, ward: selectedWard }
            : addr
        )
      );
      setSuccessMessage("Cập nhật địa chỉ thành công!");
    } else {
      const res = await userAddressService.create(addressDataToSave);
      const newAddress = { ...res.data, province: selectedProvince, district: selectedDistrict, ward: selectedWard };
      setAddresses(prev => [...prev, newAddress]);
      setSuccessMessage("Đã thêm địa chỉ mới thành công!");
    }
    closeModalAndPicker();
  } catch (err) {
    console.error("❌ Lỗi khi lưu địa chỉ:", err);
    alert("Có lỗi xảy ra khi lưu địa chỉ. Vui lòng thử lại.");
  }
};

  
  const locationInputDisplay = [formData.city, formData.district, formData.ward].filter(Boolean).join(' / ');
console.log("Đã chọn:", { city: formData.city, district: formData.district, ward: formData.ward });

  return (
    <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 shadow-sm rounded-md border border-gray-200 dark:border-gray-700 min-h-[calc(100vh-150px)]">
      <div className="flex justify-between items-center mb-4 sm:mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200">Địa chỉ của tôi</h1>
        {/* Sử dụng class bg-primary từ CSS file của bạn */}
        <button onClick={handleOpenNewAddressModal}
          className="flex items-center bg-primary hover-primary text-white text-xs sm:text-sm font-medium py-2 px-3 sm:px-4 rounded-sm transition-colors">
          <Plus size={16} className="mr-1 sm:mr-1.5" /> Thêm địa chỉ mới
        </button>
      </div>

      {addresses.length > 0 ? (
        <div className="divide-y divide-gray-200 dark:divide-gray-700 border-t border-gray-200 dark:border-gray-700">
          {addresses.map(addr => ( <AddressItem key={addr.id} address={addr} isDefault={addr.isDefault} onSetDefault={handleSetDefault} onUpdate={handleUpdate} onDelete={handleDelete} /> ))}
        </div>
      ) : ( <div className="text-center py-10 text-gray-500 dark:text-gray-400"> <p>Bạn chưa có địa chỉ nào.</p> </div> )}

      {showAddressModal && (
        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }} className="fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-6 md:p-8" onClick={handleCloseModalOnBackdropClick}>
          <div 
            className="bg-white dark:bg-gray-800 p-0 rounded-sm shadow-xl w-full max-w-md h-[80vh] sm:h-[75vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center py-3 px-4 sm:px-5 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200">{editingAddress ? 'Cập nhật địa chỉ' : 'Địa chỉ mới'}</h2>
              <button onClick={closeModalAndPicker} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"> <CloseIcon size={20} /> </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {/* Thay thế màu focus cho input */}
              <form id="addressFormInModal" onSubmit={handleSaveAddress} className="space-y-5 p-4 sm:p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required placeholder="Họ và tên"
                    className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-sm text-sm focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 placeholder-gray-400" />
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="Số điện thoại"
                    className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-sm text-sm focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 placeholder-gray-400" />
                </div>

                <div className="relative">
                  <div className="relative">
                    <input 
                      ref={locationTriggerRef} 
                      type="text" 
                      name="locationTrigger"
                      id="locationTrigger" 
                      readOnly 
                      value={locationInputDisplay || ""}
                      onClick={() => { setShowLocationPicker(prev => !prev); setLocationPickerTab('city'); setLocationSearchTerm('');}}
                      placeholder="Tỉnh/Thành phố, Quận/Huyện, Phường/Xã"
                      // Thay thế màu focus
                      className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-sm text-sm focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200 cursor-pointer pr-10 placeholder-gray-400 dark:placeholder-gray-400" 
                    />
                    <ChevronDown size={16} className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none transition-transform duration-200 ${showLocationPicker ? 'rotate-180' : ''}`} />
                  </div>

                  {showLocationPicker && (
                    <div ref={locationPickerRef} className="absolute top-full mt-px left-0 w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-sm shadow-lg z-30 max-h-72 flex flex-col">
                      <div className="flex border-b border-gray-200 dark:border-gray-600 flex-shrink-0">
                        {[{key: 'city', label: 'Tỉnh/Thành phố'}, {key: 'district', label: 'Quận/Huyện'}, {key: 'ward', label: 'Phường/Xã'}].map(tab => (
                          <button type="button" key={tab.key} 
                            onClick={() => {
                              if (tab.key === 'district' && !formData.city) return;
                              if (tab.key === 'ward' && !formData.district) return;
                              setLocationPickerTab(tab.key); setLocationSearchTerm('');
                            }}
                            disabled={(tab.key === 'district' && !formData.city) || (tab.key === 'ward' && !formData.district)}
                            // Thay thế màu active tab
                            className={`flex-1 py-2 px-2 text-sm font-medium focus:outline-none
                              ${locationPickerTab === tab.key ? 'text-primary border-b-2 border-primary' : 'text-gray-600 dark:text-gray-300 hover:text-primary/80 dark:hover:text-blue-400/80'}
                              ${((tab.key === 'district' && !formData.city) || (tab.key === 'ward' && !formData.district)) ? 'text-gray-300 dark:text-gray-500 cursor-not-allowed hover:text-gray-300 dark:hover:text-gray-500' : ''}
                            `}>
                            {tab.label}
                          </button>
                        ))}
                      </div>
                      <div className="p-2 border-b border-gray-200 dark:border-gray-600 flex-shrink-0">
                        <div className="relative">
                          <SearchIcon size={16} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"/>
                          {/* Thay thế màu focus input search */}
                          <input type="text" placeholder="Tìm kiếm..." value={locationSearchTerm} onChange={e => setLocationSearchTerm(e.target.value)}
                            className="w-full py-1.5 pl-8 pr-2 border border-gray-300 dark:border-gray-600 rounded-sm text-sm focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"/>
                        </div>
                      </div>
                      <ul className="overflow-y-auto flex-1">
                        {filteredLocationItems().map(item => (
                          <li key={item} 
                            onClick={() => handleLocationSelect(locationPickerTab, item)}
                            // Thay thế màu hover item
                            className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-600 cursor-pointer">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  name="street"
                  placeholder="Địa chỉ cụ thể"
                  ref={addressInputRef}
                  // onChange={handleInputChange} // Nếu muốn cập nhật formData.street ngay khi Google Autocomplete điền thì dùng, nếu không thì nó sẽ được cập nhật trong listener "place_changed"
                 value={formData.street}
onChange={handleInputChange}

                  // Thay thế màu focus
                  className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-sm text-sm focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-400"
                />

                {formData.street && (
                  <>
                    <button type="button" onClick={() => setMapVisible(true)} className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                      + Thêm vị trí
                    </button>
                    {mapVisible && (
                      <MapModal
                        center={selectedLocation.lat ? selectedLocation : { lat: 10.7769, lng: 106.7009 }} // Cập nhật center
                        onClose={() => setMapVisible(false)}
                        setSelectedLocation={setSelectedLocation}
                      />
                    )}
                  </>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-3 px-0.5">Ví dụ: Số nhà 123, Tên đường (Tên tòa nhà)</p>

                <div className="flex items-center space-x-3 pt-0.5">
                  <span className="text-sm text-gray-700 dark:text-gray-200">Loại địa chỉ:</span>
                  <div className="flex items-center space-x-3">
                    <label className="flex items-center text-sm text-gray-700 dark:text-gray-200 cursor-pointer">
                      {/* Thay thế màu radio button */}
                      <input type="radio" name="addressType" value="Nhà Riêng" checked={formData.addressType === 'Nhà Riêng'} onChange={handleInputChange} className="form-radio text-primary focus:ring-primary mr-1.5" /> Nhà Riêng
                    </label>
                    <label className="flex items-center text-sm text-gray-700 dark:text-gray-200 cursor-pointer">
                      <input type="radio" name="addressType" value="Văn Phòng" checked={formData.addressType === 'Văn Phòng'} onChange={handleInputChange} className="form-radio text-primary focus:ring-primary mr-1.5" /> Văn Phòng
                    </label>
                  </div>
                </div>

                <div className="flex items-center pt-1">
                  {/* Thay thế màu checkbox */}
                  <input type="checkbox" name="isDefault" id="isDefaultAddressModal" checked={formData.isDefault} onChange={handleInputChange}
                    className="h-4 w-4 text-primary border-gray-300 dark:border-gray-600 rounded-sm focus:ring-1 focus:ring-blue-500/50 mr-2" />
                  <label htmlFor="isDefaultAddressModal" className="text-sm text-gray-700 dark:text-gray-200">Đặt làm địa chỉ mặc định</label>
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
              {/* Sử dụng class bg-primary và hover-primary từ CSS file của bạn */}
              <button 
                type="submit" 
                form="addressFormInModal"
                className="px-5 py-1.5 text-sm font-medium text-white bg-primary hover-primary rounded-sm"
              >
                {editingAddress ? 'Lưu' : 'Hoàn thành'}
              </button>
            </div>
          </div>
        </div>
      )}
      {successMessage && (
        <SuccessModal
          message={successMessage}
          onClose={() => setSuccessMessage('')}
        />
      )}
    </div>
  );
};

export default AddressPageContent;