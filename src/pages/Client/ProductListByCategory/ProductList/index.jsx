import { useState } from "react";
import ProductCard from "../ProductCard";

  const allProducts = [
    {
      name: "Realme 14C 6GB/256GB Chính Hãng ealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãng",
      price: "2.390.000",
      oldPrice: "3.090.000",
      image:
        "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746613789982-Realme-14-Si.jpg&w=1920&q=75",
      badge: "BEST PRICE ",
      discount: 28,
      rating: 4.5,
      status: "Còn hàng",
      couponBanner:
        "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746764979821-ANDROIDONL50.png&w=384&q=75",
    },
      {
      name: "Realme 14C 6GB/256GB Chính Hãng ealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãng",
      price: "2.390.000",
      oldPrice: "3.090.000",
      image:
        "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746613789982-Realme-14-Si.jpg&w=1920&q=75",
      badge: "BEST PRICE ",
      discount: 28,
      rating: 4.5,
      status: "Còn hàng",
      couponBanner:
        "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746764979821-ANDROIDONL50.png&w=384&q=75",
    },  {
      name: "Realme 14C 6GB/256GB Chính Hãng ealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãng",
      price: "2.390.000",
      oldPrice: "3.090.000",
      image:
        "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746613789982-Realme-14-Si.jpg&w=1920&q=75",
      badge: "BEST PRICE ",
      discount: 28,
      rating: 4.5,
      status: "Còn hàng",
      couponBanner:
        "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746764979821-ANDROIDONL50.png&w=384&q=75",
    },  {
      name: "Realme 14C 6GB/256GB Chính Hãng ealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãng",
      price: "2.390.000",
      oldPrice: "3.090.000",
      image:
        "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746613789982-Realme-14-Si.jpg&w=1920&q=75",
      badge: "BEST PRICE ",
      discount: 28,
      rating: 4.5,
      status: "Còn hàng",
      couponBanner:
        "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746764979821-ANDROIDONL50.png&w=384&q=75",
    },  {
      name: "Realme 14C 6GB/256GB Chính Hãng ealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãng",
      price: "2.390.000",
      oldPrice: "3.090.000",
      image:
        "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746613789982-Realme-14-Si.jpg&w=1920&q=75",
      badge: "BEST PRICE ",
      discount: 28,
      rating: 4.5,
      status: "Còn hàng",
      couponBanner:
        "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746764979821-ANDROIDONL50.png&w=384&q=75",
    },  {
      name: "Realme 14C 6GB/256GB Chính Hãng ealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãng",
      price: "2.390.000",
      oldPrice: "3.090.000",
      image:
        "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746613789982-Realme-14-Si.jpg&w=1920&q=75",
      badge: "BEST PRICE ",
      discount: 28,
      rating: 4.5,
      status: "Còn hàng",
      couponBanner:
        "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746764979821-ANDROIDONL50.png&w=384&q=75",
    },  {
      name: "Realme 14C 6GB/256GB Chính Hãng ealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãng",
      price: "2.390.000",
      oldPrice: "3.090.000",
      image:
        "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746613789982-Realme-14-Si.jpg&w=1920&q=75",
      badge: "BEST PRICE ",
      discount: 28,
      rating: 4.5,
      status: "Còn hàng",
      couponBanner:
        "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746764979821-ANDROIDONL50.png&w=384&q=75",
    },  {
      name: "Realme 14C 6GB/256GB Chính Hãng ealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãng",
      price: "2.390.000",
      oldPrice: "3.090.000",
      image:
        "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746613789982-Realme-14-Si.jpg&w=1920&q=75",
      badge: "BEST PRICE ",
      discount: 28,
      rating: 4.5,
      status: "Còn hàng",
      couponBanner:
        "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746764979821-ANDROIDONL50.png&w=384&q=75",
    },  {
      name: "Realme 14C 6GB/256GB Chính Hãng ealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãng",
      price: "2.390.000",
      oldPrice: "3.090.000",
      image:
        "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746613789982-Realme-14-Si.jpg&w=1920&q=75",
      badge: "BEST PRICE ",
      discount: 28,
      rating: 4.5,
      status: "Còn hàng",
      couponBanner:
        "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746764979821-ANDROIDONL50.png&w=384&q=75",
    },  {
      name: "Realme 14C 6GB/256GB Chính Hãng ealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãng",
      price: "2.390.000",
      oldPrice: "3.090.000",
      image:
        "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746613789982-Realme-14-Si.jpg&w=1920&q=75",
      badge: "BEST PRICE ",
      discount: 28,
      rating: 4.5,
      status: "Còn hàng",
      couponBanner:
        "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746764979821-ANDROIDONL50.png&w=384&q=75",
    },  {
      name: "Realme 14C 6GB/256GB Chính Hãng ealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãng",
      price: "2.390.000",
      oldPrice: "3.090.000",
      image:
        "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746613789982-Realme-14-Si.jpg&w=1920&q=75",
      badge: "BEST PRICE ",
      discount: 28,
      rating: 4.5,
      status: "Còn hàng",
      couponBanner:
        "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746764979821-ANDROIDONL50.png&w=384&q=75",
    },  {
      name: "Realme 14C 6GB/256GB Chính Hãng ealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãng",
      price: "2.390.000",
      oldPrice: "3.090.000",
      image:
        "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746613789982-Realme-14-Si.jpg&w=1920&q=75",
      badge: "BEST PRICE ",
      discount: 28,
      rating: 4.5,
      status: "Còn hàng",
      couponBanner:
        "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746764979821-ANDROIDONL50.png&w=384&q=75",
    },  {
      name: "Realme 14C 6GB/256GB Chính Hãng ealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãng",
      price: "2.390.000",
      oldPrice: "3.090.000",
      image:
        "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746613789982-Realme-14-Si.jpg&w=1920&q=75",
      badge: "BEST PRICE ",
      discount: 28,
      rating: 4.5,
      status: "Còn hàng",
      couponBanner:
        "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746764979821-ANDROIDONL50.png&w=384&q=75",
    },  {
      name: "Realme 14C 6GB/256GB Chính Hãng ealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãng",
      price: "2.390.000",
      oldPrice: "3.090.000",
      image:
        "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746613789982-Realme-14-Si.jpg&w=1920&q=75",
      badge: "BEST PRICE ",
      discount: 28,
      rating: 4.5,
      status: "Còn hàng",
      couponBanner:
        "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746764979821-ANDROIDONL50.png&w=384&q=75",
    },  {
      name: "Realme 14C 6GB/256GB Chính Hãng ealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãng",
      price: "2.390.000",
      oldPrice: "3.090.000",
      image:
        "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746613789982-Realme-14-Si.jpg&w=1920&q=75",
      badge: "BEST PRICE ",
      discount: 28,
      rating: 4.5,
      status: "Còn hàng",
      couponBanner:
        "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746764979821-ANDROIDONL50.png&w=384&q=75",
    },  {
      name: "Realme 14C 6GB/256GB Chính Hãng ealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãng",
      price: "2.390.000",
      oldPrice: "3.090.000",
      image:
        "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746613789982-Realme-14-Si.jpg&w=1920&q=75",
      badge: "BEST PRICE ",
      discount: 28,
      rating: 4.5,
      status: "Còn hàng",
      couponBanner:
        "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746764979821-ANDROIDONL50.png&w=384&q=75",
    },  {
      name: "Realme 14C 6GB/256GB Chính Hãng ealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãng",
      price: "2.390.000",
      oldPrice: "3.090.000",
      image:
        "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746613789982-Realme-14-Si.jpg&w=1920&q=75",
      badge: "BEST PRICE ",
      discount: 28,
      rating: 4.5,
      status: "Còn hàng",
      couponBanner:
        "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746764979821-ANDROIDONL50.png&w=384&q=75",
    },  {
      name: "Realme 14C 6GB/256GB Chính Hãng ealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãng",
      price: "2.390.000",
      oldPrice: "3.090.000",
      image:
        "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746613789982-Realme-14-Si.jpg&w=1920&q=75",
      badge: "BEST PRICE ",
      discount: 28,
      rating: 4.5,
      status: "Còn hàng",
      couponBanner:
        "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746764979821-ANDROIDONL50.png&w=384&q=75",
    },  {
      name: "Realme 14C 6GB/256GB Chính Hãng ealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãngealme 14C 6GB/256GB Chính Hãng",
      price: "2.390.000",
      oldPrice: "3.090.000",
      image:
        "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746613789982-Realme-14-Si.jpg&w=1920&q=75",
      badge: "BEST PRICE ",
      discount: 28,
      rating: 4.5,
      status: "Còn hàng",
      couponBanner:
        "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746764979821-ANDROIDONL50.png&w=384&q=75",
    },
    // ... (các sản phẩm khác)
    {
      name: "Realme 14C 6GB/256GB Chính Hãng Cuối Cùng", // Thêm một sản phẩm khác để test
      price: "2.190.000",
      oldPrice: "2.890.000",
      image:
        "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746613789982-Realme-14-Si.jpg&w=1920&q=75",
      badge: "GIAO NHANH",
      discount: 24,
      rating: 4.2,
      status: "Còn hàng",
      // couponBanner: null, // Test trường hợp không có coupon
    },
  ];

