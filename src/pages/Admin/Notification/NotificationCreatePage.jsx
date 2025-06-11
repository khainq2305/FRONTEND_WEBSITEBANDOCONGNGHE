// src/pages/Admin/Notification/NotificationCreatePage.jsx
import React from 'react';
import NotificationForm from './NotificationForm';
import { useNavigate } from 'react-router-dom';

const NotificationCreatePage = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/admin/notifications');
  };
//
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Thêm thông báo mới</h1>
      <NotificationForm onSuccess={handleSuccess} onCancel={() => navigate('/admin/notifications')} />
    </div>
  );
};

export default NotificationCreatePage;
