import React from 'react';
import productImg from '../../../../assets/Client/images/News/realme-12-(38).jpg';
import exclusiveLabel from '../../../../assets/Client/images/News/label-tgdd-200x200.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

const ProductCard = () => {
  const products = [
    {
      name: 'OPPO A60 8GB/256GB',
      price: '6.490.000₫',
      gift: 'Quà 500.000₫',
      rating: '4.9',
      sold: '93,3k',
      image: productImg,
      label: exclusiveLabel,
    },
    {
      name: 'Realme 12 Pro 12GB/256GB',
      price: '7.990.000₫',
      gift: 'Quà 700.000₫',
      rating: '4.8',
      sold: '120,4k',
      image: productImg,
      label: exclusiveLabel,
    },
    {
      name: 'Samsung A15 6GB/128GB',
      price: '4.990.000₫',
      gift: 'Quà 300.000₫',
      rating: '4.7',
      sold: '85,1k',
      image: productImg,
      label: exclusiveLabel,
    },
  ];

  return (
    <div className="flex">
      {products.map((item, index) => (
        <div
          key={index}
          className={`relative bg-white border border-gray-300 md:p-2 md:w-[310px] 
      ${index === 1 ? 'border-l-0 border-r-0' : ''}
    `}

        >
          {/* Trả góp */}
          <div className="absolute top-1 left-1 bg-gray-200 text-xs px-2 py-[2px] rounded z-10">
            Trả chậm 0%
          </div>

          {/* Icon đóng */}
          <div className="absolute top-1 right-1 text-sm cursor-pointer">
            <FontAwesomeIcon icon={faCircleXmark} />
          </div>

          {/* Ảnh sản phẩm */}
          <div className="w-full mt-10 md:mt-[35px] px-2 mx-auto flex items-center justify-center">
            <img
              src={item.image}
              alt="Product"
              className="object-cover max-w-full max-h-full"
            />
          </div>

          {/* Label dán vào ảnh */}
          <img
            src={item.label}
            alt="Exclusive"
            className="absolute bottom-[110px] left-1  md:bottom-[100px] md:left-3 w-[25px] h-[25px] md:w-[45px] md:h-[45px] z-10"
          />

          {/* Thông tin */}
          <div className="pt-2 pl-1">
            <h2 className="text-sm font-semibold leading-snug line-clamp-2">
              {item.name}
            </h2>
            <p className="text-red-600 font-bold mt-1">{item.price}</p>
            <p className="text-xs text-gray-600">{item.gift}</p>

            <div className="flex items-center text-xs text-gray-500 mt-2 gap-1">
              <span>⭐ {item.rating}</span>
              <span className="text-[10px]">•</span>
              <span>Đã bán {item.sold}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCard;
