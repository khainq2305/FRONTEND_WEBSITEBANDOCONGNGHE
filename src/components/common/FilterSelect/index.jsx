import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const FilterSelect = ({ value, onChange, options = [], placeholder = 'Tất cả', label = 'Lọc' }) => {
  return (
    <FormControl fullWidth size="small" variant="outlined">
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label={label}
      >
        <MenuItem value="">{placeholder || 'Tất cả'}</MenuItem>
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FilterSelect;
