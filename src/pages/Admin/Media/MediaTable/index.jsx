// src/components/admin/MediaTable.jsx
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Paper, Checkbox, Box, Chip
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MoreActionsMenu from '../MoreActionsMenu';
import DeleteMediaDialog from '../DeleteMedia'; // import đúng dialog xoá

const getStatusChip = (status) => {
  const map = {
    active: ['Hiển thị', 'success'],
    hidden: ['Ẩn', 'default'],
    trash: ['Đã xoá', 'error']
  };
  const [label, color] = map[status] || [status, 'default'];
  return <Chip label={label} color={color} size="small" />;
};

const MediaTable = ({ data, selectedIds, handleSelect, handleSelectAll, page, itemsPerPage }) => {
  const navigate = useNavigate();

  // ✅ Sửa đúng chỗ khai báo state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                checked={selectedIds.length === data.length}
                onChange={handleSelectAll}
              />
            </TableCell>
            <TableCell>STT</TableCell>
            <TableCell>Tiêu đề</TableCell>
            <TableCell>Hình ảnh</TableCell>
            <TableCell>Loại</TableCell>
            <TableCell>Vị trí</TableCell>
            <TableCell align="center">Trạng thái</TableCell>
            <TableCell align="center">Hành động</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center">
                Không có dữ liệu.
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow key={`${item.id}-${index}`} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds.includes(item.id)}
                    onChange={() => handleSelect(item.id)}
                  />
                </TableCell>
                <TableCell>{(page - 1) * itemsPerPage + index + 1}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>
                  {item.type === 'slider' ? (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {item.images?.slice(0, 3).map((img, i) => (
                        <Box
                          key={i}
                          sx={{
                            width: 150,
                            height: 80,
                            borderRadius: 1,
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f3f3f3'
                          }}
                        >
                          <img
                            src={img}
                            alt={`slider-${i}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        width: 150,
                        height: 80,
                        borderRadius: 1,
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f3f3f3'
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Box>
                  )}
                </TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.position || 'Không có'}</TableCell>
                <TableCell align="center">{getStatusChip(item.status)}</TableCell>
                <TableCell align="center">
                  <MoreActionsMenu
                    actions={[
                      {
                        label: 'Xem chi tiết',
                        onClick: () => navigate(`/admin/medias/${item.id}`)
                      },
                      {
                        label: 'Sửa',
                        onClick: () => navigate(`/admin/medias/edit/${item.id}`)
                      },
                      {
                        label: 'Xoá',
                        onClick: () => {
                          setDeleteTarget(item);
                          setOpenDelete(true);
                        },
                        color: 'error'
                      }
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* ✅ Đặt dialog xoá tại cuối bảng */}
      <DeleteMediaDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={() => {
          console.log('🗑 Xoá media:', deleteTarget);
          // TODO: gọi API xoá thật
          setOpenDelete(false);
        }}
        mediaTitle={deleteTarget?.title}
      />
    </TableContainer>
  );
};

export default MediaTable;
