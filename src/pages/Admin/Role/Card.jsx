import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, FileText, Settings, Trash2, Edit } from 'lucide-react';
import {
  Box,
  Typography,
  Button,
  Collapse,
  IconButton,
  AvatarGroup,
  Paper,
  Grid,
  Avatar,
  Divider,
  Card,
  CardContent,
  CardActions,
  Menu,
  Fade,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Chip,
  Badge,
  Switch,
  styled,
  Alert,
  CircularProgress,
  Accordion,
  AccordionDetails,
  AccordionActions,
  AccordionSummary,

} from '@mui/material';

import { Edit2, Eye, PlusCircle, UserPlus, Pencil, MoreVertical, Grid2x2Check, CircleCheckBig, ChevronDown, ChevronUp, LayoutList } from 'lucide-react';

import { Tooltip } from '@mui/material';
import { color } from 'framer-motion';
// Giả định bạn đang dùng thư viện icon lucide-react.
// Nếu chưa có, hãy cài đặt: npm install lucide-react
// Dữ liệu mẫu để minh họa
const colorCustom = [
  { color: '#3b82f6' }, // Xanh dương - primary
  { color: '#10b981' }, // Xanh lá - success
  { color: '#f59e0b' }, // Vàng cam - warning
  { color: '#ef4444' }, // Đỏ - danger
  { color: '#8b5cf6' } // Tím - info
];

// 🎨 Danh sách 20 màu (có thể thay đổi theo theme bạn dùng)
export const ROLE_COLORS = [
  '#f44336', // đỏ
  '#e91e63', // hồng đậm
  '#9c27b0', // tím
  '#673ab7', // tím đậm
  '#3f51b5', // xanh navy
  '#2196f3', // xanh dương
  '#03a9f4', // xanh biển nhạt
  '#00bcd4', // teal
  '#009688', // xanh ngọc
  '#4caf50', // xanh lá
  '#8bc34a', // xanh non
  '#cddc39', // vàng chanh
  '#ffeb3b', // vàng
  '#ffc107', // vàng cam
  '#ff9800', // cam
  '#ff5722', // cam đỏ
  '#795548', // nâu
  '#9e9e9e', // xám
  '#607d8b', // xanh xám
  '#000000' // đen
];

// 🎯 Component hiển thị màu
export const DotColor = ({ color }) => {
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-block',
        width: 14,
        height: 14,
        borderRadius: '50%',
        bgcolor: color || '#ccc',
        flexShrink: 0
      }}
    />
  );
};
export const ActionMenu = ({ onEdit, onDelete, disableDelete = false }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit();
    handleClose();
  };

  const handleDelete = () => {
   if (!disableDelete) {
      onDelete?.();
    }
    handleClose();
  };

  return (
    <>
      <Tooltip title="Tùy chọn khác">
        <IconButton onClick={handleClick} size="small">
          <MoreVertical size={20} />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: 2 }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
            <MenuItem disabled={disableDelete} onClick={handleEdit} sx={{ gap: 1 }}>
              <Edit size={16} /> Chỉnh sửa
            </MenuItem>
            <MenuItem disabled={disableDelete} onClick={handleDelete} sx={{ gap: 1, color: 'error.main'  }}>
              <Trash2 size={16} /> {disableDelete ? 'Không thể xoá' : 'Xoá'}
            </MenuItem>
      </Menu>
    </>
  );
};
export const CardContainer = ({ children }) => {
  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: 'rgba(0, 0, 0, 0.05) 0px 4px 12px 0px',
        transition: 'all 0.3s ease-in-out',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 20px 0px',
          transform: 'translateY(-3px)'
        }
      }}
    >
      {children}
    </Card>
  );
};
// --- COMPONENT ROLES CARD ĐÃ ĐƯỢC THIẾT KẾ LẠI ---
const RolesCard = ({ role, color, onDelete, onViewDetails, onEdit }) => {
  const { label, name, description, userCount, permissionCount } = role;
  return (
    // Card được thiết kế với bóng mờ nhẹ và bo góc mềm mại
    <CardContainer>
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Phần header với tên vai trò và nút xóa */}
        <Box display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" flexWrap="wrap" alignItems="center" gap={0.5}>
            <DotColor color={color} />
            <Typography variant="h6" component="div" fontWeight={600}>
              {name} {userCount > 0 && `+${userCount}`}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: '0.8rem' } }}>
              {/* Tạo avatar giả để minh họa */}
              {Array.from({ length: userCount }).map((_, index) => (
                <Avatar key={index} sx={{ bgcolor: color }}>
                  {label}
                </Avatar>
              ))}
            </AvatarGroup>
          </Box>
        </Box>

        <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>{description}</Typography>
        <Box display="flex" flexWrap="wrap" alignItems="center" justifyContent="space-between" gap={1} mt={3}>
          <Tooltip title="Quyền">
            <Box display="flex" flexWrap="wrap" alignItems="center" gap={1} sx={{ color: 'text.secondary' }}>
              <ShieldCheck size={20} color={color} style={{ verticalAlign: 'middle' }} />
              <Typography fontWeight="bold" variant="h6" margin={0}>
                {role?.actions?.length}
              </Typography>
            </Box>
          </Tooltip>
          <Box>
            <Button
              variant="outlined"
              onClick={onViewDetails}
              size="small"
              sx={{ borderRadius: 2, mr: 1, color: 'text.primary', borderColor: 'grey.300' }}
            >
              Xem chi tiết
            </Button>
            <ActionMenu onEdit={onEdit} onDelete={onDelete} disableDelete={['admin', 'user', 'quản trị viên', 'người dùng'].includes(role.name?.toLowerCase())} />
          </Box>
        </Box>
      </CardContent>
    </CardContainer>
  );
};

