import React from 'react';
import DOMPurify from 'dompurify';

export default function ProductInfoBox({ productInfo }) {
  const raw = productInfo?.content?.trim();
  if (!raw) return null;

  const hasBlocks = /<(ul|ol|li|p|h[1-6]|div)/i.test(raw);
  const normalized = hasBlocks
    ? raw
    : `<ul>${raw
        .split(/\n+/)
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => `<li>${line}</li>`)
        .join('')}</ul>`;

  const html = DOMPurify.sanitize(normalized);

  return (
    <section className="product-info-box">
      <h2>{productInfo?.title || 'Thông tin sản phẩm'}</h2>
      <div
        className="product-info-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <style>{`
        .product-info-box {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          font-family: 'Be Vietnam Pro', sans-serif;
        }
        .product-info-box h2 {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 12px;
        }
        .product-info-content ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .product-info-content li {
          position: relative;
          padding-left: 22px;
          margin-bottom: 8px;
          line-height: 1.5;
          color: #374151;
        }
        .product-info-content li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 7px;
          width: 6px;
          height: 6px;
          background-color: #2563eb; /* xanh đẹp */
          border-radius: 50%;
        }
        .product-info-content p {
          margin-bottom: 8px;
        }
        .product-info-content strong {
          font-weight: 600;
        }
      `}</style>
    </section>
  );
}
