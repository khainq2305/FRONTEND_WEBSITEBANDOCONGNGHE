import { Box, Select, MenuItem, Button } from '@mui/material';
import { useState, useEffect } from 'react';

const BulkActions = ({ onSubmit, status }) => {
  const [action, setAction] = useState('');

  useEffect(() => {
    // Reset action khi tab thay đổi
    if (status === 'trashed') {
      setAction('restore');
    } else {
      setAction('trash');
    }
  }, [status]);

  const getOptions = () => {
    if (status === 'trashed') {
      return [
        { value: 'restore', label: 'Khôi phục' },
        { value: 'forceDelete', label: 'Xoá vĩnh viễn' }
      ];
    }
    return [
      { value: 'trash', label: 'Chuyển vào thùng rác' }
    ];
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Select
        size="small"
        value={action}
        onChange={(e) => setAction(e.target.value)}
        sx={{ minWidth: 180 }}
      >
        {getOptions().map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>

      <Button
        variant="contained"
        onClick={() => onSubmit(action)}
        sx={{ height: 40 }}
        disabled={!action}
      >
        Thực Hiện
      </Button>
    </Box>
  );
};

export default BulkActions;
