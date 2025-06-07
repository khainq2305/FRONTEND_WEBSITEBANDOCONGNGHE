import { Box, Select, MenuItem, Button } from '@mui/material';
import { useState, useEffect } from 'react';

/**
 * BulkActions – chọn & thực thi thao tác hàng loạt
 * @param {{ onSubmit: (opt:{value:string,label:string})=>void, status:string }} props
 */
const BulkActions = ({ onSubmit, status }) => {
  const [action, setAction] = useState('');

  useEffect(() => {
    setAction(status === 'trashed' ? 'restore' : 'trash');
  }, [status]);


  const getOptions = () => {
    if (status === 'trashed')
      return [
        { value: 'restore',    label: 'Khôi phục' },
        { value: 'forceDelete', label: 'Xoá vĩnh viễn' },
      ];
    return [{ value: 'trash', label: 'Chuyển vào thùng rác' }];
  };


  const options = getOptions();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Select
        size="small"
        value={action}
        onChange={(e) => setAction(e.target.value)}
        sx={{ minWidth: 180 }}
      >
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>

      <Button
        variant="contained"
        sx={{ height: 35 }}
        disabled={!action}
        onClick={() => {
          const opt = options.find((o) => o.value === action);
          if (opt) onSubmit(opt);          
        }}
      >
        Thực hiện
      </Button>
    </Box>
  );
};

export default BulkActions;
