// AddressPageContent.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Plus, ChevronDown, Search as SearchIcon, X as CloseIcon } from 'lucide-react';

// AddressItem component (giữ nguyên như trước)
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
const provinces = ["An Giang", "Bà Rịa - Vũng Tàu", "Bình Dương", "Bình Phước", "Bình Thuận", "Bình Định", "Cà Mau", "Cần Thơ", "Đà Nẵng", "Hà Nội", "TP. Hồ Chí Minh", "Hải Phòng", "Huế"];
const districts = {
  "Cà Mau": ["Huyện Phú Tân", "TP. Cà Mau", "Huyện Trần Văn Thời", "Huyện U Minh", "Huyện Cái Nước"],
  "Cần Thơ": ["Quận Cái Răng", "Quận Ninh Kiều", "Huyện Phong Điền", "Quận Bình Thủy", "Quận Ô Môn"],
  "TP. Hồ Chí Minh": ["Quận 1", "Quận 3", "Quận 4", "Quận 5", "Quận 6", "Quận 7", "Quận 8", "Quận 10", "Quận 11", "Quận 12", "Quận Bình Tân", "Quận Bình Thạnh", "Quận Gò Vấp", "Quận Phú Nhuận", "Quận Tân Bình", "Quận Tân Phú", "TP. Thủ Đức" , "Huyện Bình Chánh", "Huyện Cần Giờ", "Huyện Củ Chi", "Huyện Hóc Môn", "Huyện Nhà Bè"],
  "Hà Nội": ["Quận Ba Đình", "Quận Hoàn Kiếm", "Quận Hai Bà Trưng", "Quận Đống Đa", "Quận Tây Hồ", "Quận Cầu Giấy", "Quận Thanh Xuân", "Quận Hoàng Mai", "Quận Long Biên", "Huyện Đông Anh", "Huyện Gia Lâm", "Huyện Thanh Trì", "Huyện Từ Liêm"],
};
const wards = { 
  "Huyện Phú Tân": ["Xã Tân Hưng Tây", "Thị trấn Cái Đôi Vàm", "Xã Phú Mỹ", "Xã Phú Thuận"],
  "Quận Cái Răng": ["Phường Thường Thạnh", "Phường Hưng Phú", "Phường Lê Bình", "Phường Ba Láng"],
  "Quận 1": ["Phường Bến Nghé", "Phường Cầu Ông Lãnh", "Phường Cô Giang", "Phường Đa Kao", "Phường Nguyễn Cư Trinh"],
  "Quận Bình Thạnh": ["Phường 1", "Phường 2", "Phường 3", "Phường 5", "Phường 6", "Phường 7"],
};

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
    // Reset location picker visibility when modal opens or content changes
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
    if (showLocationPicker) { // Only add listener if picker is shown
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLocationPicker]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleLocationSelect = (type, value) => {
    if (type === 'city') {
      setFormData(prev => ({ ...prev, city: value, district: '', ward: '' }));
      setLocationPickerTab('district'); setLocationSearchTerm('');
    } else if (type === 'district') {
      setFormData(prev => ({ ...prev, district: value, ward: '' }));
      setLocationPickerTab('ward'); setLocationSearchTerm('');
    } else if (type === 'ward') {
      setFormData(prev => ({ ...prev, ward: value }));
      setShowLocationPicker(false); setLocationSearchTerm('');
    }
  };
  
  const filteredLocationItems = () => {
    let items = [];
    if (locationPickerTab === 'city') items = provinces;
    else if (locationPickerTab === 'district') items = formData.city ? (districts[formData.city] || []) : [];
    else if (locationPickerTab === 'ward') items = formData.district ? (wards[formData.district] || []) : [];
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
      setShowLocationPicker(false); // Make sure picker is closed when opening modal
  };
  
  const handleCloseModalOnBackdropClick = (e) => { 
    if (e.target === e.currentTarget) { // Check if the click is directly on the backdrop
        closeModalAndPicker();
    }
  };

  const handleSaveAddress = (e) => { 
    e.preventDefault();
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
      const newId = (Math.max(0, ...addresses.map(a => parseInt(a.id, 10))) + 1).toString();
      const newAddress = { ...addressDataToSave, id: newId };
      
      let newAddressesList = [...addresses];
      if (newAddress.isDefault) {
        newAddressesList = newAddressesList.map(addr => ({ ...addr, isDefault: false }));
      } else if (!newAddressesList.some(addr => addr.isDefault) && newAddressesList.length > 0) {
        // If no default address exists and this is not the first address, this logic might need review.
        // However, if it's the first address, or if explicitly set to default, it becomes default.
      } else if (newAddressesList.length === 0) { // If adding the very first address
        newAddress.isDefault = true;
      }
      
      newAddressesList.push(newAddress);
      // Ensure only one default if multiple were somehow made default or if isDefault logic needs refinement
      const defaultAddressExists = newAddressesList.some(a => a.isDefault);
      if (!defaultAddressExists && newAddressesList.length > 0) {
          newAddressesList[newAddressesList.length -1].isDefault = true; // Default last added if none
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
        <div  style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }} className="fixed inset-0  bg-opacity-20 flex items-center justify-center z-50 p-4" onClick={handleCloseModalOnBackdropClick}>
          {/* Điều chỉnh chiều rộng modal: max-w-xl (nhỏ hơn 2xl) */}
          <div className="bg-white p-0 rounded-sm shadow-xl w-full max-w-md max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center py-3 px-4 sm:px-5 border-b border-gray-200">
                <h2 className="text-base font-semibold text-gray-700">{editingAddress ? 'Cập nhật địa chỉ' : 'Địa chỉ mới'}</h2>
                <button onClick={closeModalAndPicker} className="text-gray-500 hover:text-gray-700"> <CloseIcon size={20} /> </button>
            </div>
            
            <form
         className={`space-y-4 flex-1 p-4 sm:p-5 ${showLocationPicker ? 'overflow-hidden' : 'overflow-y-auto'}`}
          >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required placeholder="Họ và tên"
                        className="w-full p-2.5 border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500 placeholder-gray-400" />
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="Số điện thoại"
                        className="w-full p-2.5 border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500 placeholder-gray-400" />
              </div>

              <div className="relative"> {/* Removed locationTriggerRef from here, it's on the input directly */}
                <div className="relative">
                    <input 
                        ref={locationTriggerRef} 
                        type="text" 
                        name="locationTrigger"
                        id="locationTrigger" 
                        readOnly 
                        value={locationInputDisplay || ""}
                        onClick={() => { setShowLocationPicker(prev => !prev); setLocationPickerTab('city'); setLocationSearchTerm('');}} // Toggle on click
                        placeholder="Tỉnh/Thành phố, Quận/Huyện, Phường/Xã"
                        className="w-full p-2.5 border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500 cursor-pointer pr-10 placeholder-gray-400" 
                    />
                    <ChevronDown size={16} className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none transition-transform duration-200 ${showLocationPicker ? 'rotate-180' : ''}`} />
                </div>

                {showLocationPicker && (
                  // Điều chỉnh chiều cao picker: max-h-60 (240px)
                      <div ref={locationPickerRef} className="absolute max-h-23  top-full mt-px left-0 w-full border border-gray-300 bg-white rounded-sm shadow-lg z-30 max-h-60 flex flex-col"> {/* Increased z-index */}
                    <div className="flex border-b border-gray-200">
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
                    <div className="p-2 border-b border-gray-200">
                        <div className="relative">
                            <SearchIcon size={16} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                            <input type="text" placeholder="Tìm kiếm..." value={locationSearchTerm} onChange={e => setLocationSearchTerm(e.target.value)}
                                    className="w-full py-1.5 pl-8 pr-2 border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500"/>
                        </div>
                    </div>
                    {/* Danh sách ul dùng flex-1, không cần style maxHeight riêng */}
                    <ul className="overflow-y-auto flex-1">
                      {filteredLocationItems().length > 0 ? filteredLocationItems().map(item => (
                        <li key={item} onClick={() => handleLocationSelect(locationPickerTab, item)}
                            className="px-3 py-1.5 text-sm text-gray-700 hover:bg-orange-50 cursor-pointer">
                          {item}
                        </li>
                      )) : <li className="px-3 py-2 text-sm text-gray-400 text-center">Không có kết quả hoặc vui lòng chọn cấp trên.</li>}
                    </ul>
                  </div>
                )}
              </div>

              <textarea name="street" id="street" value={formData.street} onChange={handleInputChange} 
                        placeholder="Địa chỉ cụ thể"
                        rows="2"
                        className="w-full p-2.5 border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500 placeholder-gray-400"></textarea>
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
                <input type="checkbox" name="isDefault" id="isDefault" checked={formData.isDefault} onChange={handleInputChange}
                        className="h-4 w-4 text-orange-500 border-gray-300 rounded-sm focus:ring-1 focus:ring-orange-500/50 mr-2" />
                <label htmlFor="isDefault" className="text-sm text-gray-700">Đặt làm địa chỉ mặc định</label>
              </div>
            
              <div className="pt-3 flex justify-end space-x-2.5 border-t border-gray-200">
                <button type="button" onClick={closeModalAndPicker}
                        className="px-5 py-1.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-sm border border-gray-300">
                  Trở Lại
                </button>
                <button type="submit"
                        className="px-5 py-1.5 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-sm">
                  {editingAddress ? 'Lưu' : 'Hoàn thành'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressPageContent;