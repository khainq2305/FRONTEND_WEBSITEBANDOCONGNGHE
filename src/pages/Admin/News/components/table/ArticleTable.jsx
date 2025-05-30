import {
  Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Paper, Button
} from '@mui/material';
import MoreActionsMenu from '../MoreActionsMenu/MoreActionsMenu';
import { useNavigate } from 'react-router-dom';

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { ImportExport } from '@mui/icons-material';

const ArticleTable = ({
  articles = [],
  selectedRows,
  handleSelectRow,
  handleSelectAll,
  setModalItem,
  handleSoftDelete,
  filters,
  handleRestore,
  handleForceDelete,
  setArticles,
  currentPage,
  pageSize
}) => {
  const navigate = useNavigate();
  const rows = articles;

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newRows = Array.from(rows);
    const [movedRow] = newRows.splice(result.source.index, 1);
    newRows.splice(result.destination.index, 0, movedRow);

    const reorderSlugs = newRows.map(r => r.slug);
    const reordered = articles
      .filter(a => reorderSlugs.includes(a.slug))
      .sort((a, b) => reorderSlugs.indexOf(a.slug) - reorderSlugs.indexOf(b.slug));
    const remaining = articles.filter(a => !reorderSlugs.includes(a.slug));

    setArticles([...reordered, ...remaining]);
    // TODO: gọi API cập nhật thứ tự nếu cần
  };

  return (
    <TableContainer component={Paper}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="article-table">
          {(provided) => (
            <Table {...provided.droppableProps} ref={provided.innerRef}>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <input
                      type="checkbox"
                      checked={(selectedRows?.length || 0) === rows.length && rows.length > 0}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>STT</TableCell>
                  <TableCell>Tiêu đề</TableCell>
                  <TableCell>Tác giả</TableCell>
                  <TableCell>Danh mục</TableCell>
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
                          background: snapshot.isDragging ? '#f5f5f5' : 'inherit'
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
                        <TableCell>{row.title}</TableCell>
                        <TableCell>{row.User?.fullName || 'không có'}</TableCell>
                        <TableCell>{row.category?.name || `#${row.categoryId}` || 'không có'}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            size="extraSmall"
                            color={
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
                          <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                            <MoreActionsMenu
                              tabStatus={filters.status}
                              onDelete={() => handleSoftDelete(row)}
                              onEdit={() =>
                                navigate(`/admin/quan-ly-bai-viet/chinh-sua-bai-viet/${row.slug}`)
                              }
                              onView={() =>
                                setModalItem({
                                  ...row,
                                  name: row.title,
                                  author: `${row.authorId}`,
                                  category: row.category?.name || `#${row.categoryId}`,
                                  date: new Date(row.createdAt).toLocaleDateString('vi-VN'),
                                  tag: row.status,
                                  comment: 0,
                                  status: row.status,
                                  publishAt: row.publishAt
                                })
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

export default ArticleTable;