export default function ProductList() {
  const [visibleCount, setVisibleCount] = useState(10);

  const handleToggle = () => {
    const isReset = visibleCount >= allProducts.length;
    setVisibleCount(isReset ? 10 : Math.min(visibleCount + 10, allProducts.length));

    if (isReset) {
      const productListTop = document.querySelector('.product-list-container');
      if (productListTop) {
        productListTop.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const isAllVisible = visibleCount >= allProducts.length;
  const remainingCount = allProducts.length - visibleCount;

  return (
    <div className="product-list-container max-w-screen-xl mx-auto py-6 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] mt-4">
      {/* Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-3 sm:gap-x-4 gap-y-4 sm:gap-y-6 px-2 sm:px-4">
        {allProducts.slice(0, visibleCount).map((item, index) => (
          <ProductCard key={`${item.name}-${index}`} {...item} />
        ))}
      </div>

      {/* Nút xem thêm / thu gọn */}
      {allProducts.length > 10 && (
        <div className="text-center mt-8">
          <button
            onClick={handleToggle}
            className="px-6 py-2.5 rounded-md text-sm font-bold 
                    border border-yellow-500 bg-yellow-50 text-yellow-700 
                    hover:bg-yellow-100 hover:text-yellow-800 transition duration-200 ease-in-out
                    focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50
                    shadow-sm hover:shadow-md"
          >
            {isAllVisible
              ? "Thu gọn"
              : `Xem Thêm ${Math.min(remainingCount, 10)} Sản Phẩm`}
          </button>
        </div>
      )}
    </div>
  );
}
