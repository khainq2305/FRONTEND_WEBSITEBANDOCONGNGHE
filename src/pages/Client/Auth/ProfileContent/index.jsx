// src/pages/ProfileContent.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { authService } from '../../../../services/client/authService';
import { API_BASE_URL } from '../../../../constants/environment';
import Loader from '../../../../components/common/Loader'; // Ensure this path is correct

// Component SuccessModal (có thể tách ra file riêng nếu muốn)
const SuccessModal = ({ isOpen, message, onClose }) => {
  useEffect(() => {
    // Chỉ thực hiện khi modal được mở
    if (isOpen) {
      // Lưu lại giá trị overflow ban đầu của body
      const originalBodyOverflow = window.getComputedStyle(document.body).overflow;
      // Ngăn cuộn trên body
      document.body.style.overflow = 'hidden';

      const timer = setTimeout(() => {
        onClose();
      }, 2500); // Tự động đóng sau 2.5 giây

      // Hàm cleanup này sẽ được gọi khi component unmount hoặc trước khi effect chạy lại
      return () => {
        // Khôi phục lại giá trị overflow ban đầu
        document.body.style.overflow = originalBodyOverflow;
        clearTimeout(timer);
      };
    }
    // Không cần 'else' ở đây, vì khi isOpen chuyển từ true sang false,
    // hàm cleanup của lần render trước (khi isOpen là true) sẽ xử lý việc khôi phục overflow.
  }, [isOpen, onClose]); // Effect này sẽ chạy lại nếu isOpen hoặc onClose thay đổi

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" 
      onClick={onClose} 
    >
      <div
        className="bg-white p-6 sm:p-8 rounded-xl shadow-xl text-center w-full max-w-xs sm:max-w-sm mx-auto"
        onClick={(e) => e.stopPropagation()} 
      >
        <svg 
            className="w-14 h-14 sm:w-16 sm:h-16 text-green-500 mx-auto mb-3 sm:mb-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p className="text-base sm:text-lg font-medium text-gray-700">{message}</p>
      </div>
    </div>
  );
};


