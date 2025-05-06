import { useState } from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper
} from '@mui/material';
import SearchInput from 'components/common/SearchInput';
import FilterSelect from 'components/common/FilterSelect';
import Pagination from 'components/common/Pagination';
import Toastify from 'components/common/Toastify';
import { confirmDelete } from 'components/common/ConfirmDeleteDialog';
import MoreActionsMenu from 'components/common/MoreActionsMenu';

const BasicTableDemo = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const mockData = [
    { id: 1, name: 'Nguyễn Văn A', email: 'a@gmail.com', status: 'active' },
    { id: 2, name: 'Trần Thị B', email: 'b@gmail.com', status: 'inactive' },
    { id: 3, name: 'Lê Văn C', email: 'c@gmail.com', status: 'active' },
    { id: 4, name: 'Phạm Thị D', email: 'd@gmail.com', status: 'inactive' },
  ];

  const filtered = mockData.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      (status === '' || item.status === status)
  );

  const handleDelete = async (row) => {
    const confirmed = await confirmDelete(row.name);
    if (confirmed) {
      Toastify.success(`Đã xoá ${row.name}`);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Bảng mẫu sử dụng tất cả component</h2>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <SearchInput value={search} onChange={setSearch} />
        <FilterSelect
          value={status}
          onChange={setStatus}
          options={[
            { value: 'active', label: 'Đang hoạt động' },
            { value: 'inactive', label: 'Ngưng hoạt động' }
          ]}
        />
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Họ tên</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>
                  {row.status === 'active' ? 'Đang hoạt động' : 'Ngưng'}
                </TableCell>
                <TableCell align="right">
                  <MoreActionsMenu onDelete={() => handleDelete(row)} />
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Không có kết quả
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        currentPage={page}
        totalItems={filtered.length}
        itemsPerPage={5}
        onPageChange={(p) => setPage(p)}
      />

      <Toastify />
    </div>
  );
};

export default BasicTableDemo;
