import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { rewardPointService } from '@/services/client/rewardPointService';
import MUIPagination from '@/components/common/Pagination';
import xuBacCho from '@/assets/Client/images/xubacchotso.png';
import xuHetHan from '@/assets/Client/images/xuhethan.png';
import xuDiem from '@/assets/Client/images/xudiem.png';

const TABS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'earn', label: 'Đã tích điểm' },
  { key: 'spend', label: 'Đã sử dụng' }
];
const TYPE_LABELS = {
  earn: "Mua hàng tích điểm",
  spend: "Sử dụng điểm",
  expired: "Điểm bị hết hạn",
  refund: "Điều chỉnh điểm do đơn hàng"
};


const formatPoint = (value) => new Intl.NumberFormat('vi-VN').format(value);

export default function RewardPointHistory({ onLoadingChange, onCancelSuccess }) {
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState('all');

useEffect(() => {
  (async () => {
    setLoading(true);
    onLoadingChange?.(true);
    try {
      const { data } = await rewardPointService.getHistory({
        page,
        limit,
        type: active === "all" ? undefined : active,
      });
      setHistory(data?.history || []);
      setTotal(data?.total || 0);
    } catch (e) {
      console.error("Lỗi getPointHistory:", e);
    } finally {
      setLoading(false);
      onLoadingChange?.(false);
    }
  })();
}, [page, active, onLoadingChange]);


 const cancelOrder = async (orderId) => {
  try {
    await rewardPointService.cancelOrder(orderId);
    onCancelSuccess?.();

    // 👇 Thêm dòng này để báo cho RewardPointContext refetch điểm
    window.dispatchEvent(new Event("pointsUpdated"));
  } catch (err) {
    console.error("Lỗi khi hủy đơn:", err);
  }
};


  const filtered = history.filter((h) =>
    active === 'all' ? true : active === 'earn' ? h.type === 'earn' : h.type === 'spend'
  );

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
              after:absolute after:left-0 after:right-0 after:-bottom-[1px] after:h-[2px]
              ${active === t.key ? 'after:bg-[#1CA7EC]' : 'after:bg-transparent'}
            `}
          >
            {t.label.toUpperCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <ul className="divide-y divide-gray-200 border-x border-b border-gray-200 rounded-b-md">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="px-4 py-3 bg-white animate-pulse">
              <div className="flex items-center gap-2">
                <div className="w-20 h-20 mr-2 rounded bg-gray-200" />
                <div className="flex-1">
                  <div className="h-4 w-48 bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-64 bg-gray-100 rounded mb-1.5" />
                  <div className="h-3 w-40 bg-gray-100 rounded" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : filtered.length === 0 ? (
        <div className="border-x border-b border-gray-200 rounded-b-md bg-white">
          <div className="py-10 flex items-center justify-center text-gray-500">Không có giao dịch.</div>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200 border-x border-b border-gray-200 rounded-b-md">
          {filtered.map((item) => (
            <li key={item.id} className="flex justify-between items-center px-4 py-3 bg-white">
              <div className="pr-4 flex items-center gap-2">
                <img
                  src={item.type === 'expired' ? xuBacCho : xuHetHan}
                  alt="icon"
                  className={`w-20 h-20 mr-2 mt-0.5 rounded ${item.type !== 'expired' ? 'bg-primary p-1' : ''}`}
                />

                <div>
<p className="font-semibold mb-1">
  {item.type === "refund"
  ? item.description?.includes("Thu hồi")
    ? "Thu hồi điểm thưởng do hủy đơn"
    : "Hoàn lại điểm do hủy đơn"
  : TYPE_LABELS[item.type] || "Giao dịch khác"}

</p>



                  <p className="text-xs text-gray-500 mb-1">
                    vào lúc {format(new Date(item.createdAt), 'HH:mm, dd/MM/yyyy', { locale: vi })} tại CYBERZONE Shop
                  </p>

                  {item.note && (
                    <div
                      className="text-sm text-gray-700"
                      dangerouslySetInnerHTML={{ __html: item.note }}
                    />
                  )}

                 {item.orderCode && (
  <p className="text-sm mt-1 text-gray-700">
    Đơn hàng: <span className="font-medium">{item.orderCode}</span>{' '}
    <a
      href={`/user-profile/orders/${item.orderCode}`}
      className="text-blue-600 hover:underline text-sm"
    >
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
    ${item.points > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
>
  {item.points > 0 
    ? `+${formatPoint(item.points)}` 
    : `-${formatPoint(Math.abs(item.points))}`}
  <img src={xuDiem} alt="coin" className="w-3 h-3 object-contain" />
</span>


            </li>
          ))}
        </ul>
      )}

      {!loading && Math.ceil(total / limit) > 1 && (
  <MUIPagination
    currentPage={page}
    totalItems={total}        // dùng tổng từ API
    itemsPerPage={limit}
    onPageChange={setPage}
  />
)}

    </section>
  );
}
