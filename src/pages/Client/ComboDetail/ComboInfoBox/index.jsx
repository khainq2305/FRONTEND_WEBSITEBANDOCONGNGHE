// ComboInfoBox.jsx
import React, { useMemo, useState } from 'react';

export default function ComboInfoBox({ skus = [] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Gom theo productId (fallback: hash nội dung)
  const groups = useMemo(() => {
    const map = new Map();
    for (const sku of skus) {
      const productId = sku.productId || sku.product?.id || null;
      const content = (sku.productInfo?.content || '').trim();
      const key = productId ? `p:${productId}` : `c:${content}`;
      const item = map.get(key) || {
        productName: sku.productName || sku.product?.name || 'Sản phẩm',
        content,
        variants: [],
      };
      item.variants.push({
        skuId: sku.skuId || sku.id,
        label: (sku.variantValues || [])
          .map((v) => `${v?.variantValue?.variant?.name}: ${v?.variantValue?.value}`)
          .join(' • ') || 'Biến thể mặc định',
      });
      // Ưu tiên giữ content có nội dung
      if (!item.content && content) item.content = content;
      map.set(key, item);
    }
    return Array.from(map.values());
  }, [skus]);

  if (!groups.length) return null;

  const collapsedCount = 1;
  const canExpand = groups.length > collapsedCount || (groups[0]?.content?.length > 1000);
  const itemsToShow = isExpanded ? groups : groups.slice(0, collapsedCount);

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm relative">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Mô tả chi tiết của các sản phẩm
      </h2>

      <div className={`${!isExpanded && canExpand ? 'max-h-[500px] overflow-hidden relative' : ''}`}>
        {itemsToShow.map((g, idx) => (
          <div key={idx} className="border-b border-gray-100 pb-4 last:border-none last:pb-0 mb-4">
            <div className="font-semibold mb-1">{g.productName}</div>

            <div
              className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: g.content || 'Không có mô tả.' }}
            />

            {/* Biến thể trong combo */}
            {!!g.variants.length && (
              <div className="mt-3">
                <div className="text-sm font-semibold mb-1">Biến thể trong combo</div>
                <div className="flex flex-wrap gap-1">
                  {g.variants.map((v) => (
                    <span key={v.skuId} className="text-xs bg-gray-100 rounded px-2 py-1">
                      {v.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {!isExpanded && canExpand && (
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        )}
      </div>

      {canExpand && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary text-sm font-medium hover:underline focus:outline-none"
          >
            {isExpanded ? 'Thu gọn' : 'Xem thêm nội dung'}
          </button>
        </div>
      )}
    </div>
  );
}
