import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ComboForm from './ComboForm';
import { comboService } from '@/services/admin/comboService';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

const ComboEditPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [combo, setCombo] = useState(null);

  useEffect(() => {
    comboService
      .getBySlug(slug)
      .then((res) => {
        const data = res.data;

        // ✅ Format ngày về đúng định dạng cho input datetime-local
        data.startAt = data.startAt ? dayjs(data.startAt).format('YYYY-MM-DDTHH:mm') : '';
        data.expiredAt = data.expiredAt ? dayjs(data.expiredAt).format('YYYY-MM-DDTHH:mm') : '';

        setCombo(data);
      })
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
      {/* <h2 className="text-xl font-semibold mb-4">Chỉnh sửa combo</h2> */}
      <ComboForm initialData={combo} isEdit={true} onSubmit={handleUpdate} />
    </div>
  );
};

export default ComboEditPage;
