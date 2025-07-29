import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  Tabs,
  Tab,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Checkbox,
  Menu
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import formatDateFlexible from '../../../utils/formatCurrentDateTime';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { flashSaleService } from '../../../services/admin/flashSaleService';
import LoaderAdmin from '../../../components/Admin/LoaderVip';
import HighlightText from '../../../components/Admin/HighlightText';
import MUIPagination from '../../../components/common/Pagination';
import { confirmDelete } from '../../../components/common/ConfirmDeleteDialog';
import { toast } from 'react-toastify';
import Breadcrumb from '../../../components/common/Breadcrumb';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

const FlashSaleList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState({ active: 0, inactive: 0, trash: 0 });
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRowId, setMenuRowId] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [bulkAction, setBulkAction] = useState('');
const [menuRow, setMenuRow] = useState(null); // lưu row đang mở menu
const [menuPosition, setMenuPosition] = useState(null); // lưu toạ độ menu

  const isTrashTab = tab === 'trash';

const handleMenuClick = (e, row) => {
  const rect = e.currentTarget.getBoundingClientRect();
  setMenuRow(row);
  setMenuPosition({ top: rect.bottom, left: rect.right });
};

const handleMenuClose = () => {
  setMenuRow(null);
  setMenuPosition(null);
};

const SortableRow = ({ row, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: row.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <TableRow ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, (child) => {
        if (
          React.isValidElement(child) &&
          child.props.align === 'center' &&
          React.Children.toArray(child.props.children).some(
            (c) => c?.type === IconButton
          )
        ) {
          return React.cloneElement(child, {
            children: (
              <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                <DragIndicatorIcon {...listeners} sx={{ cursor: 'grab', color: '#888' }} />
                {child.props.children}
              </Box>
            )
          });
        }

        return child;
      })}
    </TableRow>
  );
};


