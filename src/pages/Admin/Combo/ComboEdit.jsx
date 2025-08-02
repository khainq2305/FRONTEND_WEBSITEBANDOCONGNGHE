// src/pages/Admin/Combo/ComboEditPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ComboForm from './ComboForm';
import { comboService } from '@/services/admin/comboService';
import { toast } from 'react-toastify';

const ComboEditPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [combo, setCombo] = useState(null);

  useEffect(() => {
    comboService
      .getBySlug(slug)
      .then((res) => setCombo(res.data))
      .catch(() => toast.error('Không tìm thấy combo'));
  }, [slug]);

  const handleUpdate = async (formData) => {
    try {
      await comboService.update(slug, formData);
      toast.success('Cập nhật combo thành công!');
      navigate('/admin/combos');
    } catch (error) {
      toast.error('Cập nhật combo thất bại!');
    }
  };

  if (!combo) return <div>Đang tải...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Chỉnh sửa combo</h2>
      <ComboForm initialData={combo} isEdit={true} onSubmit={handleUpdate} />{' '}
    </div>
  );
};

export default ComboEditPage;
