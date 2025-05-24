import {
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Button
} from '@mui/material';
import MoreActionsMenu from '../MoreActionsMenu/MoreActionsMenu';
import { useArticle } from '../Context/ArticleContext';

import { useNavigate } from 'react-router-dom';

const ArticleTable = () => {
  const navigate = useNavigate();

  const {
    articles,
    selectedRows,
    handleSelectRow,
    handleSelectAll,
    setModalItem,
    handleSoftDelete,
    filters, handleRestore,
    handleForceDelete

  } = useArticle();

  const rows = articles.filter((a) => {
    if (filters.status === 'trash') return a.deletedAt; // bài đã xóa
    if (filters.status === '0') return a.status === 0 && !a.deletedAt;
    if (filters.status === '1') return a.status === 1 && !a.deletedAt;
    return !a.deletedAt; // mặc định là "Tất cả"
  });

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <input
                type="checkbox"
                checked={(selectedRows?.length || 0) === rows.length && rows.length > 0}
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
                  checked={selectedRows.includes(row.slug)}
                  onChange={() => handleSelectRow(row.slug)}
                />
              </TableCell>
              <TableCell>{row.title}</TableCell>
              <TableCell>
                {!row.User ? 'không có' : row.User.fullName ? row.User.fullName : 'Lỗi r'}
              </TableCell>


              <TableCell>{!row.Category ? 'không có' : row.Category.name ? row.Category.name : 'Lỗi rồi'}</TableCell>
              <TableCell>

                <Button variant="contained" size="extraSmall" color={
                  row.status === 1
                    ? 'success'
                    : row.status === 2
                      ? 'info'
                      : 'warning'
                }
                >
                  {row.status === 1
                      ? 'Đã xuất bản'
                      : row.status === 2
                        ? 'Hẹn giờ đăng'
                        : 'Bản nháp'}

                </Button>

              </TableCell>
              <TableCell align="right">
                <MoreActionsMenu
  tabStatus={filters.status}
  onDelete={() => handleSoftDelete(row)}
  onEdit={() => navigate(`/admin/quan-ly-bai-viet/chinh-sua-bai-viet/${row.slug}`)}
  onView={() => setModalItem({
    ...row,
    name: row.title,
    author: `${row.authorId}`,
    category: row.Category?.name || `#${row.categoryId}`,
    date: new Date(row.createdAt).toLocaleDateString('vi-VN'),
    tag: row.status,
    comment: 0,
    status: row.status,
    publishAt: row.publishAt
  })}
  onRestore={() => handleRestore(row.slug)}
  onForceDelete={() => handleForceDelete(row.slug)}
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
