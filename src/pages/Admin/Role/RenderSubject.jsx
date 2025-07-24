import React from 'react'
import { Box, Typography, Chip, Checkbox } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
const RenderSubject = (props) => {
  const {
    subjectsToRender, actionsBySubject, matrixBySubject, selectedRole,
    expandedSubjects, handleToggleSubject, handleToggleAll, isAdminRole, handleUpdatePermission
  } = props;

  const renderSubjects = subjectsToRender.map(subject => {
    const actions = actionsBySubject[subject.key] || [];
    const matrix = matrixBySubject[subject.key] || {};
    const allChecked = actions.length > 0 && actions.every(a => matrix[selectedRole]?.[a.action]);
    const someChecked = actions.some(a => matrix[selectedRole]?.[a.action]);
    const isOpen = !!expandedSubjects[subject.key];

    return (
      <Box key={subject.key} sx={{ mb: 3, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
        <Box display="flex" alignItems="center" mb={1} sx={{ cursor: 'pointer' }} onClick={() => handleToggleSubject(subject.key)}>
          {subject.icon && React.createElement(subject.icon, { style: { marginRight: 8 } })}
          <Typography variant="h6">{subject.label}</Typography>
          <Chip label={actions.length} size="small" sx={{ ml: 1 }} />
          <Checkbox
            checked={allChecked}
            disabled={isAdminRole}
            indeterminate={someChecked && !allChecked}
            onChange={e => { e.stopPropagation(); handleToggleAll(subject.key, e.target.checked); }}
            sx={{ ml: 'auto' }}
          />
          {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Box>
        {isOpen && (
          <Box display="flex" flexWrap="wrap" gap={2}>
            {actions.map(actionObj => (
              <Box key={actionObj.action} sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                minWidth: 220,
                gap: 1
              }}>
                <Checkbox
                  disabled={isAdminRole}
                  checked={isAdminRole ? true : !!matrix[selectedRole]?.[actionObj.action]}
                  onChange={e => handleUpdatePermission(selectedRole, subject.key, actionObj.action, e.target.checked)}
                  sx={{ marginRight: 2 }}
                />
                {actionObj.icon && React.createElement(actionObj.icon, { style: { marginRight: 4 } })}
                <Typography variant="body2" sx={{ flex: 1, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {actionObj.description || actionObj.action}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    );
  });

  return <>{renderSubjects}</>;
};

export default RenderSubject;