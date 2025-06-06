import React from 'react';
import {
  TableContainer, Paper, Table, TableHead, TableRow,
  TableCell, TableBody, Button
} from '@mui/material';
import { ImportExport } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import MoreActionsMenu from '@/pages/Admin/News/components/MoreActionsMenu/MoreActionsMenu';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { toast } from 'react-toastify';

const CategoryTable = ({
  filters,
  selectedRows,
  handleSelectRow,
  handleSelectAll,
  setModalItem,
  handleSoftDelete,
  handleRestore,
  handleForceDelete,
  categories,
  setCategories,
  currentPage,
  pageSize,
  handleCategoryDragEnd
}) => {
  const rows = categories;
  const navigate = useNavigate();

  const handleDragEnd = (result) => {
    handleCategoryDragEnd(result, rows, setCategories, toast);
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
                  <TableCell>STT</TableCell>
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
                        <TableCell>{(currentPage - 1) * pageSize + index + 1}</TableCell>
                        <TableCell>{'— '.repeat(row.level) + row.name}</TableCell>
                        <TableCell>{row.postCount > 0 ? row.postCount : 'Chưa có bài viết'}</TableCell>
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
                          <div className="flex items-center justify-end">
                            <MoreActionsMenu
                              tabStatus={filters.status}
                              onDelete={() => handleSoftDelete(row)}
                              onEdit={() =>
                                navigate(`/admin/danh-muc-bai-viet/chinh-sua-danh-muc/${row.slug}`)
                              }
                              onRestore={() => handleRestore(row.slug)}
                              onForceDelete={() => handleForceDelete(row.slug)}
                            />
                            <div
                              {...provided.dragHandleProps}
                              style={{
                                cursor: 'grab',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '4px',
                                borderRadius: '4px',
                                transition: 'background-color 0.2s'
                              }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                              <ImportExport fontSize="small" />
                            </div>
                          </div>
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
