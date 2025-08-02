import React, { useEffect, useState } from 'react';
import { Coins } from 'lucide-react';
import { rewardPointService } from '@/services/client/rewardPointService';
import Loader from '@/components/common/Loader';

const RewardPointSummary = () => {
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await rewardPointService.getTotalPoints(); // { totalPoints }
        setPoints(Number(data?.totalPoints) || 0);
      } catch (err) {
        console.error('Lỗi khi lấy điểm thưởng:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader />;

  /* ---------- giao diện giống ảnh ---------- */
  return (
<div
  className="
    flex justify-between items-center
    px-6 py-5 mb-8
    rounded-lg shadow border border-gray-200
    bg-gradient-to-r from-white to-[#EFF6FF]
    dark:bg-gray-800 dark:from-gray-800 dark:to-gray-700
  "
>


      {/* Trái: tiêu đề + điểm */}
      <div>
        <p className="text-sm text-gray-600 font-medium mb-1 dark:text-gray-300">
          Điểm thưởng của bạn
        </p>
        <p className="flex items-center gap-1 text-xl font-bold text-primary dark:text-yellow-400">
          {points.toLocaleString('vi-VN')}
       <span className="w-4 h-4 flex items-center justify-center rounded-full bg-yellow-200 text-yellow-600 text-[11px] font-semibold leading-none">
  ₵
</span>


        </p>
      </div>

      {/* Phải: banner minh hoạ (tuỳ ý đổi hình PNG/SVG) */}
 <div className="w-20 h-20 overflow-hidden rounded-md">
  <img
    src="https://png.pngtree.com/png-clipart/20240417/original/pngtree-earn-loyalty-program-points-get-online-reward-and-gifts-png-image_14873495.png"
    alt="Reward Banner"
    className="w-full h-full object-cover object-right-top"
    draggable={false}
  />
</div>

    </div>
  );
};

export default RewardPointSummary;
