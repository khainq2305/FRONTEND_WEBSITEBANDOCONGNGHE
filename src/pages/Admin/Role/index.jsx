"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Button,
} from "@mui/material";
import { rolesService } from "@/services/admin/rolesService";
import axios from 'axios';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import RenderSubject from "./RenderSubject";
import { permissionsService } from "@/services/admin/permissionService";


export default function PermissionManagementPage() {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [subjects, setSubjects] = useState([]); // [{ key, label, description, icon }]
  const [actionsBySubject, setActionsBySubject] = useState({}); // { subjectKey: [ { action, description } ] }
  const [matrixBySubject, setMatrixBySubject] = useState({}); // { subjectKey: { roleId: { action: true/false } } }
  const [loading, setLoading] = useState(false);
  const [expandedSubjects, setExpandedSubjects] = useState({}); // Đối tượng để theo dõi các nhóm đã mở
  const [sortCheckedFirst, setSortCheckedFirst] = useState(false);

  // Lấy danh sách roles và subjects khi mount
  useEffect(() => {
    setLoading(true);
    Promise.all([
      rolesService.getAll(),
      permissionsService.getSubject()
    ]).then(([rolesRes, subjectsRes]) => {
      setRoles(rolesRes.data.data || []);
      setSubjects(subjectsRes.data.data || []);
      if (rolesRes.data.data && rolesRes.data.data.length > 0) {
        setSelectedRole(rolesRes.data.data[0].id);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Khi chọn role, load actions và matrix cho từng subject
  useEffect(() => {
    if (!selectedRole || subjects.length === 0) return;
    subjects.forEach(async (subject) => {
      // Lấy actions cho subject nếu chưa có
      if (!actionsBySubject[subject.key]) {
        const res = await permissionsService.getActionsForSubject(subject.key);
        setActionsBySubject(prev => ({ ...prev, [subject.key]: res.data.data || [] }));
      }
      // Lấy matrix cho subject
      const matrixRes = await permissionsService.getMatrix(subject.key);
      setMatrixBySubject(prev => ({ ...prev, [subject.key]: matrixRes.data.data || {} }));
    });
  }, [selectedRole, subjects]);

  // Cập nhật quyền
  const handleUpdatePermission = async (roleId, subject, action, checked) => {
    await permissionsService.updatePermission({ roleId, subject, action, hasPermission: checked });
    // Cập nhật lại matrix local
    setMatrixBySubject(prev => {
      const newMatrix = { ...prev };
      if (!newMatrix[subject]) newMatrix[subject] = {};
      if (!newMatrix[subject][roleId]) newMatrix[subject][roleId] = {};
      newMatrix[subject][roleId][action] = checked;
      return { ...newMatrix };
    });
  };

  // Chọn/bỏ tất cả quyền trong subject cho role
  const handleToggleAll = (subjectKey, checked) => {
    const actions = actionsBySubject[subjectKey] || [];
    actions.forEach(actionObj => {
      handleUpdatePermission(selectedRole, subjectKey, actionObj.action, checked);
    });
  };

  // Tạo sự kiện để mở/đóng nhóm
  const handleToggleSubject = (subjectKey) => {
    setExpandedSubjects(prevState => ({
      ...prevState,
      [subjectKey]: !prevState[subjectKey] // Đảo trạng thái mở/đóng của nhóm
    }));
  };

  // Mở tất cả nhóm mặc định
  useEffect(() => {
    const defaultExpanded = subjects.reduce((acc, subject) => {
      acc[subject.key] = true; // Mặc định tất cả các nhóm đều mở
      return acc;
    }, {}); 
    setExpandedSubjects(defaultExpanded);
  }, [subjects]);

  useEffect(() => {
    setSortCheckedFirst(false);
  }, [selectedRole, subjects]);

   const checkedPermissions = subjects.flatMap(subject => {
    const actions = actionsBySubject[subject.key] || [];
    const matrix = matrixBySubject[subject.key] || {};
    return actions.filter(a => matrix[selectedRole]?.[a.action]);
  });
  
  // Số quyền đã bật:
  const totalChecked = checkedPermissions.length;

  const totalPermissions = subjects.reduce((sum, subject) => {
    const actions = actionsBySubject[subject.key] || [];
    return sum + actions.length;
  }, 0);

const isAdminRole = selectedRole === "admin" || selectedRole === 1 || selectedRole === "1";
  if (loading) return <Typography>Đang tải...</Typography>;

  // Sắp xếp subjects: subject nào có quyền đã bật sẽ lên đầu
  const sortedSubjects = [...subjects].sort((a, b) => {
    const actionsA = actionsBySubject[a.key] || [];
    const matrixA = matrixBySubject[a.key] || {};
    const checkedA = actionsA.some(act => matrixA[selectedRole]?.[act.action]);

    const actionsB = actionsBySubject[b.key] || [];
    const matrixB = matrixBySubject[b.key] || {};
    const checkedB = actionsB.some(act => matrixB[selectedRole]?.[act.action]);

    if (checkedA === checkedB) return 0;
    return checkedA ? -1 : 1;
  });

  const subjectsToRender = sortCheckedFirst
    ? [...subjects].sort((a, b) => {
        const actionsA = actionsBySubject[a.key] || [];
        const matrixA = matrixBySubject[a.key] || {};
        const checkedA = actionsA.some(act => matrixA[selectedRole]?.[act.action]);

        const actionsB = actionsBySubject[b.key] || [];
        const matrixB = matrixBySubject[b.key] || {};
        const checkedB = actionsB.some(act => matrixB[selectedRole]?.[act.action]);

        if (checkedA === checkedB) return 0;
        return checkedA ? -1 : 1;
      })
    : subjects;

  const handleResetPermissions = async () => {
    // Lặp qua tất cả subject và action, gọi API updatePermission với hasPermission: false
    for (const subject of subjects) {
      const actions = actionsBySubject[subject.key] || [];
      for (const actionObj of actions) {
        await permissionsService.updatePermission({
          roleId: selectedRole,
          subject: subject.key,
          action: actionObj.action,
          hasPermission: false,
        });
      }
    }
    // Sau khi reset, reload lại matrix
    subjects.forEach(async (subject) => {
      const matrixRes = await permissionsService.getMatrix(subject.key);
      setMatrixBySubject(prev => ({ ...prev, [subject.key]: matrixRes.data.data || {} }));
    });
  };

  return (
    <Box className="container mx-auto p-6 space-y-6">
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <FormControl sx={{ flex: 1, mr: 2 }}>
          <InputLabel id="role-select-label">Chọn vai trò</InputLabel>
          <Select
            labelId="role-select-label"
            value={selectedRole}
            onChange={e => setSelectedRole(e.target.value)}
            label="Chọn vai trò"
          >
            {roles.map(role => (
              <MenuItem key={role.id} value={role.id} sx={{
                '&:hover': {
                  backgroundColor: 'secondary.light',
                  // Đổi màu chữ của tất cả Typography bên trong MenuItem khi hover
                  '& .MuiTypography-root': {
                    color: 'secondary.main',
                  },
                },
                // Nếu muốn màu chữ luôn là mặc định khi không hover
                '& .MuiTypography-root': {
                  color: 'text.primary',
                },
              }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2" fontWeight={600} color={selectedRole === role.id ? 'primary' : 'text.primary'}  >{role.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    - {role.description} 
                  </Typography>
                  {/* <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    {totalChecked} / {totalPermissions} quyền
                  </Typography> */}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        {isAdminRole ? (
          <Typography variant="body2" fontWeight={600} color="primary" sx={{ minWidth: 120, textAlign: 'center' }}>
            Toàn quyền
          </Typography>
        ) : (
          <>
            <Typography
              variant="body2"
              fontWeight={600}
              color="primary"
              sx={{ minWidth: 120, textAlign: 'center', cursor: sortCheckedFirst ? 'default' : 'pointer' }}
              onClick={() => {
                if (!sortCheckedFirst) setSortCheckedFirst(true);
              }}
            >
              {totalChecked} / {totalPermissions} quyền
            </Typography>
          </>
        )}
      </Box>
      <Button
          variant="contained"
          color="primary"
          disabled={isAdminRole || totalChecked === 0}  
          onClick={handleResetPermissions}
          sx={{ mb: 2 }}
        >
          Reset quyền
        </Button>
      <RenderSubject
        subjectsToRender={subjectsToRender}
        actionsBySubject={actionsBySubject}
        matrixBySubject={matrixBySubject}
        selectedRole={selectedRole}
        expandedSubjects={expandedSubjects}
        handleToggleSubject={handleToggleSubject}
        handleToggleAll={handleToggleAll}
        isAdminRole={isAdminRole}
        handleUpdatePermission={handleUpdatePermission}
      />
    </Box>
  );
}