const ProfileContent = () => {

  const [formData, setFormData] = useState({
    id: null,
    fullName: '',
    email: '',
    phone: '',
    gender: 'other',
    birthDate: { day: '', month: '', year: '' },
  });
  const [initialFormData, setInitialFormData] = useState(null);

  const [userAvatarPreview, setUserAvatarPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingBirthDate, setIsEditingBirthDate] = useState(false);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [avatarError, setAvatarError] = useState("");

  // State cho success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successModalMessage, setSuccessModalMessage] = useState("");

  const fetchProfileData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await authService.getUserInfo();
      const user = response.data?.user || {};
      
      const fetchedBirthDate = {
        day: user.birthDate?.day || '',
        month: user.birthDate?.month || '',
        year: user.birthDate?.year || '',
      };

      const currentData = {
        id: user.id || null,
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || 'other',
        birthDate: fetchedBirthDate,
      };
      setFormData(currentData);
      setInitialFormData(JSON.parse(JSON.stringify(currentData)));

      setIsEditingPhone(false);
      if (!fetchedBirthDate.day || !fetchedBirthDate.month || !fetchedBirthDate.year) {
        setIsEditingBirthDate(true);
      } else {
        setIsEditingBirthDate(false);
      }

      if (user.avatarUrl) {
        setUserAvatarPreview(`${user.avatarUrl}?_=${new Date().getTime()}`);
      } else {
        setUserAvatarPreview(null);
      }
    } catch (error) {
      console.error("Lỗi lấy thông tin người dùng:", error);
      const emptyData = {
        id: null, fullName: '', email: '', phone: '', gender: 'other',
        birthDate: { day: '', month: '', year: '' },
      };
      setFormData(emptyData);
      setInitialFormData(JSON.parse(JSON.stringify(emptyData)));
      setIsEditingBirthDate(true); 
      setIsEditingPhone(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const errorKey = name.startsWith('birth') ? 'dateOfBirth' : name;
    setFormErrors(prevErrors => ({ ...prevErrors, [errorKey]: undefined }));

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
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 1 * 1024 * 1024; 

      if (!allowedTypes.includes(file.type)) {
        setAvatarError("❌ Định dạng không hợp lệ. Chỉ chấp nhận .JPEG, .PNG, .JPG.");
        setSelectedAvatarFile(null); 
        event.target.value = null; 
        return;
      }
      if (file.size > maxSize) {
        setAvatarError(`❌ Dung lượng ảnh vượt quá ${maxSize / (1024*1024)}MB.`);
        setSelectedAvatarFile(null);
        event.target.value = null;
        return;
      }
      setAvatarError("");
      setSelectedAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setUserAvatarPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCancelEditPhone = () => {
    setFormData(prev => ({ ...prev, phone: initialFormData.phone }));
    setIsEditingPhone(false);
    setFormErrors(prev => ({ ...prev, phone: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});

    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("fullName", formData.fullName);
      formDataToSubmit.append("phone", formData.phone);
      formDataToSubmit.append("gender", formData.gender);

      const { day, month, year } = formData.birthDate;
      if (day && month && year) {
        formDataToSubmit.append("birthDate", JSON.stringify({ day, month, year }));
      } else if (!day && !month && !year) {
        formDataToSubmit.append("birthDate", JSON.stringify({ day: "", month: "", year: "" }));
      }
      
      if (selectedAvatarFile) {
        formDataToSubmit.append("avatarImage", selectedAvatarFile);
      }

      const response = await authService.updateProfile(formDataToSubmit, true);
      const updatedUser = response.data.user;
      
      const updatedBirthDate = {
        day: updatedUser.birthDate?.day || '',
        month: updatedUser.birthDate?.month || '',
        year: updatedUser.birthDate?.year || '',
      };

      const newData = {
        id: updatedUser.id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        gender: updatedUser.gender,
        birthDate: updatedBirthDate,
      };
      setFormData(newData);
      setInitialFormData(JSON.parse(JSON.stringify(newData)));

      setSelectedAvatarFile(null);
      if(document.getElementById('avatarUpload')) { 
        document.getElementById('avatarUpload').value = null;
      }
      
      setIsEditingPhone(false);
      if (!updatedBirthDate.day || !updatedBirthDate.month || !updatedBirthDate.year) {
        setIsEditingBirthDate(true);
      } else {
        setIsEditingBirthDate(false);
      }

      if (updatedUser.avatarUrl) {
        const finalAvatarUrl = updatedUser.avatarUrl.startsWith("http")
          ? `${updatedUser.avatarUrl}?_=${new Date().getTime()}`
          : `${API_BASE_URL}${updatedUser.avatarUrl}?_=${new Date().getTime()}`;
        setUserAvatarPreview(finalAvatarUrl);
        window.dispatchEvent(new CustomEvent("avatarUpdated", { detail: finalAvatarUrl }));
      } else {
        setUserAvatarPreview(null);
        window.dispatchEvent(new CustomEvent("avatarUpdated", { detail: null }));
      }

      window.dispatchEvent(new CustomEvent("profileUpdated", { 
        detail: { user: { fullName: updatedUser.fullName, email: updatedUser.email }}
      }));

      setSuccessModalMessage("Cập nhật thành công"); 
      setShowSuccessModal(true);

    } catch (error) {
      console.error("❌ [ERROR] Lỗi cập nhật hồ sơ:", error);
      const serverErrors = error.response?.data?.errors;
      if (serverErrors) {
        setFormErrors(serverErrors);
        if(serverErrors.dateOfBirth) {
            setIsEditingBirthDate(true);
        }
      } else if (error.response?.data?.message) {
        const errorMessage = error.response.data.message;
        setFormErrors({ general: errorMessage });
        if (errorMessage.toLowerCase().includes("date") || errorMessage.toLowerCase().includes("ngày sinh")) {
            setIsEditingBirthDate(true);
            setFormErrors(prev => ({...prev, dateOfBirth: errorMessage}));
        }
        alert("❌ " + errorMessage); 
      } else {
        alert("❌ Có lỗi xảy ra khi cập nhật hồ sơ. Vui lòng thử lại.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const maskPhoneNumber = (phone) => {
    if (!phone || phone.length < 4) return phone;
    return `*******${phone.slice(-2)}`;
  };

  const userInitialForAvatar = formData.fullName ? formData.fullName.charAt(0).toUpperCase() : '?';

  if (isLoading) {
    return (
      <div className="bg-white p-6 shadow-md rounded-md border border-gray-200 flex justify-center items-center min-h-[300px]">
        <Loader fullscreen text="Đang tải thông tin hồ sơ..." /> 
      </div>
    );
  }
  
  const birthDateComplete = formData.birthDate.day && formData.birthDate.month && formData.birthDate.year;
  const showBirthDateForm = isEditingBirthDate || !birthDateComplete;

  return (
    <> 
      <div className="bg-white p-6 shadow-md rounded-md border border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800 mb-1.5">Hồ Sơ Của Tôi</h1>
        <p className="text-sm text-gray-600 mb-8">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-10 gap-y-6">
            <form className="lg:col-span-2 space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-[110px_1fr] items-center gap-4">
                <label className="text-sm text-gray-500 text-right pr-2">Email</label>
                <p className="text-sm text-gray-800 truncate">{formData.email}</p>
            </div>
            <div className="grid grid-cols-[110px_1fr] items-center gap-4">
                <label htmlFor="fullName" className="text-sm text-gray-500 text-right pr-2">Họ và Tên</label>
                <div>
                <input
                    type="text" id="fullName" name="fullName"
                    value={formData.fullName} onChange={handleChange}
                    placeholder="Nhập họ và tên của bạn"
                    className="w-full p-2.5 border border-gray-300 rounded focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-sm placeholder-gray-400"
                    disabled={isSubmitting}
                />
                {formErrors.fullName && <p className="text-sm text-red-500 mt-1">{formErrors.fullName}</p>}
                </div>
            </div>
            <div className="grid grid-cols-[110px_1fr] items-start gap-4"> 
                <label htmlFor="phone" className="text-sm text-gray-500 text-right pr-2 pt-2.5">Số điện thoại</label> 
                {isEditingPhone ? (
                <div>
                    <div className="flex items-center gap-2">
                        <input
                        type="tel" id="phone" name="phone"
                        value={formData.phone} onChange={handleChange}
                        placeholder="Nhập số điện thoại"
                        className="w-full p-2.5 border border-gray-300 rounded focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-sm placeholder-gray-400"
                        disabled={isSubmitting}
                        />
                        <button
                            type="button" onClick={handleCancelEditPhone}
                            className="text-sm text-gray-600 hover:text-gray-800 p-2.5 border border-gray-300 rounded"
                            disabled={isSubmitting}
                        >
                            Hủy
                        </button>
                    </div>
                    {formErrors.phone && <p className="text-sm text-red-500 mt-1">{formErrors.phone}</p>}
                </div>
                ) : (
                <div className="flex items-center pt-1.5"> 
                    <p className="text-sm text-gray-800 mr-3 truncate">
                    {formData.phone ? maskPhoneNumber(formData.phone) : "Chưa cập nhật"}
                    </p>
                    <button
                    type="button" onClick={() => {
                        setInitialFormData(JSON.parse(JSON.stringify(formData)));
                        setIsEditingPhone(true);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 flex-shrink-0"
                    disabled={isSubmitting}
                    >
                    {formData.phone ? "Thay Đổi" : "Thêm"}
                    </button>
                </div>
                )}
            </div>
            <div className="grid grid-cols-[110px_1fr] items-center gap-4">
                <label className="text-sm text-gray-500 text-right pr-2">Giới tính</label>
                <div className="flex items-center gap-x-6">
                {['male', 'female', 'other'].map(genderValue => (
                    <label key={genderValue} className="flex items-center text-sm text-gray-700 cursor-pointer">
                    <input
                        type="radio" name="gender" value={genderValue}
                        checked={formData.gender === genderValue} onChange={handleGenderChange}
                        className="form-radio-custom"
                        disabled={isSubmitting}
                    />
                    <span className="ml-2">{genderValue === 'male' ? 'Nam' : genderValue === 'female' ? 'Nữ' : 'Khác'}</span>
                    </label>
                ))}
                </div>
            </div>
            <div className="grid grid-cols-[110px_1fr] items-start gap-4">
                <label className="text-sm text-gray-500 text-right pr-2 pt-2.5">Ngày sinh</label>
                {showBirthDateForm ? (
                <div className="w-full"> 
                    <div className="flex items-center justify-between gap-x-3 w-full">
                    <div className="flex gap-x-3 flex-1">
                        <select
                        name="birthDay" value={formData.birthDate.day} onChange={handleChange}
                        className="w-full p-2.5 border border-gray-300 rounded focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-sm text-gray-700 bg-white appearance-none"
                        disabled={isSubmitting}
                        >
                        <option value="">Ngày</option>
                        {[...Array(31)].map((_, i) => <option key={i + 1} value={String(i + 1).padStart(2, '0')}>{String(i + 1).padStart(2, '0')}</option>)}
                        </select>
                        <select
                        name="birthMonth" value={formData.birthDate.month} onChange={handleChange}
                        className="w-full p-2.5 border border-gray-300 rounded focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-sm text-gray-700 bg-white appearance-none"
                        disabled={isSubmitting}
                        >
                        <option value="">Tháng</option>
                        {[...Array(12)].map((_, i) => <option key={i + 1} value={String(i + 1).padStart(2, '0')}>{String(i + 1).padStart(2, '0')}</option>)}
                        </select>
                        <select
                        name="birthYear" value={formData.birthDate.year} onChange={handleChange}
                        className="w-full p-2.5 border border-gray-300 rounded focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-sm text-gray-700 bg-white appearance-none"
                        disabled={isSubmitting}
                        >
                        <option value="">Năm</option>
                        {Array.from({ length: 83 }, (_, i) => String(new Date().getFullYear() - 18 - i)).map(year => <option key={year} value={year}>{year}</option>)}
                        </select>
                    </div>
                    {birthDateComplete && isEditingBirthDate && (
                        <button
                        type="button"
                        onClick={() => {
                            setIsEditingBirthDate(false);
                            setFormErrors((prev) => ({ ...prev, dateOfBirth: undefined }));
                        }}
                        className="text-sm text-blue-600 hover:text-blue-700 whitespace-nowrap p-2.5 border border-gray-300 rounded" 
                        disabled={isSubmitting}
                        >
                        Ẩn trường nhập
                        </button>
                    )}
                    </div>
                    {formErrors.dateOfBirth && (
                    <p className="text-sm text-red-500 mt-2 w-full">{formErrors.dateOfBirth}</p>
                    )}
                </div>
                ) : (
                <div className="flex items-center pt-1.5"> 
                    <p className="text-sm text-gray-800 mr-3">
                    {formData.birthDate.day && formData.birthDate.month && formData.birthDate.year ? 
                        `${String(formData.birthDate.day).padStart(2, '0')}/${String(formData.birthDate.month).padStart(2, '0')}/${formData.birthDate.year}`
                        : "Chưa cập nhật"
                    }
                    </p>
                    <button
                    type="button"
                    onClick={() => {
                        setInitialFormData(JSON.parse(JSON.stringify(formData)));
                        setIsEditingBirthDate(true);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 flex-shrink-0"
                    disabled={isSubmitting}
                    >
                    Thay Đổi
                    </button>
                </div>
                )}
            </div>
            <div className="grid grid-cols-[110px_1fr] items-center gap-4">
                <div className="lg:col-start-2">
                <button
                    type="submit"
                    className={`bg-primary hover:opacity-90 text-white font-medium py-2.5 px-7 rounded text-sm transition-colors shadow-sm ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Đang lưu..." : "Lưu Thay Đổi"}
                </button>
                </div>
            </div>
            {formErrors.general && <p className="text-sm text-red-500 mt-2 lg:col-start-2">{formErrors.general}</p>}
            </form>

            <div className="lg:col-span-1 flex flex-col items-center pt-3 lg:pt-0 lg:border-l lg:border-gray-200 lg:pl-8">
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center mb-4 overflow-hidden">
                {userAvatarPreview ? (
                <img src={userAvatarPreview} alt="User Avatar" className="w-full h-full object-cover" />
                ) : (
                <span className="text-white text-5xl font-semibold">{userInitialForAvatar}</span>
                )}
            </div>
            <input 
                name="avatarImage" type="file" id="avatarUpload" className="hidden" 
                accept=".jpg,.jpeg,.png" onChange={handleAvatarFileChange} disabled={isSubmitting} 
            />
            <label htmlFor="avatarUpload" className={`cursor-pointer bg-white border border-gray-300/80 text-gray-700 text-sm py-2 px-5 rounded hover:bg-gray-50 transition-colors shadow-sm mb-2.5 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                Chọn Ảnh
            </label>
            <div className="text-xs text-gray-500 text-center leading-snug">
                <p>Dung lượng file tối đa 1 MB</p>
                <p>Định dạng: .JPEG, .PNG, .JPG</p>
            </div>
            {avatarError && <p className="text-xs text-red-500 mt-2 text-center">{avatarError}</p>}
            </div>
        </div>
      </div>

      <SuccessModal 
        isOpen={showSuccessModal}
        message={successModalMessage}
        onClose={() => setShowSuccessModal(false)}
      />
    </>
  );
};

export default ProfileContent;