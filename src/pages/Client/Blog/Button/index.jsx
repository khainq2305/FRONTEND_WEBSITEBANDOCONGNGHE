import React from 'react';

const Button = ({
  label = '',
  icon = '',
  w = 'auto',
  h = 'auto',
  className = '',
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-1 px-3 py-2 border border-gray-300 text-sm rounded ${className}`}
      style={{ width: w, height: h }}
    >
      {icon && <span>{icon}</span>}
      {label && <span>{label}</span>}
    </button>
  );
};

export default Button;
