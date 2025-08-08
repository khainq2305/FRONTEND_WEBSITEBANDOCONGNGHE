import React, { useEffect, useState } from 'react';
import { rewardPointService } from '@/services/client/rewardPointService';
import Loader from '@/components/common/Loader';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const RewardPointSummary = () => {
  const [points, setPoints] = useState(0);
  const [expiringSoon, setExpiringSoon] = useState(0);
  const [expireDate, setExpireDate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await rewardPointService.getTotalPoints();
        setPoints(Number(data?.totalPoints) || 0);
        setExpiringSoon(Number(data?.expiringSoon) || 0);
        setExpireDate(data?.expireDate || null);
      } catch (err) {
        console.error('Lỗi khi lấy điểm thưởng:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="flex items-center justify-between bg-white border border-yellow-300 rounded-xl shadow-sm p-5 mb-5">

      <div className="flex items-center gap-4">
        <div className="w-25 h-25 bg-yellow-100 rounded-full flex items-center justify-center animate-[pulse_1.2s_ease-in-out_infinite]">
          <img
            src="src/assets/Client/images/xudiem.png"
            alt="coin"
            className="w-18 h-18 object-contain"
          />
        </div>

        <div>
          <div className="text-gray-700 text-sm font-medium">Tổng điểm thưởng</div>
          <div className="text-2xl font-bold text-yellow-500 mt-1">
            {points.toLocaleString('vi-VN')}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {expireDate
              ? `${expiringSoon.toLocaleString('vi-VN')} ₵ sẽ hết hạn vào ${format(new Date(expireDate), 'dd-MM-yyyy', { locale: vi })}`
              : 'Không có điểm sắp hết hạn'}
          </div>
        </div>
      </div>


      <div className="w-30 object-center h-24 rounded-xl overflow-hidden shrink-0">
        <img
          src="src/assets/Client/images/NENDIEM.png"
          alt="Reward Banner"
          className="w-full h-full object-cover object-center"
          draggable={false}
        />
      </div>
    </div>
  );
};

export default RewardPointSummary;
