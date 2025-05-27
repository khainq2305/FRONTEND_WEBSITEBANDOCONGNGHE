// AddressPageContent.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Plus, ChevronDown, Search as SearchIcon, X as CloseIcon } from 'lucide-react';
import { shippingService } from '../../../../services/client/shippingService'; // điều chỉnh path nếu cần
import MapModal from './MapModal'; // chỉnh lại đường dẫn nếu bạn đặt ở nơi khác
import { userAddressService } from '../../../../services/client/userAddressService';
import SuccessModal from '../SuccessModal'; // điều chỉnh đường dẫn nếu cần
import { confirmDelete } from '../../../../components/common/ConfirmDeleteDialog'; // cập nhật path đúng
// Helper function to sort addresses: default first
const sortAddresses = (addressList) => {
  if (!addressList) return [];
  const sorted = [...addressList]; // Create a copy to avoid mutating the original array
  sorted.sort((a, b) => {
    if (a.isDefault && !b.isDefault) return -1; // a comes first if it's default and b is not
    if (!a.isDefault && b.isDefault) return 1;  // b comes first if it's default and a is not
    // Optional: Add secondary sort criteria here if needed (e.g., by creation date or name)
    return 0;
  });
  return sorted;
};
const getAddressIcon = (label) => {
  if (!label) return "/images/home-default.png"; // fallback nếu null

  switch (label.toLowerCase()) {
    case "nhà riêng":
      return "/images/home-default.png"; // icon nhà riêng
    case "văn phòng":
      return "/images/office.png"; // icon văn phòng
    case "nhà người yêu":
      return "/images/heart-home.png"; // icon dễ thương nè
    default:
      return "/images/home-default.png";
  }
};

// AddressItem component
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
      <span className="font-semibold text-gray-800 dark:text-gray-200 text-base mr-2 sm:mr-3 truncate">
        {address.fullName}
      </span>
      <span className="text-xs text-gray-500 dark:text-gray-400 sm:border-l sm:border-gray-300 dark:sm:border-gray-600 sm:pl-2 sm:ml-1">
        (+84) {String(address.phone || '').substring(1)}
      </span>
    </div>
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-0.5">{address.streetAddress}</p>
    <p className="text-sm text-gray-500 dark:text-gray-400">
      {`${address.ward?.name || ''}${address.ward?.name && (address.district?.name || address.province?.name) ? ', ' : ''}${address.district?.name || ''}${address.district?.name && address.province?.name ? ', ' : ''}${address.province?.name || ''}`}
    </p>
    {isDefault && (
     <span className="mt-1.5 inline-flex text-xs border border-primary text-primary px-1.5 py-0.5 rounded-sm w-fit">
  Mặc định
</span>

    )}
  </div>
</div>

        <div className="flex-shrink-0 flex sm:flex-col items-start sm:items-end justify-between sm:justify-start">
          <div className="flex mb-0 sm:mb-2.5">
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

