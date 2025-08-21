  import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Chip, IconButton } from '@mui/material';
  import { useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import MoreActionsMenu from '../../../components/common/MoreActionsMenu';
  import { DndContext, closestCenter } from '@dnd-kit/core';
  import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
  import { CSS } from '@dnd-kit/utilities';
  import ImportExportIcon from '@mui/icons-material/ImportExport';
  import { toast } from 'react-toastify';
  import { notificationService } from '../../../services/admin/notificationService';
  import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
  import { confirmDelete } from '../../../components/common/ConfirmDeleteDialog';
  import NotificationDetailDialog from './NotificationDetailDialog';

  const getStatusChip = (isActive) => (
    <Chip label={isActive ? 'Hoạt động' : 'Tạm tắt'} color={isActive ? 'success' : 'default'} size="small" />
  );

  function RowSortable({ item, index, selectedIds, onSelect, onEdit, onDelete, onView }) {
    const navigate = useNavigate();

    const { setNodeRef, transform, transition, listeners, attributes } = useSortable({
      id: item.id,
      handle: true
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition
    };

    return (
      <TableRow ref={setNodeRef} style={style} key={item.id}>
        <TableCell padding="checkbox">
          <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => onSelect(item.id)} />
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
          ) : (
            '—'
          )}
        </TableCell>
        <TableCell className="max-w-[300px] whitespace-nowrap overflow-hidden text-ellipsis" title={item.title}>
          {item.title}
        </TableCell>
        <TableCell>{item.type}</TableCell>
        <TableCell>{getStatusChip(item.isActive)}</TableCell>
        <TableCell align="right">
          <div className="flex justify-end items-center gap-2">
            <MoreActionsMenu
              onView={() => onView(item)}
              onEdit={() => navigate(`/admin/notifications/edit/${item.slug}`)} // đúng
              onDelete={() => onDelete(item)}
            />
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
    const [detailData, setDetailData] = useState(null);
    const [openDetail, setOpenDetail] = useState(false);

    const handleViewDetail = (item) => {
      setDetailData(item);
      setOpenDetail(true);
    };

    const handleDragEnd = async ({ active, over }) => {
      if (active.id !== over?.id) {
        const oldIndex = notifications.findIndex((n) => n.id === active.id);
        const newIndex = notifications.findIndex((n) => n.id === over.id);
        const newList = arrayMove(notifications, oldIndex, newIndex);
        setNotifications(newList);

        const ordered = newList.map((n, index) => ({ id: n.id, orderIndex: index }));
        try {
          await notificationService.updateOrderIndex(ordered);
          toast.success('Đã lưu thứ tự');
        } catch (err) {
          toast.error('Lỗi khi cập nhật thứ tự !');
        }
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
                        checked={notifications.length > 0 && selectedIds.length === notifications.length}
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
                        onDelete={onDelete}
                        onView={handleViewDetail}
                      />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        Không có dữ liệu
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </SortableContext>
          </DndContext>
        </TableContainer>

        <NotificationDetailDialog open={openDetail} onClose={() => setOpenDetail(false)} data={detailData} />
      </>
    );
  };

  export default NotificationTable;
