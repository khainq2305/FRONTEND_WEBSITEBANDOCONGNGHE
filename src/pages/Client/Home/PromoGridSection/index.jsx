import React from 'react';

const adBannersData = [
  {
    id: 1,
    type: 'samsung_s25',
    titlePart1: "SAMSUNG",
    titlePart2: "Galaxy S25",
    discountInfo: "Giảm đến",
    discountAmount: "7 Triệu",
    priceInfo: "Chỉ từ",
    price: "16.4 Triệu",
    promoDetails: [
      { text: "Thu cũ trợ giá", amount: "2 Triệu" },
      { text: "Trả chậm Samsung Finance+", subtext: "0% lãi suất" },
      { text: "0 Phí 0 Thẻ" }
    ],
    productImageUrl: "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1747024418392-390x490_Samsung-Galaxy-S25.jpg&w=640&q=75",
    bannerBgColor: "bg-blue-700",
    textColor: "text-white",
    link: '#samsung-s25'
  },
  {
    id: 2,
    type: 'appliances',
    titleMain: "GIA DỤNG HIỆN ĐẠI",
    discountBadgeText: "Giảm đến 45%",
    price: "190K",
    productImageUrl: "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1747195889566-390x490_Gia-dung-hien-dai.jpg&w=640&q=75",
    bannerBgColor: "bg-yellow-400",
    textColor: "text-black",
    link: '#gia-dung'
  },
  { id: 3, imageUrl: "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746414588763-390x490_iPhone-15-Pro-Pro-Max.jpg&w=640&q=75", link: '#iphone-15' },
  { id: 4, imageUrl: "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1744784796577-390x490_Camp-Tablet-Macbook.jpg&w=640&q=75", link: '#tablet-macbook' },
  { id: 5, imageUrl: "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1744784796576-390x490_Camp-Android.jpg&w=640&q=75", link: '#hesales' },
  { id: 6, imageUrl: "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1744784796576-390x490_Camp-SmartWatch.jpg&w=640&q=75", link: '#smartwatch' }
];

const PromoGridSection = () => {
  return (
    <div className="max-w-screen-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {adBannersData.map((banner) => (
          <a key={banner.id} href={banner.link} className="relative block rounded-lg overflow-hidden group">
            <img src={banner.imageUrl || banner.productImageUrl} alt={banner.titlePart2 || banner.titleMain} className="w-full h-auto object-cover" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default PromoGridSection;