const AddressPageContent = () => {
  const addressLabels = ['Nhà Riêng', 'Văn Phòng', 'Nhà Người Yêu'];
const [formErrors, setFormErrors] = useState({});

  const [addresses, setAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
const initialFormState = {
  fullName: '',
  phone: '',
  city: '', cityObj: null,
  district: '', districtObj: null,
  ward: '', wardObj: null,
  streetAddress: '',
  isDefault: false,
  label: 'Nhà Riêng',
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
const [suggestions, setSuggestions] = useState([]);
const [isSearching, setIsSearching] = useState(false);
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const fetchMapboxSuggestions = async (query) => {
  if (!query) {
    setSuggestions([]);
    return;
  }

  const fullQuery = [query, formData.ward, formData.district, formData.city, "Vietnam"]
    .filter(Boolean)
    .join(', ');

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(fullQuery)}.json?access_token=${MAPBOX_TOKEN}&limit=5&country=VN`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const results = data.features.map(f => ({
      display_name: f.place_name,
      lat: f.center[1],
      lon: f.center[0]
    }));
    setSuggestions(results);
  } catch (err) {
    console.error("❌ Lỗi gọi Mapbox:", err);
    setSuggestions([]);
  }
};



  useEffect(() => {
    if (showAddressModal) {
      shippingService.getProvinces()
        .then(res => {
          setProvinceList(res || []); // Ensure res is an array
        })
        .catch(err => {
          console.error("❌ Lỗi gọi API getProvinces:", err);
          setProvinceList([]); // Set to empty array on error
        });
    }
  }, [showAddressModal]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await userAddressService.getList();
        setAddresses(sortAddresses(res.data.data || [])); // Sort initial list
      } catch (err) {
        console.error('❌ Lỗi khi lấy địa chỉ:', err);
        setAddresses([]); // Set to empty array on error
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
        const provObj = provinceList.find(p => p.id === editingAddress.provinceId || p.ProvinceID === editingAddress.provinceId);
        if (provObj) {
          setFormData({
            fullName: editingAddress.fullName || '',
            phone: editingAddress.phone || '',
            city: provObj.name,
            cityObj: provObj,
            district: '', districtObj: null,
            ward: '', wardObj: null,
            streetAddress: editingAddress.streetAddress || '',
            isDefault: editingAddress.isDefault || false,
            label: editingAddress.label || 'Nhà Riêng',
          });

          shippingService.getDistricts(provObj.ProvinceID || provObj.id)
            .then(districts => {
              setDistrictList(districts || []);
              const distObj = (districts || []).find(d => d.id === editingAddress.districtId || d.DistrictID === editingAddress.districtId);
              if (distObj) {
                setFormData(prev => ({ ...prev, district: distObj.name, districtObj: distObj }));
                shippingService.getWards(distObj.DistrictID || distObj.id)
                  .then(wards => {
                    setWardList(wards || []);
                    const wardObj = (wards || []).find(w => w.code === editingAddress.wardCode || w.WardCode === editingAddress.wardCode);
                    if (wardObj) {
                      setFormData(prev => ({ ...prev, ward: wardObj.name, wardObj: wardObj }));
                    } else {
                      setFormData(prev => ({ ...prev, ward: '', wardObj: null }));
                    }
                  }).catch(err => {
                        console.error("Error fetching wards for edit:", err);
                        setFormData(prev => ({ ...prev, ward: '', wardObj: null }));
                        setWardList([]);
                    });
              } else {
                setFormData(prev => ({ ...prev, district: '', districtObj: null, ward: '', wardObj: null }));
                setWardList([]);
              }
            }).catch(err => {
                console.error("Error fetching districts for edit:", err);
                setFormData(prev => ({ ...prev, district: '', districtObj: null, ward: '', wardObj: null }));
                setDistrictList([]);
                setWardList([]);
            });
        } else {
          setFormData({
            fullName: editingAddress.fullName || '',
            phone: editingAddress.phone || '',
            city: '', cityObj: null,
            district: '', districtObj: null,
            ward: '', wardObj: null,
            streetAddress: editingAddress.streetAddress || '',
            isDefault: editingAddress.isDefault || false,
            label: editingAddress.label || 'Nhà Riêng',
          });
          setDistrictList([]);
          setWardList([]);
        }
      } else if (showAddressModal && editingAddress) { // Added editingAddress check here
         setFormData({
            fullName: editingAddress.fullName || '',
            phone: editingAddress.phone || '',
            city: '', cityObj: null,
            district: '', districtObj: null,
            ward: '', wardObj: null,
            streetAddress: editingAddress.streetAddress || '',
            isDefault: editingAddress.isDefault || false,
            label: editingAddress.label || 'Nhà Riêng',
        });
      }
    }
  }, [editingAddress, showAddressModal, provinceList]);


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
        let streetAddressAddress = '';
        const addressComponents = place.address_components;
        if (addressComponents) {
           const street_number = addressComponents.find(c => c.types.includes('street_number'))?.long_name;
const route = addressComponents.find(c => c.types.includes('route'))?.long_name;

if (street_number && route) streetAddressAddress = `${street_number} ${route}`;
else if (route) streetAddressAddress = route;
else streetAddressAddress = place.name !== place.formatted_address ? place.name : '';

          
            if (streetAddressNumber && route) streetAddressAddress = `${streetAddressNumber} ${route}`;
            else if (route) streetAddressAddress = route;
            else streetAddressAddress = place.name !== place.formatted_address ? place.name : '';
        }
        setFormData(prev => ({ ...prev, streetAddress: streetAddressAddress || place.formatted_address.split(',')[0] }));
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

      try {
        const districts = await shippingService.getDistricts(selected.ProvinceID || selected.id);
        setDistrictList(districts || []);
      } catch (err) {
        console.error("Error fetching districts:", err);
        setDistrictList([]);
      }
      
      setFormData(prev => ({
        ...prev,
        city: selected.name,
        cityObj: selected,
        district: '', districtObj: null,
        ward: '', wardObj: null
      }));
      setLocationPickerTab('district');
      setLocationSearchTerm('');
    } else if (type === 'district') {
      const selected = districtList.find(d => d.name === value);
      if (!selected) return;
      
      try {
        const wards = await shippingService.getWards(selected.DistrictID || selected.id);
        setWardList(wards || []);
      } catch(err) {
        console.error("Error fetching wards:", err);
        setWardList([]);
      }

      setFormData(prev => ({
        ...prev,
        district: selected.name,
        districtObj: selected,
        ward: '', wardObj: null
      }));
      setLocationPickerTab('ward');
      setLocationSearchTerm('');
    } else if (type === 'ward') {
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
     if (!id) {
    console.error("❌ ID không hợp lệ:", id);
    alert("ID không hợp lệ khi thiết lập mặc định.");
    return;
  }

    try {
      await userAddressService.setDefault(id);
      setAddresses(prevAddresses => {
        const newAddresses = prevAddresses.map(addr => ({
          ...addr,
          isDefault: addr.id === id
        }));
        return sortAddresses(newAddresses);
      });
      setSuccessMessage("Địa chỉ mặc định đã được cập nhật!");
    } catch (err) {
      console.error("❌ Lỗi khi thiết lập mặc định:", err);
      alert("Có lỗi xảy ra khi thiết lập địa chỉ mặc định.");
    }
  };

  const handleUpdate = (id) => {
    const addressToEdit = addresses.find(addr => addr.id === id);
    setEditingAddress(addressToEdit);
    setShowAddressModal(true);
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmDelete('xoá', 'địa chỉ này');
  if (!confirmed) return;
    try {
      await userAddressService.remove(id);
      const newAddresses = addresses.filter(addr => addr.id !== id);
      setAddresses(sortAddresses(newAddresses)); // Re-sort after deletion
      setSuccessMessage("Xóa địa chỉ thành công!");
    } catch (err) {
      console.error("❌ Lỗi khi xóa địa chỉ:", err);
      alert("Có lỗi xảy ra khi xóa địa chỉ.");
    }
  };
  
  const closeModalAndPicker = () => {
    setShowAddressModal(false); 
    setEditingAddress(null); 
    setShowLocationPicker(false); 
    setFormData(initialFormState); // Reset form when closing modal
  };

  const handleOpenNewAddressModal = () => { 
    setEditingAddress(null); 
    setFormData(initialFormState); 
    setShowAddressModal(true); 
    setShowLocationPicker(false);
    setDistrictList([]); // Clear district and ward lists for new address
    setWardList([]);
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

   const newErrors = {};

if (!formData.fullName.trim()) newErrors.fullName = "Họ tên không được để trống.";
if (!formData.phone.trim()) newErrors.phone = "Số điện thoại không được để trống.";
if (!provinceId || !districtId || !wardCode) {
  newErrors.city = "Vui lòng nhập Tỉnh/Thành phố, Quận/Huyện và Phường/Xã";
}

if (!formData.streetAddress.trim()) newErrors.streetAddress = "Địa chỉ cụ thể không được để trống.";

if (Object.keys(newErrors).length > 0) {
  setFormErrors(newErrors);
  return;
}


    const selectedProvince = formData.cityObj;
    const selectedDistrict = formData.districtObj;
    const selectedWard = formData.wardObj;

    const addressDataToSave = {
      fullName: formData.fullName,
      phone: formData.phone,
      streetAddress: formData.streetAddress,
      provinceId,
      districtId,
      wardCode,
      isDefault: formData.isDefault,
      label: formData.label,
      ...(selectedLocation.lat && selectedLocation.lng && { latitude: selectedLocation.lat, longitude: selectedLocation.lng }),
    };

    try {
      if (editingAddress) {
        await userAddressService.update(editingAddress.id, addressDataToSave);
        setAddresses(prevAddresses => {
          const updatedAddresses = prevAddresses.map(addr => {
            if (addr.id === editingAddress.id) {
              return { ...addr, ...addressDataToSave, id: editingAddress.id, province: selectedProvince, district: selectedDistrict, ward: selectedWard };
            }
            if (addressDataToSave.isDefault) { // If updated address is default, set others to not default
              return { ...addr, isDefault: false };
            }
            return addr;
          });
          return sortAddresses(updatedAddresses);
        });
        setSuccessMessage("Cập nhật địa chỉ thành công!");
      } else {
        const res = await userAddressService.create(addressDataToSave);
      const newAddress = { 
  id: res.data.id, // lấy id trả về từ backend
  fullName: formData.fullName,
  phone: formData.phone,
  streetAddress: formData.streetAddress,
  isDefault: formData.isDefault,
  label: formData.label,
  province: selectedProvince,
  district: selectedDistrict,
  ward: selectedWard,
};

        setAddresses(prevAddresses => {
          let newAddressList = [...prevAddresses];
          if (newAddress.isDefault) {
            newAddressList = newAddressList.map(addr => ({ ...addr, isDefault: false }));
          }
          newAddressList.push(newAddress);
          return sortAddresses(newAddressList);
        });
        setSuccessMessage("Đã thêm địa chỉ mới thành công!");
      }
      closeModalAndPicker();
    } catch (err) {
      console.error("Lỗi khi lưu địa chỉ:", err);
      if (err.response?.status === 400 && err.response?.data?.errors) {
  const apiErrors = {};
  err.response.data.errors.forEach(err => {
    apiErrors[err.field] = err.message;
  });
  setFormErrors(apiErrors);
} else {
  alert("Có lỗi xảy ra khi lưu địa chỉ. Vui lòng thử lại.");
}

    }
  };
  
  const locationInputDisplay = [formData.city, formData.district, formData.ward].filter(Boolean).join(' / ');

  return (
    <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 shadow-sm rounded-md border border-gray-200 dark:border-gray-700 min-h-[calc(100vh-150px)]">
      <div className="flex justify-between items-center mb-4 sm:mb-6 pb-3 border-b border-gray-200 dark:border-gray-700"> {/* Restored border-b */}
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200">Địa chỉ của tôi</h1>
        <button onClick={handleOpenNewAddressModal}
          className="flex items-center bg-primary hover-primary text-white text-xs sm:text-sm font-medium py-2 px-3 sm:px-4 rounded-sm transition-colors">
          <Plus size={16} className="mr-1 sm:mr-1.5" /> Thêm địa chỉ mới
        </button>
      </div>

      {addresses.length > 0 ? (
        <div className="divide-y divide-gray-200 dark:divide-gray-700"> {/* Removed extra border-t from here for cleaner look with AddressItem's own structure */}
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
              <form id="addressFormInModal" onSubmit={handleSaveAddress} className="space-y-5 p-4 sm:p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                 <div className="w-full">
  <input
    type="text"
    name="fullName"
    value={formData.fullName}
    onChange={handleInputChange}
    placeholder="Họ và tên"
    className={`w-full p-2.5 border rounded-sm text-sm focus:ring-1 ${
      formErrors.fullName ? 'border-red-500' : 'border-gray-300'
    } dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-400`}
  />
  {formErrors.fullName && (
    <p className="text-xs text-red-500 mt-1">{formErrors.fullName}</p>
  )}
</div>


                  <div className="w-full">
  <input
    type="tel"
    name="phone"
    value={formData.phone}
    onChange={handleInputChange}
    placeholder="Số điện thoại"
    className={`w-full p-2.5 border rounded-sm text-sm focus:ring-1 ${
      formErrors.phone ? 'border-red-500' : 'border-gray-300'
    } dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-400`}
  />
  {formErrors.phone && (
    <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>
  )}
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
      value={locationInputDisplay || ""}
      onClick={() => {
        setShowLocationPicker(prev => !prev);
        setLocationPickerTab('city');
        setLocationSearchTerm('');
      }}
      placeholder="Tỉnh/Thành phố, Quận/Huyện, Phường/Xã"
      className={`w-full p-2.5 border rounded-sm text-sm focus:ring-1 ${
        formErrors.city || formErrors.district || formErrors.ward
          ? 'border-red-500'
          : 'border-gray-300'
      } dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 cursor-pointer pr-10 placeholder-gray-400 dark:placeholder-gray-400`} 
    />
    <ChevronDown
      size={16}
      className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none transition-transform duration-200 ${
        showLocationPicker ? 'rotate-180' : ''
      }`}
    />
  </div>

  {/* Hiển thị lỗi cụ thể */}
  {(formErrors.city || formErrors.district || formErrors.ward) && (
  <div className="mt-1 space-y-0.5">
   {formErrors.city && (
  <p className="block text-xs text-red-500 mt-1">{formErrors.city}</p>
)}
{formErrors.district && (
  <p className="block text-xs text-red-500 mt-0.5">{formErrors.district}</p>
)}
{formErrors.ward && (
  <p className="block text-xs text-red-500 mt-0.5">{formErrors.ward}</p>
)}

  </div>
)}

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
                          <input type="text" placeholder="Tìm kiếm..." value={locationSearchTerm} onChange={e => setLocationSearchTerm(e.target.value)}
                            className="w-full py-1.5 pl-8 pr-2 border border-gray-300 dark:border-gray-600 rounded-sm text-sm focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"/>
                        </div>
                      </div>
                      <ul className="overflow-y-auto flex-1">
                        {filteredLocationItems().map(item => (
                          <li key={item} 
                            onClick={() => handleLocationSelect(locationPickerTab, item)}
                            className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-600 cursor-pointer">
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
    ref={addressInputRef}
    value={formData.streetAddress}
    onChange={(e) => {
      handleInputChange(e);
      fetchMapboxSuggestions(e.target.value);
    }}
    disabled={!formData.city || !formData.district || !formData.ward}
    placeholder={
      !formData.city || !formData.district || !formData.ward
        ? "Vui lòng chọn Tỉnh, Quận, Xã trước"
        : "Địa chỉ cụ thể"
    }
    className={`w-full p-2.5 border rounded-sm text-sm focus:ring-1 ${
      formErrors.streetAddress ? 'border-red-500' : 'border-gray-300'
    } ${
      (!formData.city || !formData.district || !formData.ward)
        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
        : ''
    } dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-400`}
  />

  {suggestions.length > 0 && (
    <ul className="absolute z-40 top-full left-0 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow max-h-60 overflow-auto">
      {suggestions.map((item, index) => (
        <li
          key={index}
          onClick={() => {
            setFormData(prev => ({ ...prev, streetAddress: item.display_name }));
            setSelectedLocation({ lat: parseFloat(item.lat), lng: parseFloat(item.lon) });
            setSuggestions([]);
          }}
          className="px-3 py-2 text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
        >
          {item.display_name}
        </li>
      ))}
    </ul>
  )}
</div>


{formErrors.streetAddress && (
  <p className="text-xs text-red-500 mt-1">{formErrors.streetAddress}</p>
)}

                {formData.streetAddress && (
                  <>
                    <button type="button" onClick={() => setMapVisible(true)} className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                      + Thêm vị trí
                    </button>
                    {mapVisible && (
                      <MapModal
                        center={selectedLocation.lat ? selectedLocation : { lat: 10.7769, lng: 106.7009 }}
                        onClose={() => setMapVisible(false)}
                        setSelectedLocation={setSelectedLocation}
                      />
                    )}
                  </>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-3 px-0.5">Ví dụ: Số nhà 123, Tên đường (Tên tòa nhà)</p>

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