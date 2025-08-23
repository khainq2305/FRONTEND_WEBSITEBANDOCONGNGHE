// src/pages/Client/Auth/ReturnMethodPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Button,
    RadioGroup,
    Radio,
    TextField,
    CircularProgress,
    Chip,
    Typography,
    Link,
    Menu,
    MenuItem,
    Paper,
} from '@mui/material';
import { toast } from 'react-toastify';
import { userAddressService } from '../../../../services/client/userAddressService';
import { returnRefundService } from '../../../../services/client/returnRefundService';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { vi } from 'date-fns/locale';
import { ChevronRight } from 'lucide-react';
import { confirmDelete } from '@/components/common/ConfirmDeleteDialog';
import { format, parseISO } from 'date-fns';
import { useParams, useNavigate } from 'react-router-dom';

import AddressModal from '../RenderDiaChiContent/AddressModal';

export default function ReturnMethodPage() {
    // Lấy returnCode từ URL params
    const { returnCode } = useParams();
    const navigate = useNavigate();
const [dropoffServices, setDropoffServices] = useState([]);
const [selectedDropoffService, setSelectedDropoffService] = useState(null);
const [pickupFee, setPickupFee] = useState(null);
const [loadingPickupFee, setLoadingPickupFee] = useState(false);

    const [returnMethod, setReturnMethod] = useState('ghn_pickup');
    const [trackingCode, setTrackingCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const openAddressMenu = Boolean(anchorEl);

    const [addresses, setAddresses] = useState([]);
    const [selectedPickupAddress, setSelectedPickupAddress] = useState(null);
    const [returnRequestDetails, setReturnRequestDetails] = useState(null);
    // THÊM state này để lưu ID thật sự của yêu cầu trả hàng sau khi fetch
    const [returnRequestIdFromDetails, setReturnRequestIdFromDetails] = useState(null); // Đổi tên rõ ràng hơn

    const pickupAddressBoxRef = useRef(null);
    const [pickupAddressBoxWidth, setPickupAddressBoxWidth] = useState(0);

    const [openAddressModal, setOpenAddressModal] = useState(false);

    // Effect để fetch chi tiết yêu cầu trả hàng và danh sách địa chỉ
    useEffect(() => {
        const fetchData = async () => {
            // Kiểm tra returnCode có tồn tại không
            if (!returnCode) {
                toast.error('Mã yêu cầu trả hàng không được cung cấp trong URL.');
                navigate('/user-profile#quan-ly-don-hang'); // Điều hướng về trang danh sách yêu cầu
                return;
            }
            setLoading(true);
            try {
                // Gọi API bằng returnCode
                const reqRes = await returnRefundService.getReturnByCode(returnCode);
                const details = reqRes?.data?.data;

                if (details) {
                    setReturnRequestDetails(details);
                    // LƯU ID VÀO STATE MỚI ĐỂ SỬ DỤNG VỚI CÁC API KHÁC
                    setReturnRequestIdFromDetails(details.id); // Lấy id từ chi tiết và lưu vào state
                    setSelectedPickupAddress(details.shippingAddress || null);
                } else {
                    toast.error(`Không tìm thấy chi tiết yêu cầu trả hàng với mã ${returnCode}.`);
                    navigate('/user-profile#quan-ly-don-hang');
                    return;
                }

                // Fetch danh sách địa chỉ người dùng
                const addrRes = await userAddressService.getList();
                const list = addrRes?.data?.data || [];
                setAddresses(list);
                // Nếu chưa có địa chỉ được chọn từ details, hoặc địa chỉ đó không có ID, thì chọn mặc định
                // Cần đảm bảo selectedPickupAddress được cập nhật đúng cách sau khi details được fetch
                // Nếu details.shippingAddress tồn tại và có ID, ưu tiên nó
                // Nếu không, hoặc nếu selectedPickupAddress vẫn là null, thì tìm địa chỉ mặc định/đầu tiên từ list
                if (!selectedPickupAddress || !selectedPickupAddress.id) {
                    const defaultAddr = list.find((a) => a.isDefault) || list[0];
                    setSelectedPickupAddress(defaultAddr || null);
                }

            } catch (err) {
                console.error('Lỗi khi tải dữ liệu yêu cầu trả hàng hoặc địa chỉ:', err);
                toast.error(err?.response?.data?.message || 'Không thể tải dữ liệu.');
                navigate('/user-profile#quan-ly-don-hang');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [returnCode, navigate]); // returnCode là dependency chính, selectedPickupAddress không cần ở đây nếu nó được set nội bộ
useEffect(() => {
  const fetchDropoffServices = async () => {
    if (returnMethod === 'self_send' && returnRequestIdFromDetails) {
      try {
        const res = await returnRefundService.getDropoffServices(returnRequestIdFromDetails);
        setDropoffServices(res?.data?.data || []);
      } catch (err) {
        console.error('Lỗi khi lấy dịch vụ bưu cục:', err);
        toast.error('Không thể tải danh sách dịch vụ bưu cục');
      }
    }
  };
  fetchDropoffServices();
}, [returnMethod, returnRequestIdFromDetails]);
useEffect(() => {
  const fetchPickupFee = async () => {
    if (returnMethod !== 'ghn_pickup' || !returnRequestIdFromDetails) return;
    try {
      setLoadingPickupFee(true);
      const res = await returnRefundService.getPickupFee(returnRequestIdFromDetails);
      const fee = res?.data?.data?.fee ?? null;
      setPickupFee(typeof fee === 'number' ? fee : null);
    } catch (e) {
      console.error('[pickup-fee] error:', e);
      setPickupFee(null);
    } finally {
      setLoadingPickupFee(false);
    }
  };
  fetchPickupFee();
}, [returnMethod, returnRequestIdFromDetails]);
    useEffect(() => {
        if (pickupAddressBoxRef.current) {
            setPickupAddressBoxWidth(pickupAddressBoxRef.current.clientWidth);
        }
    }, [openAddressMenu, selectedPickupAddress, addresses]);

    const handleToggleAddressMenu = (event) => {
        if (openAddressMenu) {
            setAnchorEl(null);
        } else {
            setAnchorEl(event.currentTarget);
        }
    };

    const handleCloseAddressMenu = () => {
        setAnchorEl(null);
    };

    const handleSelectAddress = (address) => {
        setSelectedPickupAddress(address);
        handleCloseAddressMenu();
    };

    const RenderDefaultChip = ({ isDefault }) => {
        if (!isDefault) return null;
        return (
            <Chip
                label="Mặc định"
                size="small"
                color="default"
                sx={{ ml: 1, whiteSpace: 'nowrap', flexShrink: 0 }}
            />
        );
    };

    const now = new Date();
    const actualPickupDate1 = new Date(now);
    actualPickupDate1.setDate(now.getDate());
    const actualPickupDate2 = new Date(now);
    actualPickupDate2.setDate(now.getDate() + 1);

    const formattedActualPickupDate1 = format(actualPickupDate1, 'dd MMMM', { locale: vi });
    const formattedActualPickupDate2 = format(actualPickupDate2, 'dd MMMM', { locale: vi });

  const formattedDeadline = returnRequestDetails?.deadlineChooseReturnMethod
  ? format(parseISO(returnRequestDetails.deadlineChooseReturnMethod), 'dd-MM-yyyy HH:mm', { locale: vi })
  : 'Không xác định';

const handleSubmit = async () => {
  if (!returnRequestIdFromDetails) {
    toast.error('Không tìm thấy ID yêu cầu trả hàng để xử lý.');
    return;
  }

  if (returnMethod === 'ghn_pickup' && !selectedPickupAddress) {
    toast.error('Vui lòng chọn địa chỉ lấy hàng.');
    return;
  }

  setLoading(true);
  try {
    const payload = { returnMethod };

    await returnRefundService.chooseReturnMethod(returnRequestIdFromDetails, {
      ...payload,
      pickupAddressId:
        returnMethod === 'ghn_pickup' ? selectedPickupAddress?.id : undefined,
    });

    if (returnMethod === 'ghn_pickup') {
      await returnRefundService.bookReturnPickup(returnRequestIdFromDetails);
      toast.success('Đã đặt GHN đến lấy hàng!');
    } else if (returnMethod === 'self_send') {
      const svc = selectedDropoffService || dropoffServices[0];
      if (!svc) {
        toast.error('Không có dịch vụ bưu cục khả dụng');
        return;
      }
      await returnRefundService.createDropoffReturnOrder(
        returnRequestIdFromDetails,
        {
          provider: svc.provider,
          serviceCode: svc.service_id,
          serviceName: svc.short_name,
        }
      );
      toast.success('Đã tạo đơn trả hàng tại bưu cục!');
    }

    navigate(`/user-profile/return-order/${returnRequestIdFromDetails}`);
  } catch (err) {
    console.error('[ReturnMethodPage] Lỗi cập nhật phương thức hoàn hàng:', err);
    toast.error(
      err?.response?.data?.message || 'Không thể cập nhật phương thức hoàn hàng'
    );
  } finally {
    setLoading(false);
  }
};



    const handleCancelRequest = async () => {
        const confirmed = await confirmDelete('huỷ', 'yêu cầu trả hàng này');
        if (!confirmed) return;

        // SỬ DỤNG returnRequestIdFromDetails ở đây
        if (!returnRequestIdFromDetails) {
            toast.error('Không tìm thấy ID yêu cầu trả hàng để hủy.');
            return;
        }

        setLoading(true);
        try {
            // Gọi API bằng returnRequestIdFromDetails
            await returnRefundService.cancelReturnRequest(returnRequestIdFromDetails);
            toast.success('Đã huỷ yêu cầu trả hàng!');
            navigate('/user-profile#quan-ly-don-hang'); // Điều hướng về trang danh sách yêu cầu
        } catch (err) {
            console.error('[CancelReturnRequest] Lỗi hủy yêu cầu:', err);
            toast.error(err?.response?.data?.message || 'Không thể huỷ yêu cầu');
        } finally {
            setLoading(false);
        }
    };

    const handleAddressModalSuccess = async () => {
        setOpenAddressModal(false);
        setLoading(true);
        try {
            const res = await userAddressService.getList();
            const updatedList = res?.data?.data || [];
            setAddresses(updatedList);

            const defaultAddr = updatedList.find((a) => a.isDefault) || updatedList[0];
            setSelectedPickupAddress(defaultAddr || null);
            toast.success('Địa chỉ đã được cập nhật thành công!');
        } catch (e) {
            toast.error('Không thể tải lại danh sách địa chỉ sau khi thêm/cập nhật.');
            console.error('Error re-fetching addresses after modal success:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleAddressModalClose = () => {
        setOpenAddressModal(false);
    };

    const handleSaveNewAddress = async (formData) => {
        setLoading(true);
        try {
            const payload = {
                fullName: formData.fullName,
                phone: formData.phone,
                streetAddress: formData.streetAddress,
                provinceId: formData.provinceId,
                districtId: formData.districtId,
                wardId: formData.wardId,
                isDefault: formData.isDefault || addresses.length === 0,
                label: formData.label
            };

            await userAddressService.create(payload);
            toast.success('Đã thêm địa chỉ mới thành công!');
            handleAddressModalSuccess();
        } catch (err) {
            console.error('Lỗi khi thêm địa chỉ mới từ ReturnMethodPage:', err);
            toast.error(err?.response?.data?.message || 'Không thể thêm địa chỉ mới.');
        } finally {
            setLoading(false);
        }
    };

    // Hiển thị loading spinner nếu đang tải chi tiết yêu cầu lần đầu
    if (loading && !returnRequestDetails) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // Hiển thị thông báo nếu không tìm thấy chi tiết yêu cầu
    if (!returnRequestDetails) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6">Không tìm thấy thông tin yêu cầu trả hàng.</Typography>
                <Button onClick={() => navigate('/user-profile/return-order')} sx={{ mt: 2 }}>
                    Về trang quản lý yêu cầu
                </Button>
            </Box>
        );
    }

    return (
        <>
            <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, mt: 3, mb: 5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {/* Nút quay lại: sử dụng returnRequestIdFromDetails */}
                    <Button onClick={() => navigate('/user-profile#quan-ly-don-hang')} sx={{ minWidth: 'auto', p: 0, mr: 1.5 }}>
                        <ChevronRight style={{ transform: 'rotate(180deg)' }} />
                    </Button>
                    <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>
                        Chọn phương thức trả hàng
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Mã Yêu Cầu: {returnRequestDetails?.returnCode || 'Đang tải...'}
                    </Typography>
                </Box>
                <hr style={{ border: 'none', borderBottom: '1px solid #e0e0e0', marginBottom: '24px' }} />

                <Box className="flex flex-col">
                    <Box className="bg-blue-50 text-blue-800 p-3 sm:p-4 text-sm font-medium mb-4 mx-0 rounded-md">
                        <Typography variant="body2">Yêu cầu Trả hàng đã được chấp nhận</Typography>
                        <Typography variant="caption" color="text.secondary">
                            Bạn vui lòng chọn phương thức trả hàng trước ngày <span className="font-semibold">{formattedDeadline}</span>. Nếu không, yêu
                            cầu sẽ bị hủy tự động.
                        </Typography>
                    </Box>

                    <RadioGroup value={returnMethod} onChange={(e) => setReturnMethod(e.target.value)} sx={{ pt: 0 }}>
                        {/* KHUNG "Đơn vị vận chuyển đến lấy hàng" */}
                        <Box
                            onClick={() => setReturnMethod('ghn_pickup')}
                            sx={{
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                mb: 2,
                                bgcolor: 'white',
                                p: 0,
                                cursor: 'pointer',
                                '&:hover': {
                                    borderColor: 'primary.main'
                                }
                            }}
                        >
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                            }}>
                                <Radio
                                    checked={returnMethod === 'ghn_pickup'}
                                    onChange={() => setReturnMethod('ghn_pickup')}
                                    value="ghn_pickup"
                                    size="small"
                                    sx={{
                                        p: 0, m: 0,
                                        ml: '16px',
                                        mr: '12px',
                                        mt: '16px',
                                        alignSelf: 'flex-start',
                                    }}
                                />
                                <Box sx={{ flexGrow: 1, pt: '16px', pb: '16px', pr: '16px' }}>
                                    {/* Tiêu đề + Chip Miễn ship hoàn về */}
<Box
  sx={{
    display: 'flex',
    alignItems: 'center',
    gap: 1, // khoảng cách nhỏ giữa text và chip
  }}
>
  <Typography variant="body1" fontWeight="bold">
    Đơn vị vận chuyển đến lấy hàng
  </Typography>

<Chip
  label="Vui lòng thanh toán phí vận chuyển"
  size="small"
  variant="outlined"
  sx={{
    borderColor: '#1AA2E9',
    color: '#1AA2E9',
    fontWeight: 600,
    ml: 1,
  }}
/>

</Box>

                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1 }}>
                                        Vui lòng kiểm tra thông tin lấy hàng của bạn.
                                    </Typography>

                                    {/* PHẦN ĐỊA CHỈ LẤY HÀNG */}
                                    <Box className="relative mb-4">
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Typography variant="body2" fontWeight="medium" sx={{ color: 'text.secondary', mr: 1, whiteSpace: 'nowrap' }}>
                                                Địa Chỉ Lấy Hàng*
                                            </Typography>

                                            <Box
                                                ref={pickupAddressBoxRef}
                                                sx={{
                                                    border: '1px solid #e0e0e0',
                                                    borderRadius: '8px',
                                                    p: '8px 12px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    flexGrow: 1,
                                                    cursor: 'pointer',
                                                    bgcolor: 'white',
                                                    '&:hover': { borderColor: 'grey.500' }
                                                }}
                                                onClick={handleToggleAddressMenu}
                                            >
                                                <Box sx={{
                                                    flexGrow: 1,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    overflow: 'hidden'
                                                }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <Typography variant="body2" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            <span style={{ fontWeight: 600 }}>{selectedPickupAddress?.fullName}</span> {selectedPickupAddress?.phone}
                                                        </Typography>
                                                        {selectedPickupAddress && selectedPickupAddress.isDefault && (
                                                            <RenderDefaultChip isDefault={true} />
                                                        )}
                                                    </Box>

                                                    <Typography variant="body2" color="text.secondary" sx={{
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        flexGrow: 1
                                                    }}>
                                                        {selectedPickupAddress?.streetAddress}, {selectedPickupAddress?.ward?.name}, {selectedPickupAddress?.district?.name},{' '}
                                                        {selectedPickupAddress?.province?.name}
                                                    </Typography>
                                                </Box>
                                                <Box display="flex" alignItems="center" ml={1} flexShrink={0}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ color: 'blue.600', textDecoration: 'none', whiteSpace: 'nowrap', '&:hover': { textDecoration: 'underline' }, cursor: 'pointer' }}
                                                    >
                                                        Thay đổi
                                                    </Typography>
                                                    {openAddressMenu ? <KeyboardArrowUpIcon sx={{ ml: 0.5 }} /> : <KeyboardArrowDownIcon sx={{ ml: 0.5 }} />}
                                                </Box>
                                            </Box>
                                        </Box>
                                        <Menu
                                            anchorEl={anchorEl}
                                            open={openAddressMenu}
                                            onClose={handleCloseAddressMenu}
                                            MenuListProps={{
                                                'aria-labelledby': 'address-selection-button',
                                            }}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'left',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}
                                            sx={{
                                                '& .MuiPaper-root': {
                                                    width: pickupAddressBoxWidth > 0 ? pickupAddressBoxWidth : 'auto',
                                                    boxShadow: 3,
                                                    mt: 0.5,
                                                    borderRadius: '8px',
                                                },
                                                '& .MuiList-root': {
                                                    maxHeight: 200,
                                                    overflow: 'auto',
                                                }
                                            }}
                                        >
                                            {addresses.map((address) => (
                                                <MenuItem
                                                    key={address.id}
                                                    onClick={() => handleSelectAddress(address)}
                                                    selected={selectedPickupAddress?.id === address.id}
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'flex-start',
                                                        width: '100%',
                                                        whiteSpace: 'normal',
                                                        py: 1,
                                                        pr: 2,
                                                        ...(selectedPickupAddress?.id === address.id && {
                                                            bgcolor: 'rgba(0, 0, 0, 0.08)',
                                                        }),
                                                    }}
                                                >
                                                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                                        <Typography
                                                            variant="body2"
                                                            fontWeight={selectedPickupAddress?.id === address.id ? 'bold' : 'normal'}
                                                            sx={{ flexShrink: 0 }}
                                                        >
                                                            {address.fullName} {address.phone}
                                                        </Typography>
                                                        {address.isDefault && (
                                                            <Chip label="Mặc định" size="small" color="default" sx={{ ml: 1, whiteSpace: 'nowrap', flexShrink: 0 }} />
                                                        )}
                                                    </Box>
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{
                                                            flexGrow: 1,
                                                            width: '100%',
                                                            wordBreak: 'break-word',
                                                        }}
                                                    >
                                                        {address.streetAddress}, {address.ward?.name}, {address.district?.name}, {address.province?.name}
                                                    </Typography>
                                                </MenuItem>
                                            ))}
                                            <MenuItem
                                                onClick={() => {
                                                    handleCloseAddressMenu();
                                                    setOpenAddressModal(true);
                                                }}
                                                sx={{ borderTop: '1px solid #eee' }}
                                            >
                                                <Button variant="text" size="small" fullWidth sx={{ justifyContent: 'flex-start' }}>
                                                    + Thêm địa chỉ mới
                                                </Button>
                                            </MenuItem>
                                        </Menu>
                                    </Box>

                                    {/* PHẦN ĐƠN VẬN CHUYỂN */}
<Box
  className="relative mb-4"
  sx={{ display: 'flex', alignItems: 'center', mt: 2 }}
>
  {/* Bên trái */}
  <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
    <Typography variant="body2" fontWeight="medium" sx={{ color: 'text.secondary', mr: 1 }}>
      Đơn Vị Vận Chuyển*
    </Typography>
    <img
      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqXEiDG1aMi9XngtOpoS_XZqRhBJg7Y5PthtiCNuCW8umOPj0AONJVEN3u8pNdyl7p_Fs&usqp=CAU"
      alt="GHN Logo"
      style={{ width: 24, height: 24, marginRight: 8 }}
    />
    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
      {returnRequestDetails?.shippingMethodName || 'GHN'}
    </Typography>
  </Box>

  {/* Phí + Link khít nhau */}
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
  {!loadingPickupFee && typeof pickupFee === 'number' && pickupFee > 0 && (
    <Typography
      variant="body2"
      sx={{
        border: '1px solid red',
        borderRadius: '4px',
        px: 1,
        py: '2px',
        color: 'red',
        fontWeight: 600,
      }}
    >
      Phí vận chuyển: {pickupFee.toLocaleString('vi-VN')} đ
    </Typography>
  )}

  
</Box>

</Box>


                                </Box>
                            </Box>
                        </Box>

                        {/* KHUNG "Trả hàng tại bưu cục" */}
                        <Box
                            onClick={() => setReturnMethod('self_send')}
                            sx={{
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                mb: 2,
                                bgcolor: 'white',
                                p: '16px',
                                cursor: 'pointer',
                                '&:hover': {
                                    borderColor: 'primary.main'
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                <Radio
                                    checked={returnMethod === 'self_send'}
                                    onChange={() => setReturnMethod('self_send')}
                                    value="self_send"
                                    size="small"
                                    sx={{
                                        p: 0, m: 0,
                                        ml: '0px',
                                        mr: '12px',
                                        mt: '2px',
                                        alignSelf: 'flex-start'
                                    }}
                                />
                                <Box sx={{ flexGrow: 1 }}>
                             <Box
  sx={{
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    flexWrap: 'wrap', // để xuống dòng khi hết chỗ
  }}
>
  <Typography variant="body1" fontWeight="bold">
    Trả hàng tại bưu cục
  </Typography>

  <Chip
    label="Vui lòng thanh toán phí vận chuyển"
    size="small"
    variant="outlined"
    sx={{
      borderColor: '#1AA2E9',
      color: '#1AA2E9',
      fontWeight: 600,
      ml: 1,
    }}
  />

  {/* Dòng mô tả thêm */}
  <Typography
    variant="body2"
    color="text.secondary"
    sx={{ width: '100%', mt: 0.5, ml: 0.5 }}
  >
    Bạn có thể chủ động thời gian trả hàng tại các bưu cục đối tác. 
    <span style={{ color: '#1AA2E9', cursor: 'pointer' }}>
      {' '}Bấm để xem địa chỉ gần nhất.
    </span>
  </Typography>
</Box>


 {returnMethod === 'self_send' && (
  <Box sx={{ mt: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Typography variant="body2" fontWeight="bold">
        Chọn dịch vụ vận chuyển:
      </Typography>

      {dropoffServices.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {loading ? 'Đang tải dịch vụ...' : 'Không có dịch vụ khả dụng'}
        </Typography>
      ) : (
        <Box sx={{ flex: 1 }}>
  {dropoffServices.map((svc) => (
    <Box
  key={`${svc.provider}-${svc.serviceCode}`}
  onClick={() => setSelectedDropoffService(svc)}
  sx={{
    border: '1px solid',
    borderColor:
      selectedDropoffService?.provider === svc.provider &&
      selectedDropoffService?.serviceCode === svc.serviceCode
        ? 'primary.main'
        : '#e0e0e0',
    borderRadius: '8px',
    p: 1.5,
    mb: 1,
    cursor: 'pointer',
    '&:hover': { borderColor: 'primary.main' },
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }}
>
  <Box>
    <Typography variant="body2" fontWeight={600}>
      {svc.serviceName}
    </Typography>
  </Box>

 {svc.fee > 0 && (
  <Typography
    variant="body2"
    sx={{
      border: '1px solid red',
      borderRadius: '4px',
      px: 1.5,
      py: '2px',
      color: 'red',
      fontWeight: 600,
      whiteSpace: 'nowrap',
    }}
  >
    Phí vận chuyển: {Number(svc.fee).toLocaleString('vi-VN')} đ
  </Typography>
)}

</Box>

  ))}
</Box>

      )}
    </Box>
  </Box>
)}

                                    
                                </Box>
                            </Box>
                        </Box>
                    </RadioGroup>
                </Box>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                    <Button
                        onClick={handleCancelRequest}
                        variant="outlined"
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? 'Đang huỷ...' : 'Huỷ yêu cầu'}
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading || (returnMethod === 'ghn_pickup' && !selectedPickupAddress)}
                        startIcon={loading && <CircularProgress size={18} />}
                        sx={{
                            bgcolor: 'red',
                            '&:hover': { bgcolor: 'darkred' }
                        }}
                    >
                        {loading ? 'Đang xử lý...' : 'Gửi yêu cầu'}
                    </Button>
                </Box>
            </Paper>

            {openAddressModal && (
                <AddressModal
                    open={openAddressModal}
                    onClose={handleAddressModalClose}
                    onSave={handleSaveNewAddress}
                    editingAddress={null}
                    loading={loading}
                />
            )}
        </>
    );
}