// src/pages/ProfileContent.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { authService } from '../../../../services/client/authService';
import { API_BASE_URL } from '../../../../constants/environment'; // ✅ Import API_BASE_URL
import Loader from '../../../../components/common/Loader'; // <<<< ----- IMPORT LOADER (Điều chỉnh đường dẫn nếu cần)
const ProfileContent = () => {
  const [formData, setFormData] = useState({
    id: null,
    fullName: '',
    email: '',
    phone: '',
    gender: 'other',
    birthDate: { day: '', month: '', year: '' },
  });
  const [userAvatarPreview, setUserAvatarPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);

 const fetchProfileData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await authService.getUserInfo();
      const user = response.data.user;
      setFormData({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        birthDate: {
          day: user.birthDate?.day || '',
          month: user.birthDate?.month || '',
          year: user.birthDate?.year || '',
        },
      });

      if (user.avatarUrl) {
        setUserAvatarPreview(`${user.avatarUrl}?_=${new Date().getTime()}`);
      } else {
        setUserAvatarPreview(null);
      }
    } catch (error) {
      console.error("Lỗi lấy thông tin người dùng:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "birthDay" || name === "birthMonth" || name === "birthYear") {
      const part = name.replace('birth', '').toLowerCase();
      setFormData(prev => ({
        ...prev,
        birthDate: { ...prev.birthDate, [part]: value },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleGenderChange = (e) => {
    setFormData(prev => ({ ...prev, gender: e.target.value }));
  };

  const handleAvatarFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      // Basic file type validation (optional, but good practice)
      const allowedTypes = ['image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
          alert("Định dạng file không hợp lệ. Chỉ chấp nhận .JPEG, .PNG");
          return;
      }
      // Basic file size validation (optional, but good practice)
      if (file.size > 1024 * 1024) { // 1MB
          alert("Dung lượng file quá lớn. Tối đa 1MB.");
          return;
      }

      setSelectedAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserAvatarPreview(e.target.result); // Show local preview
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("fullName", formData.fullName);
    formDataToSubmit.append("phone", formData.phone);
    formDataToSubmit.append("gender", formData.gender);

    const { day, month, year } = formData.birthDate;
    const formattedDate = `${year}-${month}-${day}`;
    formDataToSubmit.append("dateOfBirth", formattedDate);

    if (selectedAvatarFile) {
      formDataToSubmit.append("avatarImage", selectedAvatarFile);
    }

    try {
      const response = await authService.updateProfile(formDataToSubmit, true);
      console.log("✅ [DEBUG] Phản hồi từ server:", response.data);

      if (response.data.user.avatarUrl) {
        const newAvatarUrl = `${API_BASE_URL}${response.data.user.avatarUrl}`;
        setUserAvatarPreview(newAvatarUrl);

        document.querySelector("#sidebar-avatar").src = newAvatarUrl;
        document.querySelector("#header-avatar").src = newAvatarUrl;
      }

      alert("✅ Cập nhật hồ sơ thành công!");
    } catch (error) {
      console.error("❌ [ERROR] Lỗi cập nhật hồ sơ:", error);
    } finally {
      setIsSubmitting(false);
    }
  };


  const maskPhoneNumber = (phone) => {
    if (!phone || phone.length < 4) return phone;
    return `*******${phone.slice(-2)}`;
  };

  const userInitialForAvatar = formData.fullName ? formData.fullName.charAt(0).toUpperCase() : '?';

  if (isLoading && !userAvatarPreview) { // Show loading only on initial full load
    return (
      <div className="bg-white p-6 shadow-md rounded-md border border-gray-200 flex justify-center items-center min-h-[300px]">
        <p className="text-lg">Đang tải thông tin hồ sơ...</p>
      </div>
    );
  }
  if (isLoading) {
    return <Loader fullscreen />; // ✅ Sử dụng Loader full màn hình khi đang tải
  }

  return (
    <div className="bg-white p-6 shadow-md rounded-md border border-gray-200">
      <h1 className="text-xl font-semibold text-gray-800 mb-1.5">Hồ Sơ Của Tôi</h1>
      <p className="text-sm text-gray-600 mb-8">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-10 gap-y-6">
        <form className="lg:col-span-2 space-y-5" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="grid grid-cols-[110px_1fr] items-center gap-4">
            <label htmlFor="email" className="text-sm text-gray-500 text-right pr-2">Email</label>
            <div className="flex items-center">
              <p className="text-sm text-gray-800 mr-3 truncate">{formData.email}</p>
            </div>
          </div>

          {/* Họ và Tên */}
          <div className="grid grid-cols-[110px_1fr] items-center gap-4">
            <label htmlFor="fullName" className="text-sm text-gray-500 text-right pr-2">Họ và Tên</label>
            <div>
              <input
                type="text" id="fullName" name="fullName"
                value={formData.fullName} onChange={handleChange}
                placeholder="Nhập họ và tên của bạn"
                className="w-full p-2.5 border border-gray-300 rounded focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-sm placeholder-gray-400"
              />
            </div>
          </div>

          {/* Số điện thoại */}
          <div className="grid grid-cols-[110px_1fr] items-center gap-4">
            <label htmlFor="phone" className="text-sm text-gray-500 text-right pr-2">Số điện thoại</label>
            {isEditingPhone ? (
              <div>
                <input
                  type="tel" id="phone" name="phone"
                  value={formData.phone} onChange={handleChange}
                  placeholder="Nhập số điện thoại"
                  className="w-full p-2.5 border border-gray-300 rounded focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-sm placeholder-gray-400"
                />
                {/* Optionally add a save/cancel button for phone editing here */}
              </div>
            ) : (
              <div className="flex items-center">
                <p className="text-sm text-gray-800 mr-3 truncate">
                  {formData.phone ? maskPhoneNumber(formData.phone) : "Chưa cập nhật"}
                </p>
                <button
                  type="button" onClick={() => setIsEditingPhone(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 flex-shrink-0"
                >
                  {formData.phone ? "Thay Đổi" : "Thêm"}
                </button>
              </div>
            )}
          </div>

          {/* Giới tính */}
          <div className="grid grid-cols-[110px_1fr] items-center gap-4">
            <label className="text-sm text-gray-500 text-right pr-2">Giới tính</label>
            <div className="flex items-center gap-x-6">
              {['male', 'female', 'other'].map(genderValue => (
                <label key={genderValue} className="flex items-center text-sm text-gray-700 cursor-pointer">
                  <input
                    type="radio" name="gender" value={genderValue}
                    checked={formData.gender === genderValue} onChange={handleGenderChange}
                    className="form-radio-custom" // Ensure this class provides appropriate styling
                  />
                  <span className="ml-2">{genderValue === 'male' ? 'Nam' : genderValue === 'female' ? 'Nữ' : 'Khác'}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Ngày sinh */}
          <div className="grid grid-cols-[110px_1fr] items-start gap-4">
            <label className="text-sm text-gray-500 text-right pr-2 pt-2.5">Ngày sinh</label>
            <div className="grid grid-cols-3 gap-3">
              <select
                name="birthDay" value={formData.birthDate.day} onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-sm text-gray-700 bg-white appearance-none"
              >
                <option value="" disabled>Ngày</option>
                {[...Array(31)].map((_, i) => <option key={i + 1} value={String(i + 1).padStart(2, '0')}>{i + 1}</option>)}
              </select>
              <select
                name="birthMonth" value={formData.birthDate.month} onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-sm text-gray-700 bg-white appearance-none"
              >
                <option value="" disabled>Tháng</option>
                {[...Array(12)].map((_, i) => <option key={i + 1} value={String(i + 1).padStart(2, '0')}>{i + 1}</option>)}
              </select>
              <select
                name="birthYear" value={formData.birthDate.year} onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-sm text-gray-700 bg-white appearance-none"
              >
                <option value="" disabled>Năm</option>
                {Array.from({ length: 100 }, (_, i) => String(new Date().getFullYear() - i)).map(year => <option key={year} value={year}>{year}</option>)}
              </select>
            </div>
          </div>

          {/* Nút Lưu */}
          <div className="grid grid-cols-[110px_1fr] items-center gap-4">
            <div className="lg:col-start-2"> {/* Aligns button with input fields */}
              <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 px-7 rounded text-sm transition-colors shadow-sm"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang lưu..." : "Lưu Thay Đổi"}
          </button>
            </div>
          </div>
        </form>

        {/* Phần Avatar */}
        {/* Phần Avatar */}
<div className="lg:col-span-1 flex flex-col items-center pt-3 lg:pt-0 lg:border-l lg:border-gray-200 lg:pl-8">
  <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center mb-4 overflow-hidden">
    {userAvatarPreview ? (
      <img
        src={userAvatarPreview}
        alt="User Avatar"
        className="w-full h-full object-cover"
      />
    ) : (
      <span className="text-white text-5xl font-semibold">{userInitialForAvatar}</span>
    )}
  </div>

  <input 
    name="avatarImage" 
    type="file" 
    id="avatarUpload" 
    className="hidden" 
    accept=".jpg,.jpeg,.png" 
    onChange={handleAvatarFileChange} 
  />

  <label htmlFor="avatarUpload" className="cursor-pointer bg-white border border-gray-300/80 text-gray-700 text-sm py-2 px-5 rounded hover:bg-gray-50 transition-colors shadow-sm mb-2.5">
    Chọn Ảnh
  </label>
  <div className="text-xs text-gray-500 text-center leading-snug">
    <p>Dung lượng file tối đa 1 MB</p>
    <p>Định dạng: .JPEG, .PNG</p>
  </div>
</div>

      </div>
    </div>
  );
};

export default ProfileContent;