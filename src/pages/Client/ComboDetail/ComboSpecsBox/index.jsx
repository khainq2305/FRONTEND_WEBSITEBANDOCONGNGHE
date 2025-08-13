import React, { useMemo } from "react";

export default function ComboSpecsBox({ skus = [] }) {
  if (!skus.length) return null;

  // Gom SKU theo sản phẩm gốc
  const products = useMemo(() => {
    const map = new Map();
    for (const sku of skus) {
      const productId = sku.productId || sku?.product?.id || sku.productName || "NA";
      const name = sku.productName || sku?.product?.name || "Sản phẩm";
      const bucket = map.get(productId) || { name, items: [] };
      bucket.items.push(sku);
      map.set(productId, bucket);
    }
    return Array.from(map.values());
  }, [skus]);

  // Tách thông số thành 2 nhóm: chung (common) và khác nhau theo biến thể (variant)
  const splitSpecs = (itemSkus) => {
    // groups: groupTitle -> specKey -> Set(values)
    const groups = new Map();

    for (const s of itemSkus) {
      const specs = s.specifications || [];
      for (const spec of specs) {
        const g = spec.specGroup || "Thông số khác";
        const gMap = groups.get(g) || new Map();
        const key = spec.specKey;
        const set = gMap.get(key) || new Set();
        set.add(String(spec.specValue ?? "—"));
        gMap.set(key, set);
        groups.set(g, gMap);
      }
    }

    const common = [];
    const variant = [];
    for (const [groupTitle, gMap] of groups.entries()) {
      const commonRows = [];
      const variantRows = [];
      for (const [key, values] of gMap.entries()) {
        const arr = Array.from(values);
        if (arr.length === 1) commonRows.push([key, arr[0]]);
        else variantRows.push([key, arr.join(", ")]);
      }
      if (commonRows.length) common.push({ title: groupTitle, data: commonRows });
      if (variantRows.length) variant.push({ title: groupTitle, data: variantRows });
    }

    return { common, variant };
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm text-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Thông số kỹ thuật</h2>

      <div className="space-y-8">
        {products.map((p, idx) => {
          const { common, variant } = splitSpecs(p.items);
          if (!common.length && !variant.length) return null;

          return (
            <div key={idx} className="border border-gray-100 rounded-md shadow-sm p-4">
              {/* Tiêu đề dùng tên sản phẩm, KHÔNG đánh số 1/2/3 */}
              <h3 className="text-base font-semibold text-gray-800 mb-3">
                {p.name}
              </h3>

              {/* Thông số chung giữa các biến thể */}
              {!!common.length && (
                <div className="space-y-4">
                  {common.map((section, i) => (
                    <div key={i}>
                      <h4 className="font-semibold text-sm text-gray-700 bg-gray-100 rounded px-3 py-2">
                        {section.title}
                      </h4>
                      <div className="mt-2 space-y-2 text-xs">
                        {section.data.map(([label, value], j) => (
                          <div key={j} className="flex justify-between items-start">
                            <span className="text-gray-600 w-2/5">{label}</span>
                            <span className="text-right font-medium text-gray-800 w-3/5">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Những thông số khác nhau giữa các biến thể */}
              {!!variant.length && (
                <div className="mt-4">
                  <div className="text-sm font-semibold mb-2">Khác nhau theo biến thể</div>
                  {variant.map((section, i) => (
                    <div key={i} className="mb-3">
                      <div className="text-xs font-medium text-gray-700">{section.title}</div>
                      <div className="mt-1 space-y-1 text-xs">
                        {section.data.map(([label, multi], j) => (
                          <div key={j} className="flex justify-between items-start">
                            <span className="text-gray-600 w-2/5">{label}</span>
                            <span className="text-right text-gray-800 w-3/5">
                              {multi}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