const [dragList, setDragList] = useState([]);
const sensors = useSensors(useSensor(PointerSensor));
const handleDragEnd = async ({ active, over }) => {
  if (!over || active.id === over.id) return;
  const oldIndex = dragList.findIndex((x) => x.id === active.id);
  const newIndex = dragList.findIndex((x) => x.id === over.id);
  const newList = arrayMove(dragList, oldIndex, newIndex);

  // ✅ Cập nhật orderIndex theo vị trí mới
 const updatedList = newList.map((item, i) => ({
  ...item,
  orderIndex: i // ✅ 0-based
}));

  setDragList(updatedList);
  setData(updatedList); // để đồng bộ bảng hiển thị

  try {
    await flashSaleService.updateOrder({ orderedIds: updatedList.map(i => i.id) });
    toast.success('Cập nhật thứ tự thành công!');
  } catch (e) {
    toast.error('Cập nhật thứ tự thất bại!');
  }
};



  const handleTabChange = (e, newValue) => {
    setTab(newValue);
    setPage(1);
  };

  const handleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = data.map((row) => row.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await flashSaleService.list({ page, limit: rowsPerPage, tab, search });
      setData(res.data.rows);
      setDragList(res.data.rows); // <- THÊM DÒNG NÀY
      setTotal(res.data.count);
      setStats({
        active: res.data.totalActive || 0,
        inactive: res.data.totalInactive || 0,
        trash: res.data.totalTrash || 0
      });
    } catch (err) {
      toast.error('Lỗi khi tải danh sách Flash Sale');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmDelete('xoá', 'flash sale này');
    if (!confirmed) return;
    await flashSaleService.softDelete(id);
    toast.success('Đã chuyển vào thùng rác');
    fetchData();
  };

  const handleRestore = async (id) => {
    const confirmed = await confirmDelete('khôi phục', 'flash sale này');
    if (!confirmed) return;
    await flashSaleService.restore(id);
    toast.success('Đã khôi phục');
    fetchData();
  };

  const handleForceDelete = async (id) => {
    const confirmed = await confirmDelete('xoá vĩnh viễn', 'flash sale này');
    if (!confirmed) return;
    await flashSaleService.forceDelete(id);
    toast.success('Đã xoá vĩnh viễn');
    fetchData();
  };

  const handleBulkAction = async (action) => {
    if (selectedIds.length === 0) return;

    let label = '';
    let actionFunc;

    if (action === 'khoi-phuc') {
      label = 'khôi phục';
      actionFunc = () => flashSaleService.restoreMany(selectedIds);
    } else if (action === 'xoa-vinh-vien') {
      label = 'xoá vĩnh viễn';
      actionFunc = () => flashSaleService.forceDeleteMany(selectedIds);
    } else if (action === 'xoa') {
      label = 'xoá';
      actionFunc = () => flashSaleService.softDeleteMany(selectedIds);
    } else {
      return;
    }

    const confirmed = await confirmDelete(label, `${selectedIds.length} flash sale`);
    if (!confirmed) return;

    try {
      await actionFunc();
      toast.success(`Đã ${label} ${selectedIds.length} mục`);
      fetchData();
    } catch (err) {
      toast.error('Thao tác thất bại');
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, tab, search]);

  return (
    <Box p={2}>
      <Breadcrumb items={[{ label: 'Trang chủ', href: '/admin' }, { label: 'Khuyến mãi' }]} />

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} mt={2}>
        <Typography variant="h5" fontWeight={600}>
          Danh sách khuyến mãi
        </Typography>

        <Button variant="contained" onClick={() => navigate('/admin/flash-sale/create')}>
          Thêm Mới
        </Button>
      </Box>

      <Paper elevation={1} sx={{ p: 2, mt: 2, mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Tabs value={tab} onChange={handleTabChange}>
            <Tab label={`Tất Cả (${total})`} value="all" />
            <Tab label={`Hoạt Động (${stats.active})`} value="active" />
            <Tab label={`Tạm Tắt (${stats.inactive})`} value="inactive" />
            <Tab label={`Thùng Rác (${stats.trash})`} value="trash" />
          </Tabs>
        </Box>

        <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Box display="flex" gap={2}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <Select
                displayEmpty
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                renderValue={() => {
                  switch (bulkAction) {
                    case 'khoi-phuc':
                      return 'Đã chọn: Khôi phục';
                    case 'xoa-vinh-vien':
                      return 'Đã chọn: Xoá vĩnh viễn';
                    case 'xoa':
                      return 'Đã chọn: Xoá';
                    default:
                      return 'Chọn hành động';
                  }
                }}
              >
                <MenuItem value="" disabled>
                  Chọn hành động
                </MenuItem>
                {isTrashTab
                  ? [
                      <MenuItem key="khoi-phuc" value="khoi-phuc">
                        Khôi phục
                      </MenuItem>,
                      <MenuItem key="xoa-vinh-vien" value="xoa-vinh-vien">
                        Xoá vĩnh viễn
                      </MenuItem>
                    ]
                  : [
                      <MenuItem key="xoa" value="xoa">
                        Chuyển vào thùng rác
                      </MenuItem>
                    ]}
              </Select>
            </FormControl>
            <Button variant="outlined" disabled={selectedIds.length === 0 || !bulkAction} onClick={() => handleBulkAction(bulkAction)}>
              Áp Dụng
            </Button>
          </Box>

          <TextField size="small" placeholder="Tìm kiếm theo tên..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </Box>
      </Paper>

      {loading ? (
        <LoaderAdmin fullscreen={false} />
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox checked={selectedIds.length === data.length && data.length > 0} onChange={handleSelectAll} />
                </TableCell>
                <TableCell align="center">STT</TableCell>

                <TableCell align="center">Banner</TableCell>
                <TableCell>Tên</TableCell>
                <TableCell>Thời gian</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell align="center">Màu nền</TableCell>
<TableCell align="center">Thứ tự</TableCell>

                <TableCell align="center">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography variant="body1" color="text.secondary">
                      Không tìm thấy kết quả phù hợp
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
               <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
  <SortableContext items={dragList.map(i => i.id)} strategy={verticalListSortingStrategy}>
    {dragList.map((row, index) => (
      <SortableRow key={row.id} row={row}>
       <TableCell padding="checkbox">
                      <Checkbox checked={selectedIds.includes(row.id)} onChange={() => handleSelect(row.id)} />
                    </TableCell>
                    <TableCell align="center">{(page - 1) * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      {row.bannerUrl ? (
                        <img
                          src={row.bannerUrl}
                          alt="banner"
                          style={{
                            width: '150px',
                            height: '58px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            verticalAlign: 'middle'
                          }}
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Không có
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell>
                      <HighlightText text={row.title} highlight={search} />
                    </TableCell>

                    <TableCell>
                      {`${formatDateFlexible(row.startTime, { showTime: true })} - ${formatDateFlexible(row.endTime, { showTime: true })}`}
                    </TableCell>

                    <TableCell>{row.isActive ? 'Đang chạy' : 'Tạm dừng'}</TableCell>
                    <TableCell>{row.slug}</TableCell>
                    <TableCell align="center">
                      <Box display="flex" justifyContent="center">
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '4px',
                            backgroundColor: row.bgColor || '#ccc',
                            border: '1px solid #999'
                          }}
                          title={row.bgColor}
                        />
                      </Box>
                    </TableCell>
<TableCell align="center">{row.orderIndex}</TableCell>

                    <TableCell align="center" sx={{ minWidth: 60 }}>


<IconButton
  size="small"
  onClick={(e) => {
    e.stopPropagation();
    handleMenuClick(e, row);
  }}
>
  <MoreVertIcon />
</IconButton>


                      <Menu
                        anchorEl={anchorEl}
                        open={openMenu && menuRowId === row.id}
                        onClose={handleMenuClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                      >
                        {!row.deletedAt && (
                          <MenuItem
                            onClick={() => {
                              handleMenuClose();
                              navigate(`/admin/flash-sale/edit/${row.slug}`);
                            }}
                          >
                            Sửa
                          </MenuItem>
                        )}
                        {row.deletedAt ? (
                          <>
                            <MenuItem
                              onClick={() => {
                                handleMenuClose();
                                handleRestore(row.id);
                              }}
                            >
                              Khôi phục
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                handleMenuClose();
                                handleForceDelete(row.id);
                              }}
                            >
                              Xoá vĩnh viễn
                            </MenuItem>
                          </>
                        ) : (
                          <MenuItem
                            onClick={() => {
                              handleMenuClose();
                              handleDelete(row.id);
                            }}
                          >
                            Xoá
                          </MenuItem>
                        )}
                      </Menu>
                    </TableCell>
      </SortableRow>
    ))}
  </SortableContext>
</DndContext>

              )}
            </TableBody>
          </Table>
        </Paper>
      )}
      <Menu
  open={Boolean(menuRow && menuPosition)}
  onClose={handleMenuClose}
  anchorReference="anchorPosition"
  anchorPosition={menuPosition}
  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
>
  {menuRow && !menuRow.deletedAt && (
    <MenuItem
      onClick={() => {
        handleMenuClose();
        navigate(`/admin/flash-sale/edit/${menuRow.slug}`);
      }}
    >
      Sửa
    </MenuItem>
  )}
  {menuRow?.deletedAt ? (
    <>
      <MenuItem
        onClick={() => {
          handleMenuClose();
          handleRestore(menuRow.id);
        }}
      >
        Khôi phục
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleMenuClose();
          handleForceDelete(menuRow.id);
        }}
      >
        Xoá vĩnh viễn
      </MenuItem>
    </>
  ) : (
    <MenuItem
      onClick={() => {
        handleMenuClose();
        handleDelete(menuRow.id);
      }}
    >
      Xoá
    </MenuItem>
  )}
</Menu>

      {total > rowsPerPage && <MUIPagination currentPage={page} totalItems={total} itemsPerPage={rowsPerPage} onPageChange={setPage} />}
    </Box>
  );
  
};

export default FlashSaleList;
