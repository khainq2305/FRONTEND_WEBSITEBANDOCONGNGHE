import { TableRow, TableCell, IconButton, Avatar, Chip, Menu, MenuItem, Typography, Box, Checkbox } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import dayjs from 'dayjs';
import { API_BASE_URL } from '../../../constants/environment';
import HighlightText from '../../../components/Admin/HighlightText';
import { formatCurrencyVND } from '../../../utils/formatCurrency';

export default function ComboRowItem({
  combo,
  index,
  selected,
  onSelect,
  onEdit,
  onDelete,
  onRestore,
  onForceDelete,
  filter,
  onViewDetail
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  return (
    <>
      <TableRow hover>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onChange={() => onSelect(combo.id)} />
        </TableCell>
        <TableCell>
          <Avatar
            variant="rounded"
            src={combo.thumbnail?.startsWith('http') ? combo.thumbnail : `${API_BASE_URL}${combo.thumbnail}`}
            alt={combo.name}
            sx={{ width: 90, height: 100, borderRadius: 2 }}
          />
        </TableCell>
        <TableCell>
          <HighlightText text={combo.name} highlight={combo.searchText || ''} />
        </TableCell>
        <TableCell>{formatCurrencyVND(combo.price)}</TableCell>
        <TableCell>
          <Chip
  label={
    combo.deletedAt
      ? 'Đã xoá'
      : combo.isExpired
      ? 'Hết hạn'
      : combo.isActive
      ? 'Hoạt động'
      : 'Tạm tắt'
  }
  color={
    combo.deletedAt
      ? 'error'
      : combo.isExpired
      ? 'default'
      : combo.isActive
      ? 'success'
      : 'warning'
  }
  size="small"
/>

        </TableCell>
        <TableCell>{combo.slug}</TableCell>
        <TableCell>
          <Typography variant="body2">
            {combo.startAt ? dayjs(combo.startAt).format('DD/MM/YYYY') : '...'} →{' '}
            {combo.expiredAt ? dayjs(combo.expiredAt).format('DD/MM/YYYY') : '...'}
          </Typography>
        </TableCell>
        <TableCell>
          <Box>
            <Typography variant="body2">
              {combo.sold}/{combo.quantity} ({combo.quantity > 0 ? Math.round((combo.sold / combo.quantity) * 100) : 0}%)
            </Typography>
            <Box sx={{ width: '100%', backgroundColor: '#eee', borderRadius: 1, height: 6, mt: 0.5 }}>
              <Box
                sx={{
                  width: `${combo.quantity > 0 ? (combo.sold / combo.quantity) * 100 : 0}%`,
                  backgroundColor: '#4caf50',
                  height: '100%',
                  borderRadius: 1
                }}
              ></Box>
            </Box>
          </Box>
        </TableCell>
        <TableCell align="right">
          <IconButton onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose} keepMounted>
            {filter === 'deleted' ? (
              <>
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    onRestore(combo.id);
                  }}
                >
                  Khôi phục
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    onForceDelete(combo.id);
                  }}
                  sx={{ color: 'error.main' }}
                >
                  Xoá vĩnh viễn
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem
                  onClick={() => {
                    onViewDetail(combo); // ✅ Gọi đúng hàm truyền từ cha
                    setMenuState({ anchorEl: null, comboId: null });
                  }}
                >
                  Xem chi tiết
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    onEdit(combo);
                  }}
                >
                  Sửa
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    onDelete(combo.id, combo.name);
                  }}
                  sx={{ color: 'error.main' }}
                >
                  Xoá
                </MenuItem>
              </>
            )}
          </Menu>
        </TableCell>
      </TableRow>
    </>
  );
}
