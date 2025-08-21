import { useState, useEffect } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';

const SearchInput = ({ initialValue = '', onSearch, loading = false, placeholder = 'Tìm kiếm...' }) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  return (
    <TextField
      size="small"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      disabled={loading}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
      }}
      sx={{ width: { xs: '100%', sm: 300 } }}
    />
  );
};

export default SearchInput;
