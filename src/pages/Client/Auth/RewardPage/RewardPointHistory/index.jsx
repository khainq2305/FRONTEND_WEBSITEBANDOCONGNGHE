import React, { useEffect, useState } from 'react';
import { Coins } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { rewardPointService } from '@/services/client/rewardPointService';
import Loader from '@/components/common/Loader';

/* -------------------------------------------------- */
/* Tabs + list                                        */
/* -------------------------------------------------- */
const TABS = [
  { key: 'all',   label: 'Tất cả'     },
  { key: 'earn',  label: 'Đã tích điểm' },
  { key: 'spend', label: 'Đã sử dụng'  },
];

export default function RewardPointHistory() {
  const [history, setHistory]   = useState([]);
  const [active,  setActive]    = useState('all');
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await rewardPointService.getHistory({ page: 1, limit: 10 });
        setHistory(data?.history || []);
      } catch (e) {
        console.error('Lỗi getPointHistory:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader />;

  const filtered = history.filter((h) =>
    active === 'all' ? true : active === 'earn' ? h.type === 'earn' : h.type === 'spend'
  );

  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-4">Lịch sử điểm thưởng</h2>

      {/* ---------- Tabs ---------- */}
      <div className="flex border-b mb-3">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`
              relative flex-1 text-center py-3 text-sm font-medium
              ${active === t.key ? 'text-red-600' : 'text-gray-500'}
              after:absolute after:left-0 after:right-0 after:-bottom-[1px] after:h-[2px]
              ${active === t.key ? 'after:bg-red-600' : 'after:bg-transparent'}
            `}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ---------- List ---------- */}
      {filtered.length === 0 ? (
        <p className="text-gray-500">Không có giao dịch.</p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-start bg-white rounded-xl border shadow px-4 py-3"
            >
              <div>
                <p className="font-semibold mb-1">
                  {item.type === 'earn' ? 'Mua hàng tích điểm' : 'Sử dụng điểm'}
                </p>
                <p className="text-xs text-gray-500 mb-1">
                  vào lúc {format(new Date(item.createdAt), 'HH:mm, dd/MM/yyyy', { locale: vi })}{' '}
                  tại FPT Shop
                </p>

                {item.note && (
                  <p className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: item.note }} />
                )}

                {item.expiredAt && (
                  <p className="text-xs text-gray-500 mt-1">
                    Điểm thưởng sẽ hết hạn vào ngày:{' '}
                    {format(new Date(item.expiredAt), 'dd/MM/yyyy', { locale: vi })}
                  </p>
                )}
              </div>

              {/* Badge points */}
              <span
                className={`
                  shrink-0 flex items-center gap-0.5 text-sm font-semibold px-2 py-0.5 rounded-full
                  ${item.type === 'earn' ? 'bg-green-50 text-green-600' : 'bg-rose-50 text-rose-600'}
                `}
              >
                {item.type === 'earn' ? '+' : '-'}
                {item.points}
                <Coins size={12} className="text-yellow-500" />
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
