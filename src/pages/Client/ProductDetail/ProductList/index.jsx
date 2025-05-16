import { useState } from "react";
import ProductCard from "../../ProductListByCategory/ProductCard";

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
    }, {
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
    }, {
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
    }, {
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
    }, {
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
    }, {
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
    }, {
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
    }, {
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
    }, {
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
    }, {
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
    }, {
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
    }, {
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
    }, {
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
    }, {
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
    }, {
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
    }, {
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
    }, {
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
    }, {
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
  <div className="product-list-container max-w-screen-xl mx-auto py-6 bg-white rounded-xl mt-4">
    {/* Horizontal Scroll List */}
    <div className="overflow-x-auto">
      <div className="flex gap-4 sm:gap-5 md:gap-6 lg:gap-7 px-2 sm:px-4">
        {allProducts.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className="
              flex-shrink-1
              min-w-[180px] max-w-[180px] 
              sm:min-w-[180px] sm:max-w-[200px]
              md:min-w-[220px] md:max-w-[250px]
              lg:min-w-[220px] lg:max-w-[240px]
            "
          >
            <ProductCard {...item} />
          </div>
        ))}
      </div>
    </div>
  </div>
);


}
