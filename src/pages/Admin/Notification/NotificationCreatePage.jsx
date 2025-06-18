// src/pages/Admin/Notification/NotificationCreatePage.jsx
import React from 'react';
import NotificationForm from './NotificationForm';
import { useNavigate } from 'react-router-dom';

const NotificationCreatePage = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/admin/notifications');
  };

  return (
    <div className=''>
      <NotificationForm onSuccess={handleSuccess} onCancel={() => navigate('/admin/notifications')} />
    </div>
  );
};

export default NotificationCreatePage;
