import React, { useState, useEffect, useRef } from 'react';
import { reviewService } from '../../../../services/client/reviewService';
import { toast } from 'react-toastify';

const StarIcon = ({ filled, onClick, onMouseEnter, onMouseLeave }) => (
  <svg
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    className={`w-8 h-8 cursor-pointer transition-all duration-150 transform hover:scale-110 ${
      filled ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
    }`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.293c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const CameraIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 16.5V9.75m0 0l-3 3m3-3l3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
    />
  </svg>
);

const TrashIcon = ({ className, onClick }) => (
  <svg
    onClick={onClick}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
    />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const MAX_FILES = 5;
const MAX_FILE_SIZE_MB = 10;

export default function ReviewFormModal({ productName, skuId, show, onClose, onSuccess, editingReview }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const starLabels = ['Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Tuyệt vời'];

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';

      if (editingReview) {
        setRating(editingReview.rating);
        setComment(editingReview.content);
        setMediaFiles(editingReview.media || []);
      }
    } else {
      document.body.style.overflow = 'unset';
      setRating(5);
      setHoverRating(0);
      setComment('');
      setMediaFiles([]);
      setSubmitting(false);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show, editingReview]);

  if (!show) return null;

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);

    if (newFiles.length === 0) return;

    if (mediaFiles.length + newFiles.length > MAX_FILES) {
      toast.warn(`Bạn chỉ có thể tải lên tối đa ${MAX_FILES} file.`);
      return;
    }

    const validFiles = newFiles.filter((file) => {
      if (!file.type.startsWith('image/')) {
        toast.warn(`"${file.name}" không phải là hình ảnh hợp lệ.`);
        return false;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.warn(`"${file.name}" quá lớn (tối đa ${MAX_FILE_SIZE_MB}MB).`);
        return false;
      }
      return true;
    });

    setMediaFiles((prevFiles) => [...prevFiles, ...validFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveMedia = (indexToRemove) => {
    setMediaFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async () => {
    if (rating === 0) return toast.warn('Vui lòng chọn số sao đánh giá.');
    if (comment.trim().length < 15) return toast.warn('Nhận xét phải có ít nhất 15 ký tự.');

    setSubmitting(true);
    const formData = new FormData();
    formData.append('skuId', skuId);
    formData.append('rating', rating);
    formData.append('content', comment.trim());
    mediaFiles.forEach((file) => {
      formData.append('media', file);
    });

    try {
      if (editingReview) {
        await reviewService.update(editingReview.id, formData);
        toast.success('Cập nhật đánh giá thành công!');
      } else {
        await reviewService.create(formData);
        toast.success('Đánh giá thành công!');
      }

      onSuccess();
      onClose();
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;
      if (status === 403) {
        toast.error(data?.message || 'Bạn chưa mua sản phẩm này!');
      } else {
        toast.error('Có lỗi xảy ra khi gửi đánh giá.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const currentLabel = starLabels[hoverRating - 1] || starLabels[rating - 1] || 'Chọn để đánh giá';
  const labelColorClass = rating > 0 && !hoverRating ? 'text-yellow-500 font-semibold' : 'text-gray-500';

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[95vh] flex flex-col transform animate-scale-in"
        onClick={(e) => e.stopPropagation()} // Chặn event click lan ra ngoài
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-bold text-gray-800">Bạn nghĩ sao về sản phẩm này?</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800 transition-colors p-1 rounded-full">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 md:p-6 overflow-y-auto space-y-6">
          <div className="text-center">
            <p className="font-semibold text-gray-800 mb-3">{productName}</p>
            <div className="flex justify-center items-center space-x-2">
              {[1, 2, 3, 4, 5].map((starValue) => (
                <StarIcon
                  key={starValue}
                  filled={starValue <= (hoverRating || rating)}
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHoverRating(starValue)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
            </div>
            <p className={`text-sm h-6 mt-2 transition-colors duration-150 ${labelColorClass}`}>{currentLabel}</p>
          </div>

          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm transition-colors"
            rows="4"
            placeholder="Sản phẩm dùng tốt không, có điểm gì bạn thích và không thích? (ít nhất 15 ký tự)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {mediaFiles.map((file, index) => {
                const url = file instanceof File ? URL.createObjectURL(file) : file.url; // fallback nếu có url

                return (
                  <div key={index} className="relative aspect-square group">
                    <img src={url} alt={`preview ${index}`} className="w-full h-full rounded-lg object-cover border-2 border-gray-200" />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <TrashIcon
                        onClick={() => handleRemoveMedia(index)}
                        className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 cursor-pointer transform hover:scale-110 transition-all duration-200"
                      />
                    </div>
                  </div>
                );
              })}

              {mediaFiles.length < MAX_FILES && (
                <label className="relative aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors">
                  <CameraIcon className="w-8 h-8 text-gray-400" />
                  <span className="text-xs text-center text-gray-500 mt-1">Thêm ảnh</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/png, image/jpeg, image/gif"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Đã thêm {mediaFiles.length}/{MAX_FILES} file. Tối đa {MAX_FILE_SIZE_MB}MB/file.
            </p>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t rounded-b-xl">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-150 text-base flex items-center justify-center disabled:bg-opacity-60 disabled:cursor-not-allowed"
          >
            {submitting && <SpinnerIcon />}
            {submitting ? 'Đang gửi đánh giá...' : 'Gửi đánh giá'}
          </button>
        </div>
      </div>
    </div>
  );
}
