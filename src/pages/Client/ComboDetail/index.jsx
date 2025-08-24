import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import ComboImageSection from './ComboImageSection';
import ComboActionBox from './ComboActionBox';
import ComboInfoBox from './ComboInfoBox';
import ComboSpecsBox from './ComboSpecsBox';
import ComboReviewSection from './ComboReviewSection';
import ComboQA from './ComboQA';

import { comboServiceClient } from '@/services/client/comboService';
import Loader from '@/components/common/Loader';

const Breadcrumb = ({ comboName }) => (
  <div className="text-sm text-gray-500">
  <div className="max-w-[1200px] mx-auto py-2 flex items-center gap-2">
      <Link to="/" className="hover:text-primary">
        Trang chủ
      </Link>
      <span>/</span>
      <span className="text-gray-700 font-medium">{comboName}</span>
    </div>
  </div>
);

const ComboDescription = ({ description }) => {
  if (!description) return null;

  const isHtml = /<\/?[a-z][\s\S]*>/i.test(description.trim());
  const safeDescription = isHtml ? description : `<p>${description.trim()}</p>`;

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Mô tả chi tiết combo</h2>
      <div
        className="text-sm text-gray-700 leading-relaxed break-all whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: safeDescription }}
      />
    </div>
  );
};

export default function ComboDetail() {
  const { slug } = useParams();
  console.count('[ComboDetail] render'); // <-- LOG #1
  console.log('[ComboDetail] file:', import.meta.url); // <-- LOG #2
  const [combo, setCombo] = useState(null);
  const [loading, setLoading] = useState(true);

  const [mainImage, setMainImage] = useState('');
  const [allImages, setAllImages] = useState([]);

  useEffect(() => {
    console.log('[ComboDetail] useEffect start, slug =', slug);

    const fetchCombo = async () => {
      try {
        console.log('[ComboDetail] fetch start');
        const { data } = await comboServiceClient.getBySlug(slug);
        console.log('[ComboDetail] API OK');

        // Lưu toàn bộ combo để dùng tiếp
        setCombo(data);

        // DEBUG: xem BE trả gì cho từng SKU
        console.table(
          (data.comboSkus || []).map((cs) => ({
            skuId: cs.skuId,
            productName: cs.productName,
            thumb_from_BE: cs.thumbnail, // phải là ảnh ĐỎ nếu sku.thumbnail có dữ liệu
            variants: (cs.variantValues || []).map((v) => `${v.variantName}:${v.value}`).join(' • ')
          }))
        );

        // Ảnh chính của combo (không hiện chữ)
        const thumbnail = data.thumbnail || '';
        setMainImage(thumbnail);

        // Build danh sách ảnh SKU + nhãn "Tên SP - Biến thể"
        const skuImages = (data.comboSkus || [])
          .map((cs) => {
            // Ưu tiên ảnh SKU, fallback product (nếu BE có thêm 2 trường này)
            const imgUrl = cs.skuThumbnail || cs.thumbnail || cs.productThumbnail;
            if (!imgUrl) return null;

            const baseName = cs.productName || '';

            // Ghép biến thể từ schema mới { variantName, value }
            const variantLabel = (cs.variantValues || [])
              .map((v) => (v?.variantName && v?.value ? `${v.variantName}: ${v.value}` : null))
              .filter(Boolean)
              .join(' • ');

            const label = [baseName, variantLabel].filter(Boolean).join(' - ');

            // DEBUG: xác nhận URL ảnh dùng cho slider
            console.log('[ComboDetail] skuImage ->', cs.skuId, imgUrl, label);

            return {
              imageFull: imgUrl,
              label,
              isMain: false
            };
          })
          .filter(Boolean);

        setAllImages([
          { imageFull: thumbnail, label: '', isMain: true }, // Ảnh chính: không hiện chữ
          ...skuImages
        ]);
      } catch (err) {
        console.error('[ComboDetail] API ERROR:', err);
        toast.error('Không thể tải combo!');
      } finally {
        setLoading(false);
      }
    };

    fetchCombo();
  }, [slug]);

  if (loading || !combo) return <Loader fullscreen />;

  return (
    <div className="bg-gray-100 min-h-screen">
      <Breadcrumb comboName={combo.name} />

      <div className="max-w-[1200px] mx-auto py-4 px-4 md:px-0">
        {/* Cột trái: Ảnh + thông tin mua */}
        <div className="grid grid-cols-1 xl:grid-cols-[3fr_2fr] gap-4 items-start mb-4">
          <ComboImageSection
            comboId={combo.id}
            comboName={combo.name}
            mainImage={mainImage}
            setMainImage={setMainImage}
            allImages={allImages}
            productImages={(combo.comboSkus || []).map((cs) => cs.thumbnail).filter(Boolean)}
          />

          <div className="xl:sticky xl:top-16 xl:h-fit">
            <ComboActionBox combo={combo} />
          </div>
        </div>

        {/* Cột trái: mô tả, mô tả sản phẩm | Cột phải: thông số kỹ thuật */}
        <div className="grid grid-cols-1 xl:grid-cols-[3fr_2fr] gap-4 items-start mb-6">
          <div className="space-y-4">
            <ComboDescription description={combo.description} />

            <ComboInfoBox
              skus={(combo.comboSkus ?? []).map((sku, index) => ({
                id: sku.skuId ?? index,
                productId: sku.productId ?? sku.product?.id ?? null, // nếu có
                productName: sku.productName ?? `Sản phẩm ${index + 1}`, // QUAN TRỌNG
                productInfo: { content: sku.description || '' },
                variantValues: sku.variantValues ?? [] // đưa qua để hiển thị biến thể
              }))}
            />
          </div>

          <div className="xl:sticky xl:top-16 xl:h-fit">
            <ComboSpecsBox
              skus={combo.comboSkus.map((sku, index) => ({
                skuId: sku.skuId || index,
                productName: sku.productName || `Sản phẩm ${index + 1}`,
                specifications: sku.specifications || []
              }))}
            />
          </div>
        </div>
        <div className="mt-8">
          {' '}
          <ComboReviewSection comboName={combo.name} comboSkus={combo.comboSkus || []} />
        </div>
        <div className="mt-8">
          {' '}
          <ComboQA comboName={combo.name} comboSkus={combo.comboSkus ?? []} />
        </div>
      </div>
    </div>
  );
}
