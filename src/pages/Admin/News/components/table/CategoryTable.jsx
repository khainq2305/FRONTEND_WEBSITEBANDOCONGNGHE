import React from 'react'
import { useCategory } from './CategoryPage'
import {Button} from '@mui/material';
import { TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  


 } from '@mui/material';
 import { useNavigate } from 'react-router-dom';

import MoreActionsMenu from '@/components/common/MoreActionsMenu'
const CategoryTable = () => {
  const {
    filteredArticles,
    selectedRows,
    handleSelectRow,
    handleSelectAll,
    setModalItem,
    handleDelete,
    categories, postCounts
  } = useCategory()
  const rows = filteredArticles;
  console.log('✅ row data:', rows);
const navigate = useNavigate();
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <input
                type="checkbox"
                // checked={selectedRows.length === rows.length && rows.length > 0}
                onChange={handleSelectAll}
              />
            </TableCell>
            <TableCell>Tên danh mục</TableCell>
            <TableCell>Bài viết</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell align="right">Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.slug}>
              <TableCell padding="checkbox">
                <input
                  type="checkbox"
                  checked={selectedRows.includes(row.slug)}
                  onChange={() => handleSelectRow(row.slug)}
                />
              </TableCell>
              <TableCell>{'— '.repeat(row.level) + row.name}</TableCell>
              <TableCell>{row.postCount}</TableCell>
              <TableCell>

                <Button variant="contained" size="extraSmall" color={row.status === 'active' ? 'success' : 'error'}>{row.status === 'active' ? 'Đang hoạt động' : 'Ngưng'}</Button>

              </TableCell>
              <TableCell align="right">
                <MoreActionsMenu
                  onDelete={() => handleDelete(row)}
                  onEdit={() => navigate(`/admin/danh-muc-bai-viet/chinh-sua-danh-muc/${row.slug}`)}
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
}

export default CategoryTable