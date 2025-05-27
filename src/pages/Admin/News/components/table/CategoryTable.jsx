import React from 'react';
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MoreActionsMenu from '@/pages/Admin/News/components/MoreActionsMenu/MoreActionsMenu';
import { useCategory } from '../Context/CategoryContext';

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const CategoryTable = () => {
  const {
    filters,
    selectedRows,
    handleSelectRow,
    handleSelectAll,
    setModalItem,
    handleDelete,
    categories,
    setCategories,
    handleSoftDelete,
    handleRestore,
    handleForceDelete
  } = useCategory();

  const rows = categories; // giữ nguyên lọc nếu có

  const navigate = useNavigate();

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newRows = [...rows];
    const [movedRow] = newRows.splice(result.source.index, 1);
    newRows.splice(result.destination.index, 0, movedRow);

    setCategories(newRows);

    // TODO: Gửi API cập nhật lại thứ tự nếu cần (dựa vào orderIndex mới)
    // Ví dụ: updateCategoryOrder(newRows.map((r, i) => ({ slug: r.slug, orderIndex: i })))
  };

  return (
    <TableContainer component={Paper}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="category-table">
          {(provided) => (
            <Table {...provided.droppableProps} ref={provided.innerRef}>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === rows.length && rows.length > 0}
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
                {rows.map((row, index) => (
                  <Draggable key={row.slug} draggableId={row.slug} index={index}>
                    {(provided, snapshot) => (
                      <TableRow
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          background: snapshot.isDragging ? '#f0f0f0' : 'inherit'
                        }}
                      >
                        <TableCell padding="checkbox">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(row.slug)}
                            onChange={() => handleSelectRow(row.slug)}
                          />
                        </TableCell>
                        <TableCell>
                          {'— '.repeat(row.level) + row.name}
                        </TableCell>
                        <TableCell>{row.postCount}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            size="extraSmall"
                            color={row.isActive ? 'success' : 'warning'}
                          >
                            {row.isActive ? 'Đã xuất bản' : 'Bản nháp'}
                          </Button>
                        </TableCell>
                        <TableCell align="right">
                          <MoreActionsMenu
                            tabStatus={filters.status}
                            onDelete={() => handleSoftDelete(row)}
                            onEdit={() =>
                              navigate(`/admin/danh-muc-bai-viet/chinh-sua-danh-muc/${row.slug}`)
                            }
                            onRestore={() => handleRestore(row.slug)}
                            onForceDelete={() => handleForceDelete(row.slug)}
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Không có kết quả
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </Droppable>
      </DragDropContext>
    </TableContainer>
  );
};

export default CategoryTable;
