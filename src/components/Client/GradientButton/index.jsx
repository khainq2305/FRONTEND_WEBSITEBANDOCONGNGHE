import React from 'react';
import styles from './GradientButton.module.css'; // Import CSS Module

const GradientButton = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  size = 'default', // ✅ Thêm prop 'size' với giá trị mặc định là 'default'
  ...props
}) => {
  // Xác định class cho kích thước dựa trên prop 'size'
  let sizeClass = '';
  if (size === 'compact') {
    sizeClass = styles.compactSize;
  } else if (size === 'large') {
    sizeClass = styles.largeSize;
  }
  // Nếu size là 'default', không cần thêm class đặc biệt vì style mặc định đã có trong .gradientButton

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${styles.gradientButton} ${sizeClass} ${className}`} // ✅ Thêm sizeClass vào đây
      {...props}
    >
      {children}
    </button>
  );
};

export default GradientButton;