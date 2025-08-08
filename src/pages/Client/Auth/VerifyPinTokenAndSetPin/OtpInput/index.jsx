import React, { useRef } from 'react';

const OtpInput = ({ value, onChange, disabled = false }) => {
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/, ''); // Chỉ cho số
    if (!val) return;

    const newValue = value.split('');
    newValue[index] = val;
    onChange(newValue.join(''));

    // Tự động chuyển focus
    if (index < 5 && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const newValue = value.split('');
      newValue[index] = '';
      onChange(newValue.join(''));

      if (index > 0 && !value[index]) {
        inputsRef.current[index - 1].focus();
      }
    }
  };

  return (
    <div className="flex justify-center gap-2 mb-4">
      {Array(6).fill(0).map((_, i) => (
        <input
          key={i}
          type="text"
          inputMode="numeric"
          maxLength={1}
          disabled={disabled}
          ref={(el) => (inputsRef.current[i] = el)}
          value={value[i] || ''}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="w-10 h-10 text-center border border-gray-300 rounded-md text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ))}
    </div>
  );
};

export default OtpInput;
