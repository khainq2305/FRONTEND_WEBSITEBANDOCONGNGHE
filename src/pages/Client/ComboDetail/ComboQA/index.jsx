// src/pages/Client/ComboDetail/ComboQA/index.jsx
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import ProductQA from "../../ProductDetail/ProductQA"; // path bạn vừa xác nhận OK
import { productQuestionService } from "@/services/client/productQuestionService"; // nếu không có alias @ => đổi sang ../../../../services/client/productQuestionService

export default function ComboQA({ comboName, comboSkus = [] }) {
  // Xây danh sách sản phẩm trong combo (unique theo productId)
  const products = useMemo(() => {
    const raw = (comboSkus ?? [])
      .map((cs, i) => {
        const pid =
          cs?.productId ??
          cs?.product?.id ??
          cs?.sku?.productId ??
          null;

        if (!pid) return null;

        const pname =
          cs?.productName ??
          cs?.product?.name ??
          cs?.sku?.product?.name ??
          "Sản phẩm";

        // ghép biến thể nếu có (đỡ null-safe cho 2 kiểu dữ liệu)
        const variants =
          Array.isArray(cs?.variantValues) && cs.variantValues.length
            ? " - " +
              cs.variantValues
                .map((v) => {
                  const name = v?.variantName ?? v?.variantValue?.variant?.name;
                  const val = v?.value ?? v?.variantValue?.value;
                  return name && val ? `${name}: ${val}` : null;
                })
                .filter(Boolean)
                .join(" • ")
            : "";

        return {
          key: cs?.skuId ?? i,
          productId: Number(pid),
          label: `${pname}${variants}`,
        };
      })
      .filter(Boolean);

    // Dedupe theo productId (một sản phẩm có nhiều SKU chỉ hiện 1 dòng)
    const seen = new Set();
    const uniq = raw.filter((p) => {
      if (seen.has(p.productId)) return false;
      seen.add(p.productId);
      return true;
    });

    // Debug nhẹ khi DEV
    if (import.meta?.env?.DEV) {
      // eslint-disable-next-line no-console
      console.log("[ComboQA] comboSkus:", comboSkus, "products:", uniq);
    }
    return uniq;
  }, [comboSkus]);

  const [selectedProductId, setSelectedProductId] = useState(
    products[0]?.productId || null
  );

  // Khi products đổi (fetch combo xong), set lại selected nếu cần
  useEffect(() => {
    if (
      products.length &&
      !products.find((p) => p.productId === selectedProductId)
    ) {
      setSelectedProductId(products[0].productId);
    }
  }, [products]); // eslint-disable-line react-hooks/exhaustive-deps

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);

  // Tải Q&A theo productId đang chọn
  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!selectedProductId) {
        setQuestions([]);
        return;
      }
      setLoading(true);
      try {
        const res = await productQuestionService.getByProductId(
          selectedProductId
        );
        if (cancelled) return;
        const data = res?.data?.data ?? res?.data ?? [];
        setQuestions(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) {
          console.error(e);
          toast.error("Không tải được Hỏi & Đáp cho sản phẩm này");
          setQuestions([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [selectedProductId]);

  const selectedLabel =
    products.find((p) => p.productId === selectedProductId)?.label || "";

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Hỏi & Đáp cho <span className="text-primary">{comboName}</span>
        </h2>

        {/* Dropdown chọn sản phẩm (giới hạn width + ellipsis) */}
        <div className="flex items-center gap-2 min-w-0">
          {products.length > 1 ? (
            <div className="min-w-0 w-[320px] sm:w-[420px] lg:w-[520px]">
              <select
                className="w-full border rounded-lg px-3 py-2 text-sm truncate"
                title={selectedLabel}
                value={selectedProductId || ""}
                onChange={(e) => setSelectedProductId(Number(e.target.value))}
                disabled={loading}
              >
                {products.map((p) => (
                  <option key={p.key} value={p.productId}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            // Nếu chỉ có 1 sản phẩm → hiển thị text để biết đang hỏi cho sp nào
            <div className="text-sm text-gray-600 truncate max-w-[520px]">
              {selectedLabel || "Chưa nhận diện được sản phẩm trong combo"}
            </div>
          )}
        </div>
      </div>

      {/* Reuse ProductQA: remount khi đổi sản phẩm để reset state bên trong */}
      <ProductQA
        key={selectedProductId || "empty"}
        productId={selectedProductId}
        initialQuestions={questions}   // nếu ProductQA dùng initial data
        questions={questions}          // hoặc dùng trực tiếp
        onQuestionsUpdate={setQuestions}
        loading={loading}
      />
    </div>
  );
}
