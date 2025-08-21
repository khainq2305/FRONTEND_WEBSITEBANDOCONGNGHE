// src/pages/Admin/Notification/NotificationEditPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NotificationForm from './NotificationForm';
import { notificationService } from '../../../services/admin/notificationService';

const NotificationEditPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await notificationService.getBySlug(slug);
        setEditing(res.data);
      } catch (err) {
        console.error('Không tìm thấy thông báo:', err);
        navigate('/admin/notifications');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, navigate]);

  if (loading) return <p className="p-6">Đang tải thông tin thông báo...</p>;

  return (
    <div>
      <NotificationForm
        editing={editing}
        onSuccess={() => navigate('/admin/notifications')}
        onCancel={() => navigate('/admin/notifications')}
      />
    </div>
  );
};

export default NotificationEditPage;
