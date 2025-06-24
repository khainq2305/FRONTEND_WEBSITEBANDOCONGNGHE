// File: Description.jsx

import React from 'react';

export default function Description({ content }) {

  if (!content) {
    return null;
  }
  return (
    <>
    <div
      className="mt-10 prose lg:prose-lg max-w-none text-gray-800"
      dangerouslySetInnerHTML={{ __html: content }}
    />
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mt-6">
          <p className="font-semibold mb-1 text-black">Mua điện thoại chính hãng tại Điện thoại Giá Kho</p>
          <p>
            Hỗ trợ trả góp 0%, giao nhanh miễn phí, đổi trả 45 ngày và nhiều ưu đãi hấp dẫn khác.
            Liên hệ <strong className="text-red-600">1900 8922</strong> hoặc ghé showroom gần nhất tại TP.HCM!
          </p>
        </div>
     
    </>
  );
}