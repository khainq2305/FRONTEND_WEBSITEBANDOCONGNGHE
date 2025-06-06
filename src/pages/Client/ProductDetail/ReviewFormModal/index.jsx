import React, { useState, useEffect } from 'react';
import { reviewService } from '../../../../services/client/reviewService';
import { toast } from 'react-toastify';

// Icons
const StarIcon = ({ filled, onClick, onMouseEnter, onMouseLeave, isHovered }) => (
  <svg
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    className={`w-7 h-7 cursor-pointer transition-colors duration-150 
                ${filled ? 'text-yellow-400' : 'text-gray-300'} 
                ${isHovered && !filled ? 'text-yellow-300' : ''}`}
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
      d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
  </svg>
);

const CloseIcon = ({ className, onClick }) => (
  <svg
    className={className}
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function ReviewFormModal({ productName, skuId, show, onClose, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);

  const starLabels = ['Rất Tệ', 'Tệ', 'Bình thường', 'Tốt', 'Tuyệt vời'];

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      // reset form
      setRating(0);
      setHoverRating(0);
      setComment('');
      setMediaFiles([]);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  if (!show) return null;

  const handleFileChange = (e) => {
    setMediaFiles(Array.from(e.target.files));
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.warn('Vui lòng chọn số sao đánh giá.');
      return;
    }
    if (comment.trim().length === 0) {
      toast.warn('Vui lòng nhập nhận xét của bạn.');
      return;
    }
    if (comment.trim().length < 15) {
      toast.warn('Nhận xét phải có ít nhất 15 kí tự.');
      return;
    }

    const formData = new FormData();
    formData.append('skuId', skuId);
    formData.append('rating', rating);
    formData.append('content', comment.trim());
    mediaFiles.forEach((file) => {
      formData.append('media', file);
    });

    try {
      await reviewService.create(formData);
      onSuccess();
      onClose();
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;

      if (status === 400) {
        if (Array.isArray(data?.errors)) {
          data.errors.forEach((e) => toast.error(e.message));
        } else if (typeof data?.message === 'string') {
          toast.error(data.message);
        } else {
          toast.error('Yêu cầu không hợp lệ!');
        }
      } else if (status === 403) {
        toast.error(data?.message || 'Bạn chưa mua sản phẩm này!');
      } else {
        toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
      }
    }
  };

  let currentLabel = '';
  let labelColorClass = 'text-gray-400';

  if (hoverRating > 0) {
    currentLabel = starLabels[hoverRating - 1];
    labelColorClass = 'text-gray-600';
  } else if (rating > 0) {
    currentLabel = starLabels[rating - 1];
    labelColorClass = 'text-yellow-500';
  } else {
    currentLabel = starLabels[2];
  }

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h3 className="text-lg font-semibold text-gray-800">Đánh giá & nhận xét</h3>
          <CloseIcon className="w-6 h-6 text-gray-500 hover:text-gray-700 cursor-pointer" onClick={onClose} />
        </div>

        <div className="p-4 overflow-y-auto">
          <div className="flex items-center mb-4">
            <p className="text-md font-semibold text-gray-700">{productName}</p>
          </div>

          <p className="text-sm font-medium text-gray-700 mb-2 text-center">Đánh giá chung</p>
          <div className="flex justify-center items-center space-x-1 mb-1">
            {[1, 2, 3, 4, 5].map((starValue) => (
              <StarIcon
                key={starValue}
                filled={starValue <= (hoverRating || rating)}
                isHovered={starValue <= hoverRating}
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(0)}
              />
            ))}
          </div>

          <div className="text-xs text-center h-6 mt-1 mb-3 flex items-center justify-center">
            <span className={`truncate transition-colors duration-150 ${labelColorClass}`}>{currentLabel}</span>
          </div>

          <textarea
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm resize-none"
            rows="4"
            placeholder="Xin mời chia sẻ một số cảm nhận về sản phẩm (ít nhất 15 ký tự)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <label className="mt-4 flex items-center gap-2 text-sm text-primary hover:text-blue-700 border border-gray-300 px-3 py-2 rounded-md hover:bg-blue-50 transition-colors cursor-pointer">
            <CameraIcon className="w-5 h-5" />
            <span>Thêm hình ảnh hoặc video</span>
            <input
              type="file"
              multiple
              accept="image/png, image/jpeg, video/mp4, video/webm"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {mediaFiles.length > 0 && (
            <div className="mt-3">
              <div className="text-xs text-gray-600 mb-2">Đã chọn {mediaFiles.length} file</div>
              <div className="flex gap-2 flex-wrap">
                {mediaFiles.map((file, index) => {
                  const url = URL.createObjectURL(file);
                  const isVideo = file.type.startsWith('video');
                  return isVideo ? (
                    <video key={index} src={url} controls className="w-24 h-24 rounded object-cover border" />
                  ) : (
                    <img key={index} src={url} alt="media" className="w-24 h-24 rounded object-cover border" />
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 sticky bottom-0 bg-white z-10">
          <button
            onClick={handleSubmit}
            className="w-full bg-primary text-white py-2.5 rounded-md font-semibold hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-all duration-150 text-sm"
          >
            GỬI ĐÁNH GIÁ
          </button>
        </div>
      </div>
    </div>
  );
}
