import React, { useState, useEffect } from "react";
import AddressForm from '../AddressForm'; // Giả định đường dẫn này đúng trong project của bạn

const CheckoutForm = ({ isLoading, addressList, selectedAddress, onSelectAddress, onAddressCreated }) => {
    // 3 chế độ xem: DEFAULT (hiển thị 1 địa chỉ), LIST (sổ địa chỉ), FORM (nhập mới)
    const [viewMode, setViewMode] = useState('DEFAULT');
const [note, setNote] = useState('');

    useEffect(() => {
        if (!isLoading) {
            if (!addressList || addressList.length === 0) {
                setViewMode('FORM');
            } else {
                setViewMode('DEFAULT');
            }
        }
    }, [isLoading, addressList]);

    const getFullAddressString = (address) => {
        if (!address) return "";
        return [
            address.streetAddress, address.ward?.name, address.district?.name, address.province?.name
        ].filter(Boolean).join(", ");
    };

const handleSelectAddressFromList = (address) => {
    onSelectAddress(address);
    localStorage.setItem('selectedAddressId', address.id); // 👈 Lưu lại
    setViewMode('DEFAULT');
};


    const handleSaveSuccess = () => {
        onAddressCreated(); 
        setViewMode('DEFAULT');
    };

    // Giao diện hiển thị địa chỉ đang được chọn
    const renderDefaultView = () => {
        if (!selectedAddress) {
            // Phòng trường hợp không có địa chỉ nào được chọn nhưng viewMode vẫn là DEFAULT
            return (
                <div className="text-center p-4">
                    <p className="text-gray-500 mb-2">Vui lòng chọn hoặc tạo địa chỉ giao hàng.</p>
                    <button onClick={() => setViewMode('FORM')} className="bg-sky-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-sky-600">
                        Thêm địa chỉ mới
                    </button>
                </div>
            );
        }

        return (
            <div>
 {/* ✨ SỬA LẠI STYLE CHO 2 Ô INPUT Ở ĐÂY */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                    <input 
                        type="text" 
                        value={selectedAddress.fullName} 
                        readOnly 
                        className="w-full border border-sky-500 bg-sky-50 text-gray-800 font-medium rounded-md px-3 py-2 cursor-not-allowed focus:outline-none" 
                    />
                    <input 
                        type="text" 
                        value={selectedAddress.phone} 
                        readOnly 
                        className="w-full border border-sky-500 bg-sky-50 text-gray-800 font-medium rounded-md px-3 py-2 cursor-not-allowed focus:outline-none" 
                    />
                </div>
                
                <div className="p-3 border border-gray-200 rounded-md bg-gray-50">
  <div className="flex items-center gap-2 flex-wrap">
    <span className="font-semibold">{selectedAddress.label || 'Địa chỉ'}</span>

    {/* Badge nếu có */}
  {selectedAddress.label && (
  <span className="text-xs font-semibold text-sky-700 border border-sky-600 px-2 py-0.5 rounded-full">
    {selectedAddress.label.toUpperCase()}
  </span>
)}


    {selectedAddress.isDefault && (
      <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full font-semibold">
        MẶC ĐỊNH
      </span>
    )}
  </div>
  <p className="text-gray-600 text-sm mt-1">{getFullAddressString(selectedAddress)}</p>
</div>

<div className="mt-4">
  <label htmlFor="orderNote" className="block text-sm font-medium text-gray-700 mb-1">
    Ghi chú đơn hàng (nếu có)
  </label>
  <textarea
    id="orderNote"
    placeholder="Ví dụ: Giao ngoài giờ hành chính, gọi trước khi giao..."
    value={note}
    onChange={(e) => setNote(e.target.value)}
    rows={3}
    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 resize-none"
  />
</div>

                <div className="mt-2 text-sm space-x-2">
                    {addressList.length > 1 &&
                        <button onClick={() => setViewMode('LIST')} className="text-sky-500 hover:text-sky-600 font-medium">
                            Chọn địa chỉ khác
                        </button>
                    }
                    <button onClick={() => setViewMode('FORM')} className="text-sky-500 hover:text-sky-600 font-medium">
                        Nhập địa chỉ mới
                    </button>
                </div>


            </div>
        );
    };

    // Giao diện hiển thị Sổ địa chỉ
    const renderListView = () => (
        <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">Chọn từ Sổ địa chỉ</h3>
            <div className="max-h-60 overflow-y-auto pr-2 space-y-2">
                {addressList.map(addr => (
                    <label key={addr.id} className={`flex items-start p-2 rounded-md border transition-all cursor-pointer 
  ${selectedAddress?.id === addr.id 
    ? 'border border-sky-200 bg-sky-50' 
    : 'border border-gray-200 hover:border-gray-300'}`}
>
                        <input
                            type="radio"
                            name="addressSelection"
                            checked={selectedAddress?.id === addr.id}
                            onChange={() => handleSelectAddressFromList(addr)}
                            className="form-radio h-4 w-4 text-sky-600 mt-1"
                        />
                        <div className="ml-3 flex-1">
                            <div className="flex items-center">
                                <span className="font-semibold text-gray-800">{addr.fullName}</span>
                                {addr.isDefault && <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full font-semibold ml-2">MẶC ĐỊNH</span>}
                            </div>
                            <p className="text-sm text-gray-600 mt-0.5">{addr.phone}</p>
                            <p className="text-sm text-gray-500 mt-0.5">{getFullAddressString(addr)}</p>
                        </div>
                    </label>
                ))}
            </div>
          <div className="flex justify-between items-center mt-3">
  <button
    onClick={() => setViewMode('FORM')}
    className="text-sky-500 hover:text-sky-600 font-medium text-sm"
  >
    + Nhập địa chỉ mới
  </button>
  <button
    onClick={() => setViewMode('DEFAULT')}
    className="text-gray-500 hover:text-black font-medium text-sm"
  >
    ← Quay lại
  </button>
</div>

        </div>
    );

    // Quyết định render giao diện nào
    const renderContent = () => {
        if (isLoading) {
            return <p className="text-center text-gray-500 p-4">Đang tải thông tin địa chỉ...</p>;
        }

        switch (viewMode) {
            case 'LIST':
                return renderListView();
            case 'FORM':
                return <AddressForm
                    onSave={handleSaveSuccess}
                    onCancel={() => addressList && addressList.length > 0 ? setViewMode('DEFAULT') : null}
                />;
            case 'DEFAULT':
            default:
                return renderDefaultView();
        }
    };

    return (
        <section className="bg-white rounded-lg p-4 shadow-md">
            <h2 className="font-semibold mb-4 text-base text-gray-800">Thông tin giao hàng</h2>
            {renderContent()}
        </section>
    );
};

export default CheckoutForm;