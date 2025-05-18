import {
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Button
} from '@mui/material';
import MoreActionsMenu from 'components/common/MoreActionsMenu';

const ArticleTable = ({
  rows,
  selectedRows,
  onSelectRow,
  onSelectAll,
  onView,
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
                checked={selectedRows.length === rows.length && rows.length > 0}
                onChange={onSelectAll}
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
                  onChange={() => onSelectRow(row.id)}
                />
              </TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.author}</TableCell>
              <TableCell>{row.category}</TableCell>
              <TableCell>
                <Button variant="contained" size="small" onClick={() => onView(row)}>
                  Xem
                </Button>
              </TableCell>
              <TableCell>
                {row.status === 'active' ? 'Đang hoạt động' : 'Ngưng'}
              </TableCell>
              <TableCell align="right">
                <MoreActionsMenu onDelete={() => onDelete(row)} />
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
