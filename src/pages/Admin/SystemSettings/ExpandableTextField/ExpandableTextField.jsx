import { TextField, IconButton, Collapse, Box, Typography } from '@mui/material';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function ExpandableTextField({ label, value, onChange, name, error, helperText, type = 'text' }) {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ mb: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" onClick={() => setOpen(!open)} sx={{ cursor: 'pointer', mb: 1 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          {label}
        </Typography>
        <IconButton size="small">
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </IconButton>
      </Box>
      <Collapse in={open}>
        <TextField
          fullWidth
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          error={error}
          helperText={helperText}
        />
      </Collapse>
    </Box>
  );
}
