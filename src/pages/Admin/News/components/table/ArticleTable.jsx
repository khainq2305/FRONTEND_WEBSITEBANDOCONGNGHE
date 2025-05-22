import {
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Button
} from '@mui/material';
import MoreActionsMenu from 'components/common/MoreActionsMenu';
import { useArticle } from '../../News';
import { useNavigate } from 'react-router-dom';

const ArticleTable = () => {
  const navigate = useNavigate();

  const {
    filteredArticles,
    selectedRows,
    handleSelectRow,
    handleSelectAll,
    setModalItem,
    handleSoftDelete,

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
              <TableCell>{row.title}</TableCell>
              <TableCell>{row.User.fullName}</TableCell>
              <TableCell>{row.Category.name}</TableCell>
              <TableCell>

                <Button variant="contained" size="extraSmall" color={
    row.status === 'published'
      ? 'success'
      : row.status === 'scheduled'
        ? 'info'
        : 'warning'
  }
>
  {row.status === 'published'
    ? 'Đã xuất bản'
    : row.status === 'scheduled'
      ? 'Hẹn giờ đăng'
      : 'Bản nháp'}
</Button>

              </TableCell>
              <TableCell align="right">
                <MoreActionsMenu
                  onDelete={() => handleSoftDelete(row)}
                  onEdit={() => navigate(`/admin/chinh-sua-bai-viet/${row.id}`)}
                  onView={() => setModalItem({
                    ...row,
                    name: row.title,
                    author: `Tác giả #${row.authorId}`,
                    category: row.Category?.name || `#${row.categoryId}`,
                    date: new Date(row.createdAt).toLocaleDateString('vi-VN'),
                    tag: row.status,
                    comment: 0,
                    status: row.status,
                    publishAt: row.publishAt
                  })}
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
