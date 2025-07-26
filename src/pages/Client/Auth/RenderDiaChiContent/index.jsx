import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { userAddressService } from '../../../../services/client/userAddressService';
import SuccessModal from '../SuccessModal';
import { confirmDelete } from '../../../../components/common/ConfirmDeleteDialog';
import Loader from '../../../../components/common/Loader';
import AddressModal from './AddressModal';
import useAuthStore from '../../../../stores/AuthStore';

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
        <div
            className={`p-4 sm:p-5 transition-all duration-200 ease-in-out ${isDefault ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
        >
            <div className="flex flex-col sm:flex-row justify-between">
                <div className="flex flex-1 mb-3 sm:mb-0 sm:mr-4 items-start">

                    <div className="flex flex-col">
                        <div className="flex items-center mb-1.5">
                            <span className="font-semibold text-gray-800 dark:text-gray-200 text-base mr-2 sm:mr-3 truncate">{address.fullName}</span>
                            <div className="text-xs text-gray-500 dark:text-gray-400 sm:border-l sm:border-gray-300 dark:sm:border-gray-600 sm:pl-2 sm:ml-1 flex items-center gap-2 flex-wrap">
                                <span>(+84) {String(address.phone || '').substring(1)}</span>
                                {address.label && (
                                    <span
                                        className={`px-2 py-0.5 rounded-sm text-[11px] font-medium
        ${address.label.toLowerCase() === 'nhà riêng' ? 'bg-yellow-200 text-yellow-900'
                                                : address.label.toLowerCase() === 'văn phòng' ? 'bg-blue-200 text-blue-900'
                                                    : address.label.toLowerCase() === 'nhà người yêu' ? 'bg-pink-200 text-pink-900'
                                                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}
      `}
                                    >
                                        {address.label}
                                    </span>
                                )}
                            </div>


                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-0.5">{address.streetAddress} </p>
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
                            className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mr-3 sm:mr-4 transition-colors duration-150"
                        >
                            Cập nhật
                        </button>
                        {!isDefault && (
                            <button
                                onClick={() => onDelete(address.id)}
                                className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-150"
                            >
                                Xóa
                            </button>
                        )}
                    </div>
                    <button
                        onClick={() => onSetDefault(address.id)}
                        disabled={isDefault}
                        className={`text-xs border px-2.5 py-1 rounded-sm transition-colors duration-200 ${isDefault ? 'bg-gray-200 text-gray-500 border-gray-200 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400 dark:border-gray-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:border-gray-500'}`}
                    >
                        Thiết lập mặc định
                    </button>
                </div>
            </div>
        </div>
    );
};

const AddressPageContent = () => {
    const [loading, setLoading] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchAddresses = async () => {
            setLoading(true);
            try {
                const res = await userAddressService.getList();
                setAddresses(sortAddresses(res.data.data || []));
            } catch (err) {
                console.error('Lỗi khi lấy địa chỉ:', err);
            } finally {
                setLoading(false);
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

    const handleSetDefault = async (id) => {
        if (!id) {
            alert('ID không hợp lệ khi thiết lập mặc định.');
            return;
        }

        setLoading(true);
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
        } finally {
            setLoading(false);
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

        setLoading(true);
        try {
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

    const handleOpenNewAddressModal = () => {
        const currentUser = useAuthStore.getState().user;

        setEditingAddress({
            fullName: currentUser?.fullName || '',
            phone: currentUser?.phone || '',
            streetAddress: '',
            provinceId: null,
            districtId: null,
            wardId: null,
            label: '',
            isDefault: addresses.length === 0
        });

        setShowAddressModal(true);
    };

    const handleCloseAddressModal = () => {
        setShowAddressModal(false);
        setEditingAddress(null);
    };

    const handleSaveAddress = async (formDataToSave) => {
        setLoading(true);
        const { selectedProvince, selectedDistrict, selectedWard, ...addressData } = formDataToSave;

        const addressPayload = {
            fullName: addressData.fullName,
            phone: addressData.phone,
            streetAddress: addressData.streetAddress,
            provinceId: addressData.provinceId,
            districtId: addressData.districtId,
            wardId: addressData.wardId,
            isDefault: addresses.length === 0 ? true : addressData.isDefault,
            label: addressData.label
        };

        try {
            if (editingAddress?.id) {

                await userAddressService.update(editingAddress.id, addressPayload);
                setAddresses((prev) =>
                    sortAddresses(
                        prev.map((addr) =>
                            addr.id === editingAddress.id
                                ? { ...addr, ...addressPayload, province: selectedProvince, district: selectedDistrict, ward: selectedWard }
                                : addressPayload.isDefault && addr.isDefault
                                    ? { ...addr, isDefault: false }
                                    : addr
                        )
                    )
                );
                setSuccessMessage('Cập nhật địa chỉ thành công!');
            } else {
                const res = await userAddressService.create(addressPayload);
                const newAddress = {
                    id: res.data.id,
                    ...addressPayload,
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
            handleCloseAddressModal();
        } catch (err) {
            console.error('Lỗi khi lưu địa chỉ:', err);
            if (err.response?.status === 400 && err.response?.data?.errors) {
                alert(err.response.data.errors.map((e) => e.message).join('\n'));
            } else {
                alert('Có lỗi xảy ra khi lưu địa chỉ. Vui lòng thử lại.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 shadow-sm rounded-md border border-gray-200 dark:border-gray-700 min-h-[calc(100vh-150px)]">
            <div className="flex justify-between items-center mb-4 sm:mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200">Địa chỉ của tôi</h1>
                <button
                    onClick={handleOpenNewAddressModal}
                    className="flex items-center bg-primary hover:bg-primary-dark transition-colors text-white text-xs sm:text-sm font-medium py-2 px-3 sm:px-4 rounded-sm"
                >
                    <Plus size={16} className="mr-1 sm:mr-1.5" /> Thêm địa chỉ mới
                </button>
            </div>

            {loading && addresses.length === 0 ? (
                <Loader fullscreen />
            ) : addresses.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
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
                    <p>Bạn chưa có địa chỉ nào.</p>
                </div>
            )}

            {showAddressModal && (
                <AddressModal
                    open={showAddressModal}
                    onClose={handleCloseAddressModal}
                    onSave={handleSaveAddress}
                    editingAddress={editingAddress}
                    loading={loading}
                />
            )}
            {successMessage && <SuccessModal message={successMessage} onClose={() => setSuccessMessage('')} />}
        </div>
    );
};

export default AddressPageContent;
