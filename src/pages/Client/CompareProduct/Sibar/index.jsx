import React from 'react'

const Silebar = () => {
  const products = [
    'OPPO A60 8GB/128GB',
    'REALME 12 8GB/256GB',
    'OPPO A60 8GB/256GB'
  ]

  return (
    <div className="text-base md:text-xl font-bold uppercase leading-snug">
      {/* Cùng block, hiển thị khác nhau theo màn hình */}
      <span className="text-gray-500 font-normal normal-case block md:inline">
        So sánh sản phẩm
      </span>

      <span className="inline md:block md:mt-1">
        {products.map((product, index) => (
          <span key={index} className="inline md:inline-block md:whitespace-nowrap">
            {index > 0 && <span className="text-gray-500 mx-1">&</span>}
            {product}
          </span>
        ))}
      </span>
    </div>
  )
}

export default Silebar
