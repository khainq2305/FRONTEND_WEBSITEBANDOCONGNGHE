import {
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Button
} from '@mui/material';
import MoreActionsMenu from 'components/common/MoreActionsMenu';
import { useArticle } from '../News';
import { useNavigate } from 'react-router-dom';

const ArticleTable = () => {
  const navigate = useNavigate();

  const {
    filteredArticles,
    selectedRows,
    handleSelectRow,
    handleSelectAll,
    setModalItem,
    handleDelete
  } = useArticle();

  const rows = filteredArticles;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <input
                type="checkbox"
                checked={selectedRows.length === rows.length && rows.length > 0}
                onChange={handleSelectAll}
              />
            </TableCell>
            <TableCell>Tiêu đề</TableCell>
            <TableCell>Tác giả</TableCell>
            <TableCell>Danh mục</TableCell>
            <TableCell>Xem chi tiết</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell align="right">Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell padding="checkbox">
                <input
                  type="checkbox"
                  checked={selectedRows.includes(row.id)}
                  onChange={() => handleSelectRow(row.id)}
                />
              </TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.author}</TableCell>
              <TableCell>{row.category}</TableCell>
              <TableCell>
                <Button variant="contained" size="small" onClick={() => setModalItem(row)}>
                  Xem
                </Button>
              </TableCell>
              <TableCell>

                <Button variant="contained" size="extraSmall" color={row.status === 'active' ? 'success' : 'error'}>{row.status === 'active' ? 'Đang hoạt động' : 'Ngưng'}</Button>

              </TableCell>
              <TableCell align="right">
                <MoreActionsMenu
                  onDelete={() => handleDelete(row)}
                  onEdit={() => navigate(`/admin/bai-viet/chinh-sua/${row.id}`)}
                />


              </TableCell>
            </TableRow>
          ))}
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} align="center">
                Không có kết quả
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ArticleTable;
