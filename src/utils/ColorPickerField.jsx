import React, { useState } from 'react';
import { TextField, Popover, Box, Button } from '@mui/material';
import { ChromePicker } from 'react-color';

const ColorPickerField = ({ label, value, onChange, error, helperText }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <TextField
        fullWidth
        label={label}
        value={value}
        onClick={handleOpen}
        error={error}
        helperText={helperText}
        InputProps={{
          readOnly: true,
          startAdornment: (
            <Box
              sx={{
                width: 24,
                height: 24,
                bgcolor: value,
                borderRadius: 1,
                mr: 1,
                border: '1px solid #ccc'
              }}
            />
          )
        }}
      />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 2 }}>
          <ChromePicker
            color={value}
            onChange={(color) => onChange(color.hex)}
            disableAlpha
          />
          <Button size="small" sx={{ mt: 1 }} onClick={handleClose}>
            OK
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default ColorPickerField;
