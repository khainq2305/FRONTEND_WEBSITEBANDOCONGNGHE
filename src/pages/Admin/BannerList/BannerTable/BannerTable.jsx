import {
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Chip
} from '@mui/material';
import MoreActionsMenu from '../MoreActionsMenu/MoreActionsMenu';

const getStatusChip = (status) => {
  const map = {
    active: ['Hiển thị', 'success'],
    hidden: ['Ẩn', 'default'],
    trash: ['Đã xoá', 'error']
  };
  const [label, color] = map[status] || [status, 'default'];
  return <Chip label={label} color={color} size="small" />;
};

const BannerTable = ({
  banners,
  selectedIds,
  onSelect,
  onSelectAll,
  navigate,
  onEdit,
  onDelete
}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <input
                type="checkbox"
                checked={banners.length > 0 && selectedIds.length === banners.length}
                onChange={onSelectAll}
              />
            </TableCell>
            <TableCell>STT</TableCell>
            <TableCell>Tên banner</TableCell>
            <TableCell>Ảnh</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell>Ngày tạo</TableCell>
            <TableCell align="right">Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {banners.map((banner, index) => {
            const actions = [
              {
                label: 'Xem chi tiết',
                onClick: () => navigate(`/admin/banners/${banner.id}`)
              },
              {
                label: 'Sửa',
                onClick: () => navigate(`/admin/banners/edit/${banner.id}`)
              },
              {
                label: 'Xoá',
                onClick: () => onDelete(banner),
                color: 'error'
              }
            ];

            return (
              <TableRow key={banner.id}>
                <TableCell padding="checkbox">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(banner.id)}
                    onChange={() => onSelect(banner.id)}
                  />
                </TableCell>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{banner.name}</TableCell>
                <TableCell>
                  <img src={banner.image} alt={banner.name} width={120} />
                </TableCell>
                <TableCell>{getStatusChip(banner.status)}</TableCell>
                <TableCell>{banner.createdAt}</TableCell>
                <TableCell align="right">
                  <MoreActionsMenu actions={actions} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BannerTable;
