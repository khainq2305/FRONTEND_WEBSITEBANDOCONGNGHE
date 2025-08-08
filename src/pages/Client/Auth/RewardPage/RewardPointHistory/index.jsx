import React, { useEffect, useState } from 'react';
import { Coins } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { rewardPointService } from '@/services/client/rewardPointService';
import Loader from '@/components/common/Loader';
import MUIPagination from '@/components/common/Pagination';

const TABS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'earn', label: 'Đã tích điểm' },
  { key: 'spend', label: 'Đã sử dụng' }
];
const formatPoint = (value) => {
  return new Intl.NumberFormat('vi-VN').format(value);
};

export default function RewardPointHistory() {
const [history, setHistory] = useState([]);
const [page, setPage] = useState(1);
const [total, setTotal] = useState(0);
const limit = 10;
const [loading, setLoading] = useState(true);
const [active, setActive] = useState('all');

 useEffect(() => {
  (async () => {
    setLoading(true);
    try {
      const { data } = await rewardPointService.getHistory({ page, limit });
      setHistory(data?.history || []);
      setTotal(data?.total || 0);
    } catch (e) {
      console.error('Lỗi getPointHistory:', e);
    } finally {
      setLoading(false);
    }
  })();
}, [page]);


  if (loading) return <Loader />;

  const filtered = history.filter((h) => (active === 'all' ? true : active === 'earn' ? h.type === 'earn' : h.type === 'spend'));

  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-4">Lịch sử điểm thưởng</h2>

      <div className="flex border border-gray-200 bg-white rounded-t-md">
        {TABS.map((t, index) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`flex-1 text-center py-3 text-sm font-medium relative
        ${active === t.key ? 'text-[#1CA7EC] font-semibold' : 'text-gray-500'}
        ${index > 0 ? '' : ''}
        after:absolute after:left-0 after:right-0 after:-bottom-[1px] after:h-[2px]
        ${active === t.key ? 'after:bg-[#1CA7EC]' : 'after:bg-transparent'}
      `}
          >
            {t.label.toUpperCase()}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500">Không có giao dịch.</p>
      ) : (
        <ul className="divide-y divide-gray-200 border-x border-b border-gray-200 rounded-b-md">
          {filtered.map((item) => (
            <li key={item.id} className="flex justify-between items-center px-4 py-3 bg-white">
              <div className="pr-4 flex items-center gap-2">
                <img
                  src={item.type === 'expired' ? 'src/assets/Client/images/xubacchotso.png' : 'src/assets/Client/images/xuhethan.png'}
                  alt="icon"
                  className={`w-20 h-20 mr-2 mt-0.5 rounded 
    ${item.type !== 'expired' ? 'bg-primary p-1' : ''}
  `}
                />

                <div>
                  <p className="font-semibold mb-1">
                    {item.type === 'earn' ? 'Mua hàng tích điểm' : item.type === 'expired' ? 'Điểm bị hết hạn' : 'Sử dụng điểm'}
                  </p>

                  <p className="text-xs text-gray-500 mb-1">
                    vào lúc {format(new Date(item.createdAt), 'HH:mm, dd/MM/yyyy', { locale: vi })} tại CYBERZONE Shop
                  </p>

                  {item.note && <div className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: item.note }} />}

                  {item.orderCode && item.type !== 'expired' && (
                    <p className="text-sm mt-1 text-gray-700">
                      Đơn hàng: <span className="font-medium">{item.orderCode}</span>{' '}
                      <a href={`/user-profile/orders/${item.orderCode}`} className="text-blue-600 hover:underline text-sm">
                        Xem chi tiết
                      </a>
                    </p>
                  )}

                  {item.expiredAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      Điểm thưởng sẽ hết hạn vào ngày: {format(new Date(item.expiredAt), 'dd/MM/yyyy', { locale: vi })}
                    </p>
                  )}
                </div>
              </div>

              <span
                className={`shrink-0 flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full
    ${item.type === 'earn' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
              >
                {item.type === 'earn' ? `+${formatPoint(item.points)}` : `-${formatPoint(item.points)}`}

                <img src="src/assets/Client/images/xudiem.png" alt="coin" className="w-3 h-3 object-contain" />
              </span>
            </li>
          ))}
        </ul>
        
      )}
      {total > limit && (
  <MUIPagination
    currentPage={page}
    totalItems={total}
    itemsPerPage={limit}
    onPageChange={(newPage) => setPage(newPage)}
  />
)}

    </section>
  );
}
