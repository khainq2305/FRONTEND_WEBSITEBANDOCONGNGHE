// AddressPageContent.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Plus, ChevronDown, Search as SearchIcon, X as CloseIcon } from 'lucide-react';
import { shippingService } from '../../../../services/client/shippingService'; // điều chỉnh path nếu cần
import MapModal from './MapModal'; // chỉnh lại đường dẫn nếu bạn đặt ở nơi khác

// AddressItem component (giữ nguyên như bạn cung cấp)
const AddressItem = ({ address, isDefault, onSetDefault, onUpdate, onDelete }) => {
  return (
    <div className={`p-4 sm:p-5 ${isDefault ? 'bg-orange-50/30' : 'bg-white'}`}>
      <div className="flex flex-col sm:flex-row justify-between">
        <div className="flex-1 mb-3 sm:mb-0 sm:mr-4">
          <div className="flex items-center mb-1.5">
            <span className="font-semibold text-gray-800 text-sm mr-2 sm:mr-3 truncate">{address.name}</span>
            <span className="text-xs text-gray-500 sm:border-l sm:border-gray-300 sm:pl-2 sm:ml-1">
              (+84) {address.phone.substring(1)}
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-0.5">{address.street}</p>
          <p className="text-xs text-gray-500">{`${address.ward}, ${address.district}, ${address.city}`}</p>
          {isDefault && (
            <span className="mt-1.5 inline-block text-xs border border-orange-500 text-orange-500 px-1.5 py-0.5 rounded-sm">
              Mặc định
            </span>
          )}
        </div>
        <div className="flex-shrink-0 flex sm:flex-col items-start sm:items-end justify-between sm:justify-start">
          <div className="flex mb-0 sm:mb-2.5">
            <button onClick={() => onUpdate(address.id)} className="text-xs text-blue-600 hover:text-blue-700 mr-3 sm:mr-4">Cập nhật</button>
            {!isDefault && (<button onClick={() => onDelete(address.id)} className="text-xs text-blue-600 hover:text-blue-700">Xóa</button>)}
          </div>
          <button onClick={() => onSetDefault(address.id)} disabled={isDefault}
            className={`text-xs border px-2.5 py-1 rounded-sm transition-colors ${isDefault ? 'bg-gray-200 text-gray-500 border-gray-200 cursor-not-allowed' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400'}`}>
            Thiết lập mặc định
          </button>
        </div>
      </div>
    </div>
  );
};

const sampleAddressesData = [
  { id: '1', name: 'Nguyễn Quốc Khải', phone: '0382742511', street: 'Ấp Tân Phú Thành', ward: 'Xã Tân Hưng Tây', district: 'Huyện Phú Tân', city: 'Cà Mau', isDefault: true, addressType: 'Nhà Riêng'},
  { id: '2', name: 'Nguyễn Quốc Khải', phone: '0878899894', street: 'Trường Vĩnh Nguyên', ward: 'Phường Thường Thạnh', district: 'Quận Cái Răng', city: 'Cần Thơ', isDefault: false, addressType: 'Nhà Riêng'},
  { id: '3', name: 'Nguyễn Vũ Duy', phone: '0815979019', street: 'Ấp Tân Phú Thành', ward: 'Xã Tân Hưng Tây', district: 'Huyện Phú Tân', city: 'Cà Mau', isDefault: false, addressType: 'Văn Phòng'},
];

const AddressPageContent = () => {
  const [addresses, setAddresses] = useState(sampleAddressesData);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const initialFormState = { fullName: '', phone: '', city: '', district: '', ward: '', street: '', isDefault: false, addressType: 'Nhà Riêng' };
  const [formData, setFormData] = useState(initialFormState);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [locationPickerTab, setLocationPickerTab] = useState('city');
  const [locationSearchTerm, setLocationSearchTerm] = useState('');
  const locationPickerRef = useRef(null);
  const locationTriggerRef = useRef(null);
  const addressInputRef = useRef(null); // 👈 THÊM DÒNG NÀY
const [selectedLocation, setSelectedLocation] = useState({ lat: null, lng: null });
const [mapVisible, setMapVisible] = useState(false);

const [provinceList, setProvinceList] = useState([]);
const [districtList, setDistrictList] = useState([]);
const [wardList, setWardList] = useState([]);
useEffect(() => {
  if (showAddressModal) {
    shippingService.getProvinces().then(res => {
      console.log("✅ Provinces from API:", res); // 👉 Xem log có phải là mảng không
      setProvinceList(res);
    });
  }
}, [showAddressModal]);

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
      setFormData({
        fullName: editingAddress.name || '', phone: editingAddress.phone || '',
        city: editingAddress.city || '', district: editingAddress.district || '',
        ward: editingAddress.ward || '', street: editingAddress.street || '',
        isDefault: editingAddress.isDefault || false, addressType: editingAddress.addressType || 'Nhà Riêng',
      });
    } else {
      setFormData(initialFormState);
    }
    if (showAddressModal) {
        setShowLocationPicker(false);
    }
  }, [editingAddress, showAddressModal]);

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
      setFormData(prev => ({ ...prev, street: place.formatted_address }));
    }
  });
}, [showAddressModal]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleLocationSelect = async (type, value) => {
  if (type === 'city') {
    setFormData(prev => ({ ...prev, city: value, district: '', ward: '' }));
const selected = provinceList.find(p => p.ProvinceName === value);

    if (selected) {
      const districts = await shippingService.getDistricts(selected.ProvinceID || selected.id);
      setDistrictList(districts);
    }
    setLocationPickerTab('district');
    setLocationSearchTerm('');
  } else if (type === 'district') {
    setFormData(prev => ({ ...prev, district: value, ward: '' }));
  const selected = districtList.find(d => d.DistrictName === value);

    if (selected) {
      const wards = await shippingService.getWards(selected.DistrictID || selected.id);
      setWardList(wards);
    }
    setLocationPickerTab('ward');
    setLocationSearchTerm('');
  } else if (type === 'ward') {
    setFormData(prev => ({ ...prev, ward: value }));
    setShowLocationPicker(false);
    setLocationSearchTerm('');
  }
};

  
  const filteredLocationItems = () => {
  let items = [];
if (locationPickerTab === 'city') items = provinceList.map(p => p.ProvinceName);
else if (locationPickerTab === 'district') items = districtList.map(d => d.DistrictName);
else if (locationPickerTab === 'ward') items = wardList.map(w => w.WardName);

  if (locationSearchTerm) {
    return items.filter(item => item.toLowerCase().includes(locationSearchTerm.toLowerCase()));
  }
  return items;
};


  const handleSetDefault = (id) => setAddresses(addresses.map(addr => ({ ...addr, isDefault: addr.id === id })));
  const handleUpdate = (id) => { const addressToEdit = addresses.find(addr => addr.id === id); setEditingAddress(addressToEdit); setShowAddressModal(true); };
  const handleDelete = (id) => { if (window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) { setAddresses(addresses.filter(addr => addr.id !== id)); }};
  
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

  const handleSaveAddress = (e) => { 
    e.preventDefault(); // Ngăn chặn hành vi submit mặc định của form
    // Logic lưu địa chỉ của bạn giữ nguyên
    const addressDataToSave = {
      name: formData.fullName, phone: formData.phone, city: formData.city,
      district: formData.district, ward: formData.ward, street: formData.street,
      isDefault: formData.isDefault, addressType: formData.addressType,
    };
    if (editingAddress) {
      let updatedAddresses = addresses.map(addr => 
        addr.id === editingAddress.id ? { ...addr, ...addressDataToSave, id: editingAddress.id } : addr
      );
      if (addressDataToSave.isDefault) {
        updatedAddresses = updatedAddresses.map(addr => 
          addr.id === editingAddress.id ? addr : { ...addr, isDefault: false }
        );
      }
      setAddresses(updatedAddresses);
    } else {
      const newId = (Math.max(0, ...addresses.map(a => parseInt(a.id, 10) || 0)) + 1).toString();
      const newAddress = { ...addressDataToSave, id: newId };
      let newAddressesList = [...addresses];
      if (newAddress.isDefault) {
        newAddressesList = newAddressesList.map(addr => ({ ...addr, isDefault: false }));
      }
      if (newAddressesList.length === 0 && !newAddress.isDefault) {
        newAddress.isDefault = true;
      }
      newAddressesList.push(newAddress);
      const defaultAddressExists = newAddressesList.some(a => a.isDefault);
      if (!defaultAddressExists && newAddressesList.length > 0) {
          newAddressesList[newAddressesList.length -1].isDefault = true; 
      }
      setAddresses(newAddressesList);
    }
    closeModalAndPicker();
  };
  
  const locationInputDisplay = [formData.city, formData.district, formData.ward].filter(Boolean).join(' / ');

  return (
    <div className="bg-white p-4 sm:p-6 shadow-sm rounded-md border border-gray-200 min-h-[calc(100vh-150px)]">
      <div className="flex justify-between items-center mb-4 sm:mb-6 pb-3 border-b border-gray-200">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Địa chỉ của tôi</h1>
        <button onClick={handleOpenNewAddressModal}
          className="flex items-center bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-medium py-2 px-3 sm:px-4 rounded-sm transition-colors">
          <Plus size={16} className="mr-1 sm:mr-1.5" /> Thêm địa chỉ mới
        </button>
      </div>

      {addresses.length > 0 ? (
        <div className="divide-y divide-gray-200 border-t border-gray-200">
          {addresses.map(addr => ( <AddressItem key={addr.id} address={addr} isDefault={addr.isDefault} onSetDefault={handleSetDefault} onUpdate={handleUpdate} onDelete={handleDelete} /> ))}
        </div>
      ) : ( <div className="text-center py-10 text-gray-500"> <p>Bạn chưa có địa chỉ nào.</p> </div> )}

      {showAddressModal && (
        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }} className="fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-6 md:p-8" onClick={handleCloseModalOnBackdropClick}>
          {/* Modal Content Wrapper */}
          <div 
            className="bg-white p-0 rounded-sm shadow-xl w-full max-w-md h-[75vh] flex flex-col" // Chiều cao modal ví dụ h-[80vh]
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center py-3 px-4 sm:px-5 border-b border-gray-200 flex-shrink-0">
                <h2 className="text-base font-semibold text-gray-700">{editingAddress ? 'Cập nhật địa chỉ' : 'Địa chỉ mới'}</h2>
                <button onClick={closeModalAndPicker} className="text-gray-500 hover:text-gray-700"> <CloseIcon size={20} /> </button>
            </div>
            
            {/* Form Wrapper: Nội dung form sẽ nằm trong đây */}
            {/* Thẻ form sẽ không còn là flex-1 nữa, mà là div bọc nó */}
            <div className="flex-1 overflow-y-auto">
              <form id="addressFormInModal" onSubmit={handleSaveAddress} className="space-y-5 p-4 sm:p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required placeholder="Họ và tên"
                          className="w-full p-2.5 border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500 placeholder-gray-400" />
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="Số điện thoại"
                          className="w-full p-2.5 border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500 placeholder-gray-400" />
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
                          className="w-full p-2.5 border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500 cursor-pointer pr-10 placeholder-gray-400" 
                      />
                      <ChevronDown size={16} className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none transition-transform duration-200 ${showLocationPicker ? 'rotate-180' : ''}`} />
                  </div>

                  {showLocationPicker && (
                      <div ref={locationPickerRef} className="absolute top-full mt-px left-0 w-full border border-gray-300 bg-white rounded-sm shadow-lg z-30 max-h-72 flex flex-col">
                        <div className="flex border-b border-gray-200 flex-shrink-0">
                          {[{key: 'city', label: 'Tỉnh/Thành phố'}, {key: 'district', label: 'Quận/Huyện'}, {key: 'ward', label: 'Phường/Xã'}].map(tab => (
                            <button type="button" key={tab.key} 
                                    onClick={() => {
                                        if (tab.key === 'district' && !formData.city) return;
                                        if (tab.key === 'ward' && !formData.district) return;
                                        setLocationPickerTab(tab.key); setLocationSearchTerm('');
                                    }}
                                    disabled={(tab.key === 'district' && !formData.city) || (tab.key === 'ward' && !formData.district)}
                                    className={`flex-1 py-2 px-2 text-sm font-medium focus:outline-none
                                      ${locationPickerTab === tab.key ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-600 hover:text-orange-500/80'}
                                      ${((tab.key === 'district' && !formData.city) || (tab.key === 'ward' && !formData.district)) ? 'text-gray-300 cursor-not-allowed hover:text-gray-300' : ''}
                                    `}>
                              {tab.label}
                            </button>
                          ))}
                        </div>
                        <div className="p-2 border-b border-gray-200 flex-shrink-0">
                            <div className="relative">
                                <SearchIcon size={16} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                                <input type="text" placeholder="Tìm kiếm..." value={locationSearchTerm} onChange={e => setLocationSearchTerm(e.target.value)}
                                        className="w-full py-1.5 pl-8 pr-2 border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500"/>
                            </div>
                        </div>
                        <ul className="overflow-y-auto flex-1">
                        {filteredLocationItems().map(item => (
  <li key={item} // ✅ THÊM DÒNG NÀY
      onClick={() => handleLocationSelect(locationPickerTab, item)}
      className="px-3 py-1.5 text-sm text-gray-700 hover:bg-orange-50 cursor-pointer">
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
  defaultValue={formData.street}
  className="w-full p-2.5 border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500 placeholder-gray-400"
/>

{formData.street && (
  <>
    <button type="button" onClick={() => setMapVisible(true)} className="mt-2 text-sm text-blue-600">
      + Thêm vị trí
    </button>
    {mapVisible && (
      <MapModal
        center={selectedLocation || { lat: 10.7769, lng: 106.7009 }}
        onClose={() => setMapVisible(false)}
        setSelectedLocation={setSelectedLocation}
      />
    )}
  </>
)}

                <p className="text-xs text-gray-500 -mt-3 px-0.5">Ví dụ: Số nhà 123, Tên đường (Tên tòa nhà)</p>

                <div className="flex items-center space-x-3 pt-0.5">
                  <span className="text-sm text-gray-700">Loại địa chỉ:</span>
                  <div className="flex items-center space-x-3">
                      <label className="flex items-center text-sm text-gray-700 cursor-pointer">
                      <input type="radio" name="addressType" value="Nhà Riêng" checked={formData.addressType === 'Nhà Riêng'} onChange={handleInputChange} className="form-radio-custom mr-1.5" /> Nhà Riêng
                      </label>
                      <label className="flex items-center text-sm text-gray-700 cursor-pointer">
                      <input type="radio" name="addressType" value="Văn Phòng" checked={formData.addressType === 'Văn Phòng'} onChange={handleInputChange} className="form-radio-custom mr-1.5" /> Văn Phòng
                      </label>
                  </div>
                </div>

                <div className="flex items-center pt-1">
                  <input type="checkbox" name="isDefault" id="isDefaultAddressModal" checked={formData.isDefault} onChange={handleInputChange}
                          className="h-4 w-4 text-orange-500 border-gray-300 rounded-sm focus:ring-1 focus:ring-orange-500/50 mr-2" />
                  <label htmlFor="isDefaultAddressModal" className="text-sm text-gray-700">Đặt làm địa chỉ mặc định</label>
                </div>
              </form>
            </div>

            {/* Modal Footer / Action Buttons */}
            <div className="flex-shrink-0 py-3 px-4 sm:px-5 border-t border-gray-200 flex justify-end space-x-2.5 bg-white">
                <button 
                    type="button" 
                    onClick={closeModalAndPicker}
                    className="px-5 py-1.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-sm border border-gray-300"
                >
                  Trở Lại
                </button>
                <button 
                    type="submit" 
                    form="addressFormInModal" // Liên kết với form bằng ID
                    className="px-5 py-1.5 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-sm"
                >
                    {editingAddress ? 'Lưu' : 'Hoàn thành'}
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressPageContent;