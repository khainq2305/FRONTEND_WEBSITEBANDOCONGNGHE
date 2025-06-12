// File: Description.jsx

import React from 'react';

export default function Description({ content }) {
  // Nếu không có content hoặc content là một chuỗi rỗng thì không hiển thị gì cả.
  if (!content) {
    return null;
  }

  // Sử dụng một plugin của Tailwind để tự động style cho nội dung HTML
  // Class `prose` sẽ tự động định dạng các thẻ h2, p, ul, li... một cách đẹp mắt.
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