import React from 'react';
import { Button } from '@mui/material';
import useButtonStore from '@/stores/buttonStore';

const PermissionButton = ({ 
  action, 
  subject, 
  permissions = [], // Cho trường hợp cần check nhiều quyền
  logic = 'AND', // 'AND' hoặc 'OR'
  disabled,
  children,
  onClick,
  tooltip = '',
  ...buttonProps 
}) => {
  const { canPerformAction, canPerformMultipleActions, canPerformAnyAction } = useButtonStore();

  // Kiểm tra quyền
  let hasPermission = false;
  
  if (permissions.length > 0) {
    // Check nhiều quyền
    if (logic === 'AND') {
      hasPermission = canPerformMultipleActions(permissions);
    } else {
      hasPermission = canPerformAnyAction(permissions);
    }
  } else {
    // Check một quyền
    hasPermission = canPerformAction(action, subject);
  }

  // Button bị disable nếu không có quyền hoặc disabled prop
  const isDisabled = !hasPermission || disabled;

  const handleClick = (e) => {
    if (!isDisabled && onClick) {
      onClick(e);
    }
  };

  return (
    <Button
      {...buttonProps}
      disabled={isDisabled}
      onClick={handleClick}
      title={!hasPermission ? tooltip || 'Bạn không có quyền thực hiện hành động này' : tooltip}
    >
      {children}
    </Button>
  );
};

export default PermissionButton; 