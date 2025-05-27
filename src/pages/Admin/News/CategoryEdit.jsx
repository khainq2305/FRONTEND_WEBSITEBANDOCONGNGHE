import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CategoryMain from '@/pages/Admin/News/components/form/CategoryMain';
import { newsCategoryService } from '@/services/admin/newCategoryService';
import { toast } from 'react-toastify';

const CategoryEdit = () => {
    console.log('đã vào tới edit category')
  const { slug } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await newsCategoryService.getBySlug(slug);
        setInitialData(res.data.data);
        console.log(res.data.data)
      } catch (error) {
        toast.error('Không tìm thấy danh mục');
        // navigate('/admin/quan-ly-danh-muc');
      }
    };

    if (slug) fetchCategory();
  }, [slug, navigate]);

  const handleSubmit = async (data) => {
    const payload = {
      ...initialData,  // giữ lại slug, id
      ...data          // ghi đè các field mới
    };

    try {
      await newsCategoryService.update(slug, payload);
      toast.success('Cập nhật danh mục thành công');
      navigate('/admin/danh-muc-bai-viet');
    } catch (err) {
        toast.error(err.response.data.message || 'Có lỗi xảy ra');
    }
  };

  return (
    <div>
      {initialData && (
        <CategoryMain initialData={initialData} onSubmit={handleSubmit} mode="edit" />
      )}
    </div>
  );
};

export default CategoryEdit;