// --- COMPONENT APP ĐỂ HIỂN THỊ CÁC CARD ---

const iconMap = {
  role: <Users size={28} color="#3f51b5" />,
  admin: <ShieldCheck size={28} color="#4caf50" />,
  content: <FileText size={28} color="#ff9800" />,
  tech: <Settings size={28} color="#f44336" />
};

const CountCard = ({ label, count, id }) => {
  const icon = iconMap[id] || <Users size={28} />;
  return (
    <CardContainer>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Typography sx={{ color: 'text.secondary', fontSize: 14, lineHeight: 1 }}>{icon}</Typography>
        </Box>
        <Typography variant="h4" sx={{ mb: 1.5 }}>
          {label} {count}
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>Vai trò hiện có trong hệ thống</Typography>
      </CardContent>
    </CardContainer>
  );
};

const PermissionCard = ({ label, description, actions, onEdit, onDelete, onAdd }) => {
  const [expanded, setExpanded] = useState(false);
  console.log('label', actions);
  return (
    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 1 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Box display="flex" gap={2}>
          <Avatar sx={{ bgcolor: 'purple' }}>
            <ShieldCheck size={20} />
          </Avatar>
          <Box>
            <Typography fontWeight="bold">{label}</Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" flexShrink={0} alignItems="center" gap={0.5}>
          <Box
            sx={{
              backgroundColor: '#f5f5f5',
              px: 1.5,
              py: 0.5,
              fontSize: 13,
              borderRadius: '999px'
            }}
          >
            {actions.length} quyền
          </Box>
          <IconButton onClick={() => setExpanded(!expanded)} size="small">
            <Edit2 size={16} />
          </IconButton>
        </Box>
      </Box>

      {/* Permissions List */}
      <Collapse in={expanded}>
        <Divider sx={{ mb: 2 }} />
        <Box display="flex" flexDirection="column" gap={1}>
          {actions.map((item) => (
            <Box
              key={item.key}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={1.5}
              borderRadius={2}
              sx={{
                backgroundColor: '#fafafa',
                border: '1px solid #eee'
              }}
            >
              <Box display="flex" alignItems="center" gap={1.5}>
                {iconMap[item.action] || <ShieldCheck size={20} />}
                <Box>
                  <Typography fontWeight="500">{item.label}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" gap={1}>
                <IconButton size="small" onClick={() => onEdit?.(item.key)}>
                  <Edit2 size={16} />
                </IconButton>
                <IconButton size="small" onClick={() => onDelete?.(item.key)}>
                  <Trash2 size={16} />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Add New */}
        <Button
          fullWidth
          sx={{ mt: 2, borderRadius: 2, textTransform: 'none' }}
          variant="outlined"
          startIcon={<PlusCircle size={18} />}
          onClick={onAdd}
        >
          Thêm quyền mới
        </Button>
      </Collapse>
    </Paper>
  );
};

export const PaperContainer = ({ children }) => {
  return (
    <Paper elevation={0} sx={{ m: 2, p: 1, border: '0.5px solid', borderColor: 'grey.300', borderRadius: 3 }}>
      {children}
    </Paper>
  );
};
export const PermissionCategory = ({ permGroup }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Box display="flex" flexWrap="wrap" alignItems="center" justifyContent="space-between" px={2} pb={1}>
        <Box display="flex" flexWrap="wrap" alignItems="center" gap={1}>
          <Users size={16} />
          <Typography variant="h5">{permGroup.subject}</Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <Chip
            label={`${permGroup.actions.length}/${permGroup.actions.length}`}
            color="default"
            size="small"
            sx={{ px: 1, borderRadius: 50, fontWeight: 600, color: 'black' }}
          />
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={open}>
        <Box display="flex" flexWrap="wrap" columnGap={2} rowGap={1} my={1} px={2}>
          {permGroup.actions.map((item) => (
            <Box
              width="calc(50% - 8px)"
              key={item.key}
              display="flex"
              alignItems="center"
              justifyContent="start"
              gap={1}
              px={0.5}
              py={1}
              sx={{
                bgcolor: '#ecfdf5',
                color: 'white',
                borderRadius: 1,
                borderLeft: 3,
                borderColor: '#1bb683'
              }}
            >
              <CircleCheckBig size={18} style={{ verticalAlign: 'middle', color: '#1bb683' }} />
              <Typography variant="body1" color="gray" fontWeight={500}>
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Collapse>
    </>
  );
};
import { userService1 } from '@/services/admin/userFake';
import { permissionsService } from '@/services/admin/permissionService';



const DialogDetails = ({ open, onClose, role }) => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalAction, setTotalAction] = useState('');
  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    // Chỉ fetch dữ liệu khi dialog mở và có một vai trò được danh
    if (open && role) {
      const fetchPermissions = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await permissionsService.getPermissionsByRole(role.id);
          const permissionsData = res.data.data;
          const totalActionData = res.data.totalActions;
          setPermissions(permissionsData || []);
          setTotalAction(totalActionData || '');
          console.log('permissions', res.data.data);
        } catch (err) {
          console.error('Lỗi khi tải chi tiết quyền:', err);
          setError('Không thể tải chi tiết quyền.');
        } finally {
          setLoading(false);
        }
      };
      const fetchUserRoles = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await userService1.getUserByRole(role.id);
          setUserRoles(res.data.data);
          console.log('user : ', res.data.data);
        } catch (error) {
          console.log('lỗi lấy người dùng', error);
        }
      };
      fetchPermissions();
      fetchUserRoles();
    }
  }, [open, role]); // Chạy lại khi dialog mở hoặc vai trò thay đổi

  if (!role) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography variant="h5" fontWeight="bold">
          {role.name}
        </Typography>
        <Typography color="text.secondary">{role.description}</Typography>
      </DialogTitle>

      <DialogContent
        sx={{
          overflowY: 'auto',
          scrollbarWidth: 'none', // Firefox
          '&::-webkit-scrollbar': { display: 'none' } // Chrome, Edge
        }}
      >
        {/* Phần thông tin vai trò và người dùng */}
        <PaperContainer>
          <Typography variant="h6" mb={2}>
            Thông tin vai trò
          </Typography>
          <Box display="flex" justifyContent="space-around" gap={4}>
            <Box textAlign="center">
              <Typography variant="h4" color="primary.main">
                {role.userCount || 0}
              </Typography>
              <Typography variant="body2">Người dùng</Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h4" color="success.main">
                {totalAction || 0}
              </Typography>
              <Typography variant="body2">Quyền được cấp</Typography>
            </Box>
          </Box>
        </PaperContainer>
        {userRoles.length === 0 ? (
  <PaperContainer><Typography color="text.secondary" fontStyle="italic">
    Vai trò này chưa được cấp cho người dùng nào.
  </Typography></PaperContainer>
) : (
  <PaperContainer>
    <Typography variant="subtitle1" fontWeight={600} mb={2}>
      Người dùng thuộc vai trò này ({userRoles.length})
    </Typography>

    {userRoles.map((item) => (
      <Box
        key={item.id}
        display="flex"
        flexWrap="wrap"
        alignItems="center"
        justifyContent="space-between"
        padding={1.5}
        borderBottom="1px solid #eee"
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
            <ShieldCheck size={18} />
          </Avatar>
          <Box>
            <Typography fontWeight={500}>{item.fullName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {item.email}
            </Typography>
          </Box>
        </Box>

        <Chip
          label={item.status ? 'Hoạt động' : 'Không hoạt động'}
          color={item.status ? 'primary' : 'default'}
          size="small"
          sx={{ px: 1.5, borderRadius: 50, fontWeight: 600 }}
        />
      </Box>
    ))}
  </PaperContainer>
)}

        {/* Phần hiển thị quyền */}
        <PaperContainer>
          <Box display="flex" alignItems="center" gap={0.5} mb={2}>
            <LayoutList size={16} />
            <Typography variant="h4">Danh sách quyền</Typography>
          </Box>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress size={24} />
            </Box>
          )}
          {error && <Alert severity="error">{error}</Alert>}

          {!loading && !error && permissions.length === 0 && (
            <Typography color="text.secondary" fontStyle="italic">
              Vai trò này chưa được cấp quyền nào.
            </Typography>
          )}

          {!loading && !error && permissions.map((permGroup) => <PermissionCategory key={permGroup.subject} permGroup={permGroup} />)}
        </PaperContainer>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export { RolesCard, CountCard, PermissionCard, DialogDetails, };
