import React from 'react'
import img3 from '../../../../assets/Client/images/News/mua-truoc-tra-sau-3.jpg';

const Sibar = ({title}) => {
  return (
    <div className="space-y-4 px-0 md:px-4 lg:px-0">
      {/* Thanh tiêu đề khuyến mãi */}
      <div className="pb-1 relative">
      <div className="font-bold text-justify uppercase">{title}</div>
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-yellow-400 to-gray-300"></div>
    </div>
      <div className=''>
        <div className=''>
            <img src="" alt="" />
        </div>
      </div>
      {[1, 2].map((_, idx) => (
        <div key={idx}>
          <img
            src={img3}
            alt={`Promo ${idx + 1}`}
            className="w-full h-auto rounded"
          />
        </div>
      ))}
    </div>
  )
}

export default Sibar