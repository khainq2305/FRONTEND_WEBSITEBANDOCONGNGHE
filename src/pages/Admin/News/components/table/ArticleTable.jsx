import React from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Paper, Button, Chip, IconButton, Tooltip, Box, Typography, CircularProgress
} from '@mui/material';
import MoreActionsMenu from '../MoreActionsMenu/MoreActionsMenu';
import EditSlugDialog from '@/components/Admin/EditSlugDialog';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { ImportExport, TrendingUp, Edit, Visibility, Link } from '@mui/icons-material';
import { getArticleViewUrl } from '@/constants/environment';

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
  pageSize,
  slug,
  onEditSEO,
  onAnalyzeSEO,
  onEditSlug,
  seoLoading = false
}) => {
  const navigate = useNavigate();
  const rows = articles;
  const [editSlugDialog, setEditSlugDialog] = React.useState({ open: false, article: null });

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
                  <TableCell align="center">SEO Score</TableCell>
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
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                              {row.title}
                            </Typography>
                            {row.seoData?.focusKeyword && (
                              <Chip
                                label={row.seoData.focusKeyword}
                                size="small"
                                sx={{ 
                                  fontSize: '0.75rem',
                                  height: '20px',
                                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                  color: 'white'
                                }}
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>{row.author?.fullName || 'không có'}</TableCell>
                        <TableCell>{row.category?.name || `#${row.categoryId}` || 'không có'}</TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                            <Box sx={{ 
                              width: 40, 
                              height: 40, 
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: row.seoData?.seoScore >= 70 
                                ? 'linear-gradient(135deg, #4CAF50, #45a049)'
                                : row.seoData?.seoScore >= 50 
                                ? 'linear-gradient(135deg, #FF9800, #F57C00)'
                                : 'linear-gradient(135deg, #f44336, #d32f2f)',
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: '0.75rem',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                            }}>
                              {row.seoData?.seoScore || 0}
                            </Box>
                          </Box>
                        </TableCell>
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
                          <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', gap: '8px' }}>
                            {/* SEO Actions */}
                            <Tooltip title="Chỉnh sửa SEO">
                              <IconButton
                                size="small"
                                onClick={() => onEditSEO && onEditSEO(row)}
                                sx={{ 
                                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                  color: 'white',
                                  width: 32,
                                  height: 32,
                                  '&:hover': {
                                    background: 'linear-gradient(135deg, #764ba2, #667eea)',
                                    transform: 'scale(1.1)'
                                  }
                                }}
                              >
                                <Edit sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Phân tích SEO">
                              <IconButton
                                size="small"
                                onClick={() => onAnalyzeSEO && onAnalyzeSEO(row.id)}
                                disabled={seoLoading}
                                sx={{ 
                                  background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                                  color: 'white',
                                  width: 32,
                                  height: 32,
                                  '&:hover': {
                                    background: 'linear-gradient(135deg, #45a049, #4CAF50)',
                                    transform: seoLoading ? 'none' : 'scale(1.1)'
                                  },
                                  '&:disabled': {
                                    background: '#ccc',
                                    color: 'white'
                                  }
                                }}
                              >
                                {seoLoading ? (
                                  <CircularProgress size={16} sx={{ color: 'white' }} />
                                ) : (
                                  <TrendingUp sx={{ fontSize: 16 }} />
                                )}
                              </IconButton>
                            </Tooltip>

                            {/* Xem bài viết */}
                            <Tooltip title="Xem bài viết">
                              <IconButton
                                size="small"
                                onClick={() => window.open(getArticleViewUrl(row.slug), '_blank')}
                                sx={{ 
                                  background: 'linear-gradient(135deg, #2196F3, #1976D2)',
                                  color: 'white',
                                  width: 32,
                                  height: 32,
                                  '&:hover': {
                                    background: 'linear-gradient(135deg, #1976D2, #2196F3)',
                                    transform: 'scale(1.1)'
                                  }
                                }}
                              >
                                <Visibility sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>

                            {/* Chỉnh sửa slug */}
                            <Tooltip title="Chỉnh sửa Slug">
                              <IconButton
                                size="small"
                                onClick={() => setEditSlugDialog({ open: true, article: row })}
                                sx={{ 
                                  background: 'linear-gradient(135deg, #FF9800, #F57C00)',
                                  color: 'white',
                                  width: 32,
                                  height: 32,
                                  '&:hover': {
                                    background: 'linear-gradient(135deg, #F57C00, #FF9800)',
                                    transform: 'scale(1.1)'
                                  }
                                }}
                              >
                                <Link sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                            
                            <MoreActionsMenu
                              tabStatus={filters.status}
                              onDelete={() => handleSoftDelete(row)}
                              onEdit={() =>
                                navigate(`/admin/quan-ly-bai-viet/chinh-sua-bai-viet/${row.slug}`)
                              }
                              onView={() =>
                              navigate(`/admin/quan-ly-bai-viet/chi-tiet-bai-viet/${row.slug}`)

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
                    <TableCell colSpan={8} align="center">
                      Không có kết quả
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </Droppable>
      </DragDropContext>

      {/* Edit Slug Dialog */}
      <EditSlugDialog
        open={editSlugDialog.open}
        onClose={() => setEditSlugDialog({ open: false, article: null })}
        article={editSlugDialog.article}
        onSave={onEditSlug}
      />
    </TableContainer>
  );
};

export default ArticleTable;
