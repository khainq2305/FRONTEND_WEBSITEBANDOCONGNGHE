import React from 'react';
import img3 from '../../../../assets/Client/images/News/mua-truoc-tra-sau-3.jpg';

const SibarTop = () => {
  return (
    <div className="space-y-4 px-0 md:pl-4">
      {/* Thanh tiêu đề khuyến mãi */}
      <div className="bg-primary text-white px-4 py-2 font-bold text-justify rounded">TIN KHUYẾN MÃI</div>
      <div className=''>
        <div className=''>
            <img src="" alt="" />
        </div>
      </div>
      {[1, 2, 3].map((_, idx) => (
        <div key={idx}>
          <img
            src={img3}
            alt={`Promo ${idx + 1}`}
            className="w-full h-auto rounded"
          />
        </div>
      ))}
    </div>
  );
};

export default SibarTop;
