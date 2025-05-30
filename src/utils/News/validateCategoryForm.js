export const validateCategoryForm = (formData) => {
  const errors = {};

  if (!formData.name?.trim()) {
    errors.name = 'Tên danh mục không được để trống';
  } else if (formData.name.length < 2) {
    errors.name = 'Tên danh mục phải có ít nhất 2 ký tự';
  } else if (formData.name.length > 100) {
    errors.name = 'Tên danh mục không được vượt quá 100 ký tự';
  }

//   if (!formData.slug?.trim()) {
//     errors.slug = 'Slug không được để trống';
//   } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
//     errors.slug = 'Slug chỉ được chứa chữ thường, số và dấu gạch ngang';
//   }

//   if (!formData.thumbnail) {
//     errors.thumbnail = 'Phải chọn ảnh đại diện';
//   }

//   // Nếu có truyền cả file
//   if (formData.thumbnailFile && formData.thumbnailFile.size > 5 * 1024 * 1024) {
//     errors.thumbnail = 'Ảnh quá lớn. Giới hạn là 5MB';
//   }

//   if (formData.orderIndex != null && formData.orderIndex < 0) {
//     errors.orderIndex = 'Thứ tự hiển thị không được âm';
//   }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};
