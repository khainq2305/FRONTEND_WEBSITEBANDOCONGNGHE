import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CategoryMain from '../../CaterogyProduct';
import { toast } from 'react-toastify';
import { categoryService } from '../../../../services/admin/categoryService';
import { Typography } from '@mui/material';
import LoaderAdmin from '../../../../components/Admin/LoaderVip';
import Breadcrumb from '../../../../components/common/Breadcrumb';

const CategoryEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await categoryService.getById(id);
                if (!res || !res.data || !res.data.id) {
                    throw new Error('Không tìm thấy');
                }
                setInitialData(res.data);
            } catch (error) {
                toast.error('Không tìm thấy danh mục!');
                navigate('/admin/categories/list');
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, [id, navigate]);

    const handleSubmit = async (data) => {
        try {
            const form = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (key === 'thumbnail' && typeof value === 'string') return;
                if (value !== null && value !== '') {
                    form.append(key, value);
                }
            });

            await categoryService.update(id, form);
            toast.success('Cập nhật danh mục thành công');
            navigate('/admin/categories/list');
        } catch (error) {
            const res = error.response;
            if (res?.status === 400 && res.data?.field && res.data?.message) {
                setErrors({ [res.data.field]: res.data.message });
            } else {
                toast.error('Lỗi khi cập nhật danh mục');
                console.error(error);
            }
        }
    };


   if (loading) return <LoaderAdmin fullscreen />;


  return initialData ? (
    <>
      <Breadcrumb
        items={[
          { label: 'Trang chủ', href: '/admin' },
          { label: 'Danh mục', href: '/admin/categories/list' },
          { label: 'Chỉnh sửa' },
        ]}
      />
      <CategoryMain initialData={initialData} onSubmit={handleSubmit} externalErrors={errors} />
    </>
  ) : null;
};

export default CategoryEdit;
