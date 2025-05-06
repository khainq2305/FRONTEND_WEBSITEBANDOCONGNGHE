import React from 'react';
import TextField from '@mui/material/TextField';

const SearchInput = ({ value, onChange, placeholder = 'Tìm kiếm...' }) => {
  return (
    <TextField
      fullWidth
      variant="outlined"
      size="small"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
};

export default SearchInput;
