import React, { useEffect, useState } from 'react';
import { membershipService } from '@/services/client/membershipService';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import Loader from '@/components/common/Loader';

const MembershipInfo = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await membershipService.getMyMembershipInfo();
        setData(res);
      } catch (err) {
        console.error('Lỗi lấy thông tin hội viên:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader />;
  if (!data) return <div>Không có thông tin hội viên.</div>;

 const current = data.currentTier ?? data.allTiers?.[0] ?? {};

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md border border-gray-200 dark:border-gray-700 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Thông tin hội viên</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <Item label="Hạng hiện tại" value={current.name || 'Chưa có'} />
        <Item label="Điểm thưởng" value={data.totalPoints || 0} />
        <Item
          label="Ưu đãi giảm giá"
          value={
            current.discountPercent !== undefined && current.discountPercent > 0
              ? `${current.discountPercent}%`
              : 'Không có'
          }
        />
        <Item label="Tổng chi tiêu" value={formatCurrency(data.totalSpent)} />
        <Item label="Tổng đơn hàng" value={data.totalOrders || 0} />
        <Item label="Ngày lên hạng" value={data.tierGrantedAt ? formatDate(data.tierGrantedAt) : '---'} />
        <Item label="Ngày hết hạn" value={data.tierExpireAt ? formatDate(data.tierExpireAt) : '---'} />
      </div>
    </div>
  );
};

const Item = ({ label, value }) => (
  <div className="flex justify-between items-center text-gray-700 dark:text-gray-300">
    <span className="font-medium">{label}</span>
    <span>{value}</span>
  </div>
);

const formatDate = (dateStr) => format(new Date(dateStr), 'dd/MM/yyyy', { locale: vi });

const formatCurrency = (value) =>
  value?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

export default MembershipInfo;
