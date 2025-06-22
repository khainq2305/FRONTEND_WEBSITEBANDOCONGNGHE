import React, {useState, useEffect} from 'react';
import { Box, Typography, Button, Collapse, Paper, Grid, Avatar, Divider, CircularProgress, Alert, Switch } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';


import { rolesService } from '@/services/admin/rolesService';
import { permissionsService } from '@/services/admin/permissionService';
import { preventSpam } from '@/utils/preventSpam';
import { DotColor } from './Card';
import SwitchCustom from '@/components/Admin/SwitchCustom';
import { toast } from 'react-toastify';
// ========================================================================

// ========================================================================
// STYLING & CONSTANTS
// ========================================================================
export const ROLE_COLORS = [
  '#f44336',
  '#e91e63',
  '#9c27b0',
  '#673ab7',
  '#3f51b5',
  '#2196f3',
  '#03a9f4',
  '#00bcd4',
  '#009688',
  '#4caf50',
  '#8bc34a',
  '#cddc39',
  '#ffeb3b',
  '#ffc107',
  '#ff9800',
  '#ff5722',
  '#795548',
  '#9e9e9e',
  '#607d8b',
  '#000000'
];

// ========================================================================
// USER PERMISSION CARD COMPONENT (Component con)
// Nhiệm vụ: Hiển thị và xử lý logic cho MỘT đối tượng (subject)
// ========================================================================
export default function UserPermissionCard({ label, subject, desc }) {
  const [expanded, setExpanded] = useState(false);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [matrix, setMatrix] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const LEFT_COLUMN_WIDTH = 2.5; // Tăng nhẹ chiều rộng cột trái

  // Tính toán lại chiều rộng cột quyền, vẫn giữ nguyên logic
  const totalPermissionCols = permissions.length + 1;
  const permissionColWidth = totalPermissionCols > 0 ? (12 - LEFT_COLUMN_WIDTH) / totalPermissionCols : 0;

  useEffect(() => {
    if (!expanded) return;

    const fetchDataForCard = async () => {
      setLoading(true);
      setError(null);
      try {
        const [roleRes, permRes, matrixRes] = await Promise.all([
          rolesService.getAll(),
          permissionsService.getActionsForSubject(subject),
          permissionsService.getMatrix(subject)
        ]);
        setRoles(roleRes.data.data || []);
        setPermissions(permRes.data.data || []);
        setMatrix(matrixRes.data.data || {});
      } catch (err) {
        console.error(`Lỗi tải dữ liệu cho subject ${subject}:`, err);
        setError('Không thể tải dữ liệu chi tiết.');
      } finally {
        setLoading(false);
      }
    };
    fetchDataForCard();
  }, [subject, expanded]);

  const handlePermissionChange = async (roleId, action, checked) => {
    if (preventSpam('update_permission')) return;

    const optimisticMatrix = JSON.parse(JSON.stringify(matrix));
    if (!optimisticMatrix[roleId]) optimisticMatrix[roleId] = {};
    optimisticMatrix[roleId][action] = checked;
    setMatrix(optimisticMatrix);

    try {
      await permissionsService.updatePermission({ roleId, subject, action, hasPermission: checked });
    } catch (apiError) {
      const revertedMatrix = JSON.parse(JSON.stringify(matrix));
      revertedMatrix[roleId][action] = !checked;
      setMatrix(revertedMatrix);
      toast.success('Cap nhat that bai')
    }
  };

  const handleSelectAllChange = async (roleId, checked) => {
    if (preventSpam('slectAll_permission', 2000)) return;
    const originalPermissions = { ...(matrix[roleId] || {}) };

    const optimisticMatrix = JSON.parse(JSON.stringify(matrix));
    if (!optimisticMatrix[roleId]) optimisticMatrix[roleId] = {};
    permissions.forEach((perm) => {
      optimisticMatrix[roleId][perm.action] = checked;
    });
    setMatrix(optimisticMatrix);

    try {
      const updatePromises = permissions.map((perm) =>
        permissionsService.updatePermission({
          roleId,
          subject,
          action: perm.action,
          hasPermission: checked
        })
      );
      const results = await Promise.all(updatePromises);
    } catch (apiError) {
      console.error(`Lỗi khi cập nhật tất cả quyền cho role ${roleId}:`, apiError);

      const revertedMatrix = JSON.parse(JSON.stringify(matrix));
      revertedMatrix[roleId] = originalPermissions;
      setMatrix(revertedMatrix);
    }
  };

  return (
    <Paper sx={{ p: 2.5, borderRadius: 4, breakInside: 'avoid', mb: 3, boxShadow: 'rgba(149, 157, 165, 0.1) 0px 8px 24px' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', fontWeight: 'bold' }}>
            {label ? label.charAt(0).toUpperCase() : ''}
          </Avatar>
          <Box>
            <Typography fontWeight="bold" variant="h6">
              {label}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {desc}
            </Typography>
          </Box>
        </Box>
        <Button
          size="small"
          variant="outlined"
          onClick={() => setExpanded((prev) => !prev)}
          endIcon={expanded ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        >
          Chi tiết
        </Button>
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit sx={{ mt: 2.5 }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && (
          <>
            <Grid container spacing={1} sx={{ mb: 1.5 }} alignItems="start">
              <Grid item xs={LEFT_COLUMN_WIDTH} /> {/* Spacer */}
              <Grid item xs={permissionColWidth} key="select-all-header">
                <Box textAlign="center">
                  <Typography fontWeight={600} variant="body2">
                    Tất cả
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Chọn/Bỏ hết
                  </Typography>
                </Box>
              </Grid>
              {permissions.map((perm) => (
                <Grid item xs={permissionColWidth} key={perm.action}>
                  <Box textAlign="center">
                    <Typography fontWeight={600} variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {perm.action}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {perm.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Divider sx={{ mb: 1 }} />

            {roles.map((role, index) => {
              const isAllSelected = permissions.length > 0 && permissions.every((perm) => !!matrix?.[role.id]?.[perm.action]);

              return (
                <Grid
                  container
                  spacing={1}
                  alignItems="self-start"
                  key={role.id}
                  sx={{ py: 1.5, '&:hover': { bgcolor: 'action.hover' }, borderRadius: 2 }}
                >
                  {/* Cột tên Role */}
                  <Grid item xs={LEFT_COLUMN_WIDTH}>
                    <Box display="flex" flexDirection="column" sx={{ pl: 1 }}>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <DotColor color={ROLE_COLORS[index % ROLE_COLORS.length]} />
                        <Typography
                          fontWeight="bold"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {role.name}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ pl: '20px' }}>
                        {role.userCount || 0} người dùng
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={permissionColWidth} key={`${role.id}-select-all`}>
                    <Box display="flex" justifyContent="center">
                      <SwitchCustom checked={isAllSelected} onChange={(e) => handleSelectAllChange(role.id, e.target.checked)} />
                    </Box>
                  </Grid>

                  {/* Các cột quyền riêng lẻ */}
                  {permissions.map((perm) => (
                    <Grid item xs={permissionColWidth} key={`${role.id}-${perm.action}`}>
                      <Box display="flex" justifyContent="center">
                        <SwitchCustom
                          checked={!!matrix?.[role.id]?.[perm.action]}
                          onChange={(e) => handlePermissionChange(role.id, perm.action, e.target.checked)}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              );
            })}
          </>
        )}
      </Collapse>
    </Paper>
  );
}
