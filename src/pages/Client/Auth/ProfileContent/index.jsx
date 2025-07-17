// src/pages/ProfileContent.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react'; 
import { authService } from '../../../../services/client/authService';
import { API_BASE_URL } from '../../../../constants/environment';
import Loader from '../../../../components/common/Loader';
import GradientButton from '../../../../components/Client/GradientButton';
import Select from 'react-select';

const SuccessModal = ({ isOpen, message, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      const originalBodyOverflow = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';

      const timer = setTimeout(() => {
        onClose();
      }, 2500);
      return () => {
        document.body.style.overflow = originalBodyOverflow;
        clearTimeout(timer);
      };
    }
  }, [isOpen, onClose]);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white p-6 sm:p-8 rounded-md shadow-md text-center w-full max-w-xs sm:max-w-sm mx-auto dark:bg-gray-800 dark:text-gray-100"
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
        <p className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-100">{message}</p>
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
    birthDate: { day: '', month: '', year: '' }
  });
  const [initialFormData, setInitialFormData] = useState(null);

  const [userAvatarPreview, setUserAvatarPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingBirthDate, setIsEditingBirthDate] = useState(false);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [avatarError, setAvatarError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successModalMessage, setSuccessModalMessage] = useState('');

  const fileInputRef = useRef(null); 

  const fetchProfileData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await authService.getUserInfo();
      const user = response.data?.user || {};

      const fetchedBirthDate = {
        day: user.birthDate?.day || '',
        month: user.birthDate?.month || '',
        year: user.birthDate?.year || ''
      };

      const currentData = {
        id: user.id || null,
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || 'other',
        birthDate: fetchedBirthDate
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
        const cleanedApiBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
        const finalAvatarUrl = user.avatarUrl.startsWith('http://') || user.avatarUrl.startsWith('https://')
          ? `${user.avatarUrl}?_=${new Date().getTime()}`
          : `${cleanedApiBaseUrl}${user.avatarUrl.startsWith('/') ? user.avatarUrl.substring(1) : user.avatarUrl}?_=${new Date().getTime()}`;
        setUserAvatarPreview(finalAvatarUrl);
      } else {
        setUserAvatarPreview(null);
      }
    } catch (error) {
      console.error('Lỗi lấy thông tin người dùng:', error);
      const emptyData = {
        id: null,
        fullName: '',
        email: '',
        phone: '',
        gender: 'other',
        birthDate: { day: '', month: '', year: '' }
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
    setFormErrors((prevErrors) => ({ ...prevErrors, [errorKey]: undefined }));

    if (name === 'birthDay' || name === 'birthMonth' || name === 'birthYear') {
      const part = name.replace('birth', '').toLowerCase();
      setFormData((prev) => ({
        ...prev,
        birthDate: { ...prev.birthDate, [part]: value }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleGenderChange = (e) => {
    setFormData((prev) => ({ ...prev, gender: e.target.value }));
  };

  const handleAvatarFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        setAvatarError('Định dạng không hợp lệ. Chỉ chấp nhận .JPEG, .PNG, .JPG.');
        setSelectedAvatarFile(null);
        if (fileInputRef.current) fileInputRef.current.value = null; // Clear file input
        return;
      }
      if (file.size > maxSize) {
        setAvatarError(`Dung lượng ảnh vượt quá ${maxSize / (1024 * 1024)}MB.`);
        setSelectedAvatarFile(null);
        if (fileInputRef.current) fileInputRef.current.value = null; // Clear file input
        return;
      }
      setAvatarError('');
      setSelectedAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setUserAvatarPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCancelEditPhone = () => {
    setFormData((prev) => ({ ...prev, phone: initialFormData.phone }));
    setIsEditingPhone(false);
    setFormErrors((prev) => ({ ...prev, phone: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (avatarError) return;
    setIsSubmitting(true);
    setFormErrors({});

    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('fullName', formData.fullName);
      formDataToSubmit.append('phone', formData.phone);
      formDataToSubmit.append('gender', formData.gender);

      const { day, month, year } = formData.birthDate;
      if (day && month && year) {
        formDataToSubmit.append('birthDate', JSON.stringify({ day, month, year }));
      } else if (initialFormData.birthDate.day || initialFormData.birthDate.month || initialFormData.birthDate.year) {
        formDataToSubmit.append('birthDate', JSON.stringify({ day: '', month: '', year: '' }));
      }

      if (selectedAvatarFile) {
        formDataToSubmit.append('avatarImage', selectedAvatarFile);
      }

      const response = await authService.updateProfile(formDataToSubmit, true);
      const updatedUser = response.data.user;

      const updatedBirthDate = {
        day: updatedUser.birthDate?.day || '',
        month: updatedUser.birthDate?.month || '',
        year: updatedUser.birthDate?.year || ''
      };

      const newData = {
        id: updatedUser.id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        gender: updatedUser.gender,
        birthDate: updatedBirthDate
      };
      setFormData(newData);
      setInitialFormData(JSON.parse(JSON.stringify(newData)));

      setSelectedAvatarFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }

      setIsEditingPhone(false);
      if (!updatedBirthDate.day || !updatedBirthDate.month || !updatedBirthDate.year) {
        setIsEditingBirthDate(true);
      } else {
        setIsEditingBirthDate(false);
      }

      if (updatedUser.avatarUrl) {
        const cleanedApiBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
        const finalAvatarUrl = updatedUser.avatarUrl.startsWith('http')
          ? `${updatedUser.avatarUrl}?_=${new Date().getTime()}`
          : `${cleanedApiBaseUrl}${updatedUser.avatarUrl.startsWith('/') ? updatedUser.avatarUrl.substring(1) : updatedUser.avatarUrl}?_=${new Date().getTime()}`;
        setUserAvatarPreview(finalAvatarUrl);
        window.dispatchEvent(new CustomEvent('avatarUpdated', { detail: finalAvatarUrl }));
      } else {
        setUserAvatarPreview(null);
        window.dispatchEvent(new CustomEvent('avatarUpdated', { detail: null }));
      }

      window.dispatchEvent(
        new CustomEvent('profileUpdated', {
          detail: { user: { fullName: updatedUser.fullName, email: updatedUser.email } }
        })
      );

      setSuccessModalMessage('Cập nhật thành công');
      setShowSuccessModal(true);
    } catch (error) {
      
      const serverErrors = error.response?.data?.errors;
      if (serverErrors) {
        setFormErrors(serverErrors);
        if (serverErrors.dateOfBirth) {
          setIsEditingBirthDate(true);
        }
      } else if (error.response?.data?.message) {
        const errorMessage = error.response.data.message;
        setFormErrors({ general: errorMessage });
        if (errorMessage.toLowerCase().includes('date') || errorMessage.toLowerCase().includes('ngày sinh')) {
          setIsEditingBirthDate(true);
          setFormErrors((prev) => ({ ...prev, dateOfBirth: errorMessage }));
        }
        alert('' + errorMessage);
      } else {
        alert('Có lỗi xảy ra khi cập nhật hồ sơ. Vui lòng thử lại.');
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
      <div className="bg-white dark:bg-gray-800 p-6 shadow-md rounded-md border border-gray-200 dark:border-gray-700 flex justify-center items-center min-h-[300px]">
        <Loader fullscreen text="Đang tải thông tin hồ sơ..." />
      </div>
    );
  }

  const birthDateComplete = formData.birthDate.day && formData.birthDate.month && formData.birthDate.year;
  const showBirthDateForm = isEditingBirthDate || !birthDateComplete;
const dayOptions = Array.from({ length: 31 }, (_, i) => ({
  value: String(i + 1).padStart(2, '0'),
  label: String(i + 1).padStart(2, '0'),
}));

const monthOptions = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1).padStart(2, '0'),
  label: String(i + 1).padStart(2, '0'),
}));

const yearOptions = Array.from({ length: 83 }, (_, i) => {
  const year = String(new Date().getFullYear() - 18 - i);
  return { value: year, label: year };
});

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-6 shadow-md rounded-md border border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-1.5">Hồ Sơ Của Tôi</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-8">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-10 gap-y-6">
         
          <form className="lg:col-span-2 space-y-5" onSubmit={handleSubmit}>
             
                <div className="flex flex-col items-center pt-3 pb-6 border-b border-gray-200 dark:border-gray-700 mb-6 lg:hidden">
                    <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center mb-4 overflow-hidden border border-gray-300 dark:border-gray-600">
                        {userAvatarPreview ? (
                            <img src={userAvatarPreview} alt="User Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-white text-5xl font-semibold">{userInitialForAvatar}</span>
                        )}
                    </div>
                    <input
                        name="avatarImage"
                        type="file"
                        id="avatarUploadMobile" 
                        className="hidden"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleAvatarFileChange}
                        disabled={isSubmitting}
                        ref={fileInputRef}
                    />
                    <label
                        htmlFor="avatarUploadMobile" 
                        className={`cursor-pointer bg-white border border-gray-300/80 text-gray-700 text-sm py-2 px-5 rounded hover:bg-gray-50 transition-colors shadow-sm mb-2.5                             dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-600
                            ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}                    >
                        Chọn Ảnh
                    </label>
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center leading-snug">
                        <p>Dung lượng file tối đa 5 MB</p>
                        <p>Định dạng: .JPEG, .PNG, .JPG</p>
                    </div>
                    {avatarError && <p className="text-xs text-red-500 mt-2 text-center">{avatarError}</p>}
                </div>


          
            <div className="grid grid-cols-1 sm:grid-cols-[110px_1fr] items-center gap-2 sm:gap-4">
              <label className="text-sm text-gray-500 dark:text-gray-400 sm:text-right sm:pr-2">Email</label>
              <p className="text-sm text-gray-800 dark:text-gray-200 truncate font-medium">
                {formData.email}
              </p>
            </div>

 
            <div className="grid grid-cols-1 sm:grid-cols-[110px_1fr] items-center gap-2 sm:gap-4">
              <label htmlFor="fullName" className="text-sm text-gray-500 dark:text-gray-400 sm:text-right sm:pr-2">
                Họ và Tên
              </label>
              <div>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Nhập họ và tên của bạn"
                  className="w-full p-2.5 border border-gray-300 rounded focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-sm placeholder-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 dark:placeholder-gray-400"
                  disabled={isSubmitting}
                />
                {formErrors.fullName && <p className="text-sm text-red-500 mt-1">{formErrors.fullName}</p>}
              </div>
            </div>

           
            <div className="grid grid-cols-1 sm:grid-cols-[110px_1fr] items-start gap-2 sm:gap-4">
              <label htmlFor="phone" className="text-sm text-gray-500 dark:text-gray-400 sm:text-right sm:pr-2 pt-2.5">
                Số điện thoại
              </label>
              {isEditingPhone ? (
                <div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Nhập số điện thoại"
                      className="w-full p-2.5 border border-gray-300 rounded focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-sm placeholder-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 dark:placeholder-gray-400"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={handleCancelEditPhone}
                      className="w-full sm:w-auto text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 p-2.5 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex-shrink-0"
                      disabled={isSubmitting}
                    >
                      Hủy
                    </button>
                  </div>
                  {formErrors.phone && <p className="text-sm text-red-500 mt-1">{formErrors.phone}</p>}
                </div>
              ) : (
                <div className="flex items-center pt-1.5">
                  <p className="text-sm text-gray-800 dark:text-gray-200 mr-3 truncate font-medium">
                    {formData.phone ? maskPhoneNumber(formData.phone) : 'Chưa cập nhật'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setInitialFormData(JSON.parse(JSON.stringify(formData)));
                      setIsEditingPhone(true);
                    }}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 flex-shrink-0"
                    disabled={isSubmitting}
                  >
                    {formData.phone ? 'Thay Đổi' : 'Thêm'}
                  </button>
                </div>
              )}
            </div>

      
            <div className="grid grid-cols-1 sm:grid-cols-[110px_1fr] items-center gap-2 sm:gap-4">
              <label className="text-sm text-gray-500 dark:text-gray-400 sm:text-right sm:pr-2">Giới tính</label>
              <div className="flex items-center gap-x-4 sm:gap-x-6 flex-wrap gap-y-2">
                {['male', 'female', 'other'].map((genderValue) => (
                  <label key={genderValue} className="flex items-center text-sm text-gray-700 dark:text-gray-200 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={genderValue}
                      checked={formData.gender === genderValue}
                      onChange={handleGenderChange}
                      className="form-radio-custom"
                      disabled={isSubmitting}
                    />
                    <span className="ml-2">{genderValue === 'male' ? 'Nam' : genderValue === 'female' ? 'Nữ' : 'Khác'}</span>
                  </label>
                ))}
              </div>
            </div>

           
            <div className="grid grid-cols-1 sm:grid-cols-[110px_1fr] items-start gap-2 sm:gap-4">
              <label className="text-sm text-gray-500 dark:text-gray-400 sm:text-right sm:pr-2 pt-2.5">Ngày sinh</label>
              {showBirthDateForm ? (
                <div className="w-full">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-x-3 w-full">
                    <div className="flex gap-2 sm:gap-x-3 flex-1">
  <Select
    options={dayOptions}
    placeholder="Ngày"
    value={dayOptions.find(opt => opt.value === formData.birthDate.day)}
    onChange={(selected) =>
      setFormData(prev => ({
        ...prev,
        birthDate: { ...prev.birthDate, day: selected?.value || '' },
      }))
    }
    isDisabled={isSubmitting}
    className="w-full react-select-container"
    classNamePrefix="react-select"
     menuPlacement="auto"   
  menuPosition="fixed"   
  />
  <Select
    options={monthOptions}
    placeholder="Tháng"
    value={monthOptions.find(opt => opt.value === formData.birthDate.month)}
    onChange={(selected) =>
      setFormData(prev => ({
        ...prev,
        birthDate: { ...prev.birthDate, month: selected?.value || '' },
      }))
    }
    isDisabled={isSubmitting}
    className="w-full react-select-container"
    classNamePrefix="react-select"
     menuPlacement="auto"    
  menuPosition="fixed"    
  />
  <Select
    options={yearOptions}
    placeholder="Năm"
    value={yearOptions.find(opt => opt.value === formData.birthDate.year)}
    onChange={(selected) =>
      setFormData(prev => ({
        ...prev,
        birthDate: { ...prev.birthDate, year: selected?.value || '' },
      }))
    }
    isDisabled={isSubmitting}
    className="w-full react-select-container"
    classNamePrefix="react-select"
      menuPlacement="auto"     
  menuPosition="fixed"     
  />
</div>

                    {birthDateComplete && isEditingBirthDate && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingBirthDate(false);
                          setFormErrors((prev) => ({ ...prev, dateOfBirth: undefined }));
                        }}
                        className="w-full sm:w-auto text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 whitespace-nowrap p-2.5 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex-shrink-0"
                        disabled={isSubmitting}
                      >
                        Ẩn trường nhập
                      </button>
                    )}
                  </div>
                  {formErrors.dateOfBirth && <p className="text-sm text-red-500 mt-2 w-full">{formErrors.dateOfBirth}</p>}
                </div>
              ) : (
                <div className="flex items-center pt-1.5">
                  <p className="text-sm text-gray-800 dark:text-gray-200 mr-3 font-medium">
                    {formData.birthDate.day && formData.birthDate.month && formData.birthDate.year
                      ? `${String(formData.birthDate.day).padStart(2, '0')}/${String(formData.birthDate.month).padStart(2, '0')}/${formData.birthDate.year}`
                      : 'Chưa cập nhật'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setInitialFormData(JSON.parse(JSON.stringify(formData)));
                      setIsEditingBirthDate(true);
                    }}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 flex-shrink-0"
                    disabled={isSubmitting}
                  >
                    Thay Đổi
                  </button>
                </div>
              )}
            </div>

            
            <div className="grid grid-cols-1 sm:grid-cols-[110px_1fr] items-center gap-2 sm:gap-4 pt-4">
              <div className="sm:col-start-2">
                <GradientButton type="submit" disabled={isSubmitting} size="compact">
                  {isSubmitting ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                </GradientButton>
              </div>
            </div>
            {formErrors.general && <p className="text-sm text-red-500 mt-2 sm:col-start-2">{formErrors.general}</p>}
          </form>

          <div className="hidden lg:flex flex-col items-center pt-0 lg:border-l lg:border-gray-200 dark:lg:border-gray-700 lg:pl-8">
            <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center mb-4 overflow-hidden border border-gray-300 dark:border-gray-600">
              {userAvatarPreview ? (
                <img src={userAvatarPreview} alt="User Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-5xl font-semibold">{userInitialForAvatar}</span>
              )}
            </div>
            <input
              name="avatarImage"
              type="file"
              id="avatarUploadDesktop" 
              className="hidden"
              accept=".jpg,.jpeg,.png"
              onChange={handleAvatarFileChange}
              disabled={isSubmitting}
              ref={fileInputRef} 
            />
            <label
              htmlFor="avatarUploadDesktop" 
              className={`cursor-pointer bg-white border border-gray-300/80 text-gray-700 text-sm py-2 px-5 rounded hover:bg-gray-50 transition-colors shadow-sm mb-2.5 
                dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-600
                ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}            >
              Chọn Ảnh
            </label>
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center leading-snug">
              <p>Dung lượng file tối đa 5 MB</p>
              <p>Định dạng: .JPEG, .PNG, .JPG</p>
            </div>
            {avatarError && <p className="text-xs text-red-500 mt-2 text-center">{avatarError}</p>}
          </div>
        </div>
      </div>

      <SuccessModal isOpen={showSuccessModal} message={successModalMessage} onClose={() => setShowSuccessModal(false)} />
      {isSubmitting && <Loader fullscreen />}
    </>
  );
};

export default ProfileContent;
