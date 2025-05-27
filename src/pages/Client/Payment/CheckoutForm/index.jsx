import React, { useEffect, useState } from "react";
import { userAddressService } from "../../../../services/client/userAddressService";
import { authService } from "../../../../services/client/authService"; // 👈 API lấy user info

const CheckoutForm = () => {
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- State mới chỉ để quản lý UI ---
  const [deliveryMethod, setDeliveryMethod] = useState("deliverToHome"); // 'deliverToHome' hoặc 'pickUpAtStore'
  // 'showDefaultOrBook': hiển thị địa chỉ mặc định (nếu có) như là "sổ địa chỉ"
  // 'newAddressForm': hiển thị form nhập địa chỉ mới
  const [homeDeliveryUIState, setHomeDeliveryUIState] = useState("showDefaultOrBook");

  // State cho các trường input của form địa chỉ mới (để người dùng có thể nhập liệu)
  const [formFullName, setFormFullName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formProvince, setFormProvince] = useState("");
  const [formDistrict, setFormDistrict] = useState("");
  const [formWard, setFormWard] = useState("");
  const [formStreetAddress, setFormStreetAddress] = useState("");
  const [formNotes, setFormNotes] = useState("");
  // --- Hết state mới ---

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [addressRes, userRes] = await Promise.all([
          userAddressService.getDefault(),
          authService.getUserInfo(), // API trả về { fullName, phone, email }
        ]);

        const fetchedDefaultAddress = addressRes.data?.data || null;
        setDefaultAddress(fetchedDefaultAddress);

        const fetchedUserInfo = userRes.data || null;
        setUserInfo(fetchedUserInfo);

        // Thiết lập state ban đầu cho UI dựa trên dữ liệu
        if (fetchedDefaultAddress) {
          setHomeDeliveryUIState("showDefaultOrBook");
          // Điền thông tin người nhận cho phần hiển thị địa chỉ mặc định/sổ địa chỉ
          setFormFullName(fetchedDefaultAddress.fullName);
          setFormPhone(fetchedDefaultAddress.phone);
        } else {
          // Nếu không có địa chỉ mặc định, hiển thị form nhập mới
          setHomeDeliveryUIState("newAddressForm");
          if (fetchedUserInfo) {
            // Điền sẵn tên và SĐT từ userInfo cho form mới
            setFormFullName(fetchedUserInfo.fullName || "");
            setFormPhone(fetchedUserInfo.phone || "");
          }
        }
      } catch (err) {
        console.error("Lỗi lấy dữ liệu:", err);
        // Nếu lỗi, cũng mặc định cho nhập địa chỉ mới
        setHomeDeliveryUIState("newAddressForm");
        if (userInfo) { // userInfo có thể đã được fetch ở lần render trước nếu có lỗi sau đó
          setFormFullName(userInfo.fullName || "");
          setFormPhone(userInfo.phone || "");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); // Chỉ chạy 1 lần khi component mount


  const handleSwitchToNewAddressForm = () => {
    setHomeDeliveryUIState("newAddressForm");
    // Khi chuyển sang form mới:
    // - Nếu *không* có địa chỉ mặc định, tên và SĐT nên lấy từ userInfo.
    // - Nếu *có* địa chỉ mặc định, người dùng có thể muốn sửa thông tin đó,
    //   hoặc nhập mới hoàn toàn. Hiện tại, nếu có userInfo thì ưu tiên userInfo cho form mới.
    if (userInfo) {
        setFormFullName(userInfo.fullName || (defaultAddress ? defaultAddress.fullName : ""));
        setFormPhone(userInfo.phone || (defaultAddress ? defaultAddress.phone : ""));
    }
    // Xóa các trường địa chỉ chi tiết để người dùng nhập mới
    setFormProvince("");
    setFormDistrict("");
    setFormWard("");
    setFormStreetAddress("");
  };

  const handleSwitchToShowDefaultOrBook = () => {
    // Chỉ cho phép chuyển nếu có defaultAddress (đóng vai trò "sổ địa chỉ")
    if (defaultAddress) {
      setHomeDeliveryUIState("showDefaultOrBook");
      // Điền lại thông tin người nhận từ defaultAddress
      setFormFullName(defaultAddress.fullName);
      setFormPhone(defaultAddress.phone);
    }
  };

  const getFullAddressString = (address) => {
    if (!address) return "";
    return [
      address.streetAddress,
      address.ward?.name,
      address.district?.name,
      address.province?.name,
    ]
      .filter(Boolean)
      .join(", ");
  };

  if (loading) return <p className="text-sm text-gray-600 p-4">Đang tải dữ liệu...</p>;

  // Xác định Tên và SĐT sẽ hiển thị ở đầu mục "Giao hàng tận nơi"
  // Nó sẽ là thông tin của defaultAddress nếu đang xem "sổ địa chỉ",
  // hoặc là giá trị đang nhập trong form nếu đang nhập địa chỉ mới.
  const displayedRecipientName = homeDeliveryUIState === 'showDefaultOrBook' && defaultAddress
    ? defaultAddress.fullName
    : formFullName;
  const displayedRecipientPhone = homeDeliveryUIState === 'showDefaultOrBook' && defaultAddress
    ? defaultAddress.phone
    : formPhone;


  return (
    <div className="space-y-4 md:space-y-6 text-sm bg-gray-50 p-2 md:p-4">
      {/* THÔNG TIN KHÁCH HÀNG */}
      <section className="bg-white rounded-lg p-4 shadow">
        <h2 className="font-semibold mb-3 text-base text-gray-800">Thông tin khách hàng</h2>
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-700">{userInfo?.fullName || "Chưa có tên"}</span>
          <span className="text-sm text-gray-600">{userInfo?.phone || "Chưa có SĐT"}</span>
        </div>
        <div className="text-sm text-gray-500 mt-1 border-t pt-2">
            Email: {userInfo?.email || <span className="text-gray-400 italic">Email chưa cập nhật</span>}
        </div>
         <p className="text-xs text-gray-400 mt-2">(*) Hóa đơn VAT sẽ được gửi qua email này</p>
      </section>

      {/* HÌNH THỨC NHẬN HÀNG */}
      <section className="bg-white rounded-lg p-4 shadow">
        <h2 className="font-semibold mb-3 text-base text-gray-800">Hình thức nhận hàng</h2>
        <div className="flex border border-gray-200 rounded-md">
          <label className={`flex-1 p-3 text-center cursor-pointer rounded-l-md ${ deliveryMethod === "pickUpAtStore" ? "bg-red-500 text-white font-medium" : "bg-gray-100 hover:bg-gray-200"}`}>
            <input type="radio" name="deliveryMethodOption" value="pickUpAtStore" checked={deliveryMethod === "pickUpAtStore"} onChange={() => setDeliveryMethod("pickUpAtStore")} className="sr-only" />
            Nhận tại cửa hàng
          </label>
          <label className={`flex-1 p-3 text-center cursor-pointer rounded-r-md border-l border-gray-200 ${ deliveryMethod === "deliverToHome" ? "bg-red-500 text-white font-medium" : "bg-gray-100 hover:bg-gray-200"}`}>
            <input type="radio" name="deliveryMethodOption" value="deliverToHome" checked={deliveryMethod === "deliverToHome"} onChange={() => setDeliveryMethod("deliverToHome")} className="sr-only"/>
            Giao hàng tận nơi
          </label>
        </div>

        {deliveryMethod === "pickUpAtStore" && (
          <div className="mt-4 space-y-3">
            <input type="text" placeholder="Tỉnh/Thành Phố" defaultValue="Hồ Chí Minh" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500"/>
            <input type="text" placeholder="Chọn quận/huyện" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500"/>
            <input type="text" placeholder="Chọn địa chỉ cửa hàng" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500"/>
            <textarea rows="2" placeholder="Ghi chú (nếu có)" className="w-full border border-gray-300 rounded-md px-3 py-2 resize-none focus:ring-red-500 focus:border-red-500"/>
            <p className="text-xs text-gray-500 mt-1">Mẹo: Bạn có thể cài đặt Sổ địa chỉ tại Smember để đặt hàng nhanh hơn.</p>
          </div>
        )}

        {deliveryMethod === "deliverToHome" && (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">TÊN NGƯỜI NHẬN</label>
                    <input
                        type="text"
                        value={displayedRecipientName}
                        onChange={(e) => setFormFullName(e.target.value)}
                        placeholder="Họ và tên người nhận"
                        disabled={homeDeliveryUIState === 'showDefaultOrBook'} // Chỉ sửa được khi nhập mới
                        className={`w-full border ${homeDeliveryUIState === 'showDefaultOrBook' ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300'} rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500`}
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">SĐT NGƯỜI NHẬN</label>
                    <input
                        type="text"
                        value={displayedRecipientPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        placeholder="Số điện thoại"
                        disabled={homeDeliveryUIState === 'showDefaultOrBook'} // Chỉ sửa được khi nhập mới
                        className={`w-full border ${homeDeliveryUIState === 'showDefaultOrBook' ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300'} rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500`}
                    />
                </div>
            </div>

            {homeDeliveryUIState === 'showDefaultOrBook' ? (
              defaultAddress ? (
                <div className="space-y-2">
                  <div className="p-3 border border-gray-200 rounded-md bg-gray-50">
                    <p className="text-gray-600 text-sm">{getFullAddressString(defaultAddress)}</p>
                    <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full font-semibold ml-2">MẶC ĐỊNH</span>
                  </div>
                  <button
                    onClick={handleSwitchToNewAddressForm}
                    className="text-red-500 hover:text-red-600 font-medium text-sm"
                  >
                    hoặc nhập địa chỉ mới
                  </button>
                </div>
              ) : (
                // Trường hợp không có defaultAddress nhưng state lại là 'showDefaultOrBook'
                // (do lỗi logic hoặc user cố tình quay lại khi không có gì)
                // thì nên hiển thị thông báo và nút để nhập mới.
                <div className="p-3 border border-dashed rounded-md text-center">
                    <p className="text-gray-500">Sổ địa chỉ trống.</p>
                    <button
                        onClick={handleSwitchToNewAddressForm}
                        className="text-red-500 hover:text-red-600 font-medium text-sm mt-1"
                    >
                        Nhập địa chỉ mới
                    </button>
                </div>
              )
            ) : ( // homeDeliveryUIState === 'newAddressForm'
              <div className="space-y-3">
                <input type="text" placeholder="Tỉnh/Thành Phố" value={formProvince} onChange={(e) => setFormProvince(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500"/>
                <input type="text" placeholder="Quận/Huyện" value={formDistrict} onChange={(e) => setFormDistrict(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500"/>
                <input type="text" placeholder="Phường/Xã" value={formWard} onChange={(e) => setFormWard(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500"/>
                <input type="text" placeholder="Số nhà, tên đường" value={formStreetAddress} onChange={(e) => setFormStreetAddress(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500"/>
                {defaultAddress && ( // Chỉ hiện nút này nếu có defaultAddress ("sổ địa chỉ") để quay về
                  <button
                    onClick={handleSwitchToShowDefaultOrBook}
                    className="text-red-500 hover:text-red-600 font-medium text-sm"
                  >
                    chọn từ sổ địa chỉ &gt;
                  </button>
                )}
              </div>
            )}
            <textarea rows="2" placeholder="Ghi chú (Ví dụ: Hãy gọi tôi khi chuẩn bị hàng xong)" value={formNotes} onChange={(e) => setFormNotes(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 resize-none focus:ring-red-500 focus:border-red-500"/>
            <p className="text-xs text-gray-500 mt-1">Mẹo: Bạn có thể cài đặt Sổ địa chỉ tại Smember để đặt hàng nhanh hơn.</p>
          </div>
        )}
      </section>

      {/* Xuất hóa đơn */}
      <section className="bg-white rounded-lg p-4 shadow flex items-center justify-between">
        <span className="font-semibold text-gray-700">Xuất hóa đơn điện tử</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-red-500 peer-focus:ring-2 peer-focus:ring-red-300 transition-all after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 peer-checked:after:translate-x-full" />
        </label>
      </section>
    </div>
  );
};

export default CheckoutForm;