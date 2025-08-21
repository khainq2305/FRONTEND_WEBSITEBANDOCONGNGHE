import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const FilterSelect = ({ value, onChange, options = [], placeholder = 'Lọc theo...', label = 'Lọc' }) => {
const matched = options.find(opt => opt.value === value);
console.log('🧪 current value:', value, typeof value);
console.log('📦 options:', options.map(opt => [opt.value, typeof opt.value]));
console.log('🎯 matched option:', matched);





  return (
    <FormControl fullWidth size="small" variant="outlined">
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label={label}
      >
        <MenuItem value="">{placeholder}</MenuItem>
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
