import {
  Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Paper, Chip, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, Typography, CircularProgress, Box
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MoreActionsMenu from './MoreActionsMenu';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  arrayMove, SortableContext, useSortable, verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import { toast } from 'react-toastify';
import { notificationService } from "../../../services/admin/notificationService";
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';

const getStatusChip = (isActive) => (
  <Chip
    label={isActive ? 'Hiển thị' : 'Ẩn'}
    color={isActive ? 'success' : 'default'}
    size="small"
  />
);

function RowSortable({ item, index, selectedIds, onSelect, onEdit, onDelete }) {
  const navigate = useNavigate();
  const { setNodeRef, transform, transition, listeners, attributes } = useSortable({
    id: item.id,
    handle: true
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const actions = [
    {
      label: 'Xem chi tiết',
      onClick: () => navigate(`/admin/notifications/${item.id}`)
    },
    {
      label: 'Sửa',
      onClick: () => onEdit(item)
    },
    {
      label: 'Xóa',
      onClick: () => onDelete(item),
      color: 'error'
    }
  ];

  return (
    <TableRow ref={setNodeRef} style={style} key={item.id}>
      <TableCell padding="checkbox">
        <input
          type="checkbox"
          checked={selectedIds.includes(item.id)}
          onChange={() => onSelect(item.id)}
        />
      </TableCell>
      <TableCell>{index + 1}</TableCell>
      <TableCell>
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt="thumb"
            style={{
              width: '100px',
              height: '80px',
              objectFit: 'cover',
              borderRadius: '6px',
              border: '1px solid #ddd'
            }}
          />
        ) : '—'}
      </TableCell>
      <TableCell>{item.title}</TableCell>
      <TableCell>{item.type}</TableCell>
      <TableCell>{getStatusChip(item.isActive)}</TableCell>
      <TableCell align="right">
        <div className="flex justify-end items-center gap-2">
          <MoreActionsMenu actions={actions} />
          <IconButton
            {...attributes}
            {...listeners}
            size="small"
            sx={{ cursor: 'grab' }}
            title="Kéo để thay đổi vị trí"
          >
            <ImportExportIcon fontSize="small" />
          </IconButton>
        </div>
      </TableCell>
    </TableRow>
  );
}

const NotificationTable = ({
  notifications = [],
  selectedIds = [],
  onSelect = () => {},
  onSelectAll = () => {},
  onEdit = () => {},
  onDelete = () => {},
  loading = false,
  setNotifications = () => {}
}) => {
  const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null });
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleDragEnd = async ({ active, over }) => {
    if (active.id !== over?.id) {
      const oldIndex = notifications.findIndex((n) => n.id === active.id);
      const newIndex = notifications.findIndex((n) => n.id === over.id);
      const newList = arrayMove(notifications, oldIndex, newIndex);
      setNotifications(newList);

      const ordered = newList.map((n, index) => ({ id: n.id, orderIndex: index }));
      try {
        await notificationService.updateOrderIndex(ordered);
        toast.success('✅ Đã lưu thứ tự');
      } catch (err) {
        toast.error('❌ Lỗi khi cập nhật thứ tự');
      }
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setLoadingDelete(true);
      await notificationService.delete(deleteDialog.item?.id);
      toast.success('🗑️ Đã xoá thông báo');
      setNotifications((prev) =>
        prev.filter((n) => n.id !== deleteDialog.item?.id)
      );
      setDeleteDialog({ open: false, item: null });
    } catch (err) {
      toast.error('❌ Lỗi khi xoá thông báo');
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ overflowX: 'auto', overflowY: 'visible' }}>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        >
          <SortableContext
            items={Array.isArray(notifications) ? notifications.map((item) => item.id) : []}
            strategy={verticalListSortingStrategy}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <input
                      type="checkbox"
                      checked={
                        notifications.length > 0 &&
                        selectedIds.length === notifications.length
                      }
                      onChange={onSelectAll}
                    />
                  </TableCell>
                  <TableCell>STT</TableCell>
                  <TableCell>Ảnh</TableCell>
                  <TableCell>Tiêu đề</TableCell>
                  <TableCell>Loại</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell align="right">Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Đang tải dữ liệu...
                    </TableCell>
                  </TableRow>
                ) : Array.isArray(notifications) && notifications.length > 0 ? (
                  notifications.map((item, index) => (
                    <RowSortable
                      key={item.id}
                      item={item}
                      index={index}
                      selectedIds={selectedIds}
                      onSelect={onSelect}
                      onEdit={onEdit}
                      onDelete={(item) => setDeleteDialog({ open: true, item })}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Không có dữ liệu.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </SortableContext>
        </DndContext>
      </TableContainer>

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, item: null })}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography color="error">Xác nhận xoá</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xoá thông báo{' '}
            <strong>{deleteDialog.item?.title}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, item: null })}>
            Huỷ
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            disabled={loadingDelete}
          >
            {loadingDelete ? <CircularProgress size={20} /> : 'Xác nhận'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NotificationTable;
