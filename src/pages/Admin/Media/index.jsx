import {
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Button, Typography, Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const mockMedias = [
  {
    id: 1,
    name: 'Banner Mùa hè',
    type: 'Banner',
    image: 'https://via.placeholder.com/100x60'
  },
  {
    id: 2,
    name: 'Popup Giảm giá',
    type: 'Popup',
    image: 'https://via.placeholder.com/100x60'
  },
  {
    id: 3,
    name: 'Slider Trang chủ',
    type: 'Slider',
    image: 'https://via.placeholder.com/100x60'
  }
];

const MediaList = () => {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState([]);

  const handleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    setSelectedIds(
      selectedIds.length === mockMedias.length ? [] : mockMedias.map((m) => m.id)
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Danh sách Media
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <input
                  type="checkbox"
                  checked={selectedIds.length === mockMedias.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>STT</TableCell>
              <TableCell>Tên Media</TableCell>
              <TableCell>Loại</TableCell>
              <TableCell>Xem chi tiết</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockMedias.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Không có media nào.
                </TableCell>
              </TableRow>
            ) : (
              mockMedias.map((media) => (
                <TableRow
                  key={media.id}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell padding="checkbox">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(media.id)}
                      onChange={() => handleSelect(media.id)}
                    />
                  </TableCell>
                  <TableCell>{media.id}</TableCell>
                 
                  <TableCell>{media.name}</TableCell>
                  <TableCell>{media.type}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/admin/medias/type/${media.type.toLowerCase()}`)}
                    >
                      Xem
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MediaList;
