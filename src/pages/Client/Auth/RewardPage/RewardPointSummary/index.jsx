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
        bg-gradient-to-r from-red-50 to-amber-50
        dark:bg-gray-800 dark:from-gray-800 dark:to-gray-700
      "
    >
      {/* Trái: tiêu đề + điểm */}
      <div>
        <p className="text-sm text-gray-600 font-medium mb-1 dark:text-gray-300">
          Điểm thưởng của bạn
        </p>
        <p className="flex items-center gap-1 text-3xl font-bold text-red-600 dark:text-yellow-400">
          {points.toLocaleString('vi-VN')}
          <Coins size={26} className="text-yellow-500" />
        </p>
      </div>

      {/* Phải: banner minh hoạ (tuỳ ý đổi hình PNG/SVG) */}
      <img
        src="/reward-banner.png"           /* <-- để banner tên gì cũng được, nhớ đặt đúng path public */
        alt="Reward Banner"
        className="w-40 md:w-56 select-none pointer-events-none"
        draggable={false}
      />
    </div>
  );
};

export default RewardPointSummary;
