export const validatePostForm = (formData) => {
  const errors = {};

  if (!formData.title?.trim()) {
    errors.title = 'Tiêu đề không được để trống';
  } else if (formData.title.length < 10) {
  errors.title = 'Tiêu đề phải có ít nhất 10 ký tự';
} else if (formData.title.length > 120) {
     errors.title = 'Tiêu đề không được vượt quá 120 ký tự';
}

  if (!formData.content?.trim()) {
    errors.content = 'Nội dung không được để trống';
  }

  if (!formData.category) {
    errors.category = 'Phải chọn danh mục';
  }
  if (!formData.avatar) {
  errors.avatar = 'Phải chọn ảnh đại diện';
}

// Nếu bạn truyền cả file:
if (formData.avatarFile && formData.avatarFile.size > 5 * 1024 * 1024) {
  errors.avatar = 'Ảnh quá lớn. Giới hạn là 5MB';
}

  if (formData.isScheduled && formData.publishAt) {
    const now = new Date();
    const target = new Date(formData.publishAt);
    const diff = target - now;

    const MIN = 30 * 60 * 1000;
    const MAX = 30 * 24 * 60 * 60 * 1000;

    if (diff < MIN) errors.publishAt = 'Thời gian phải cách hiện tại ít nhất 30 phút';
    if (diff > MAX) errors.publishAt = 'Không được đặt lịch đăng quá 30 ngày';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};
