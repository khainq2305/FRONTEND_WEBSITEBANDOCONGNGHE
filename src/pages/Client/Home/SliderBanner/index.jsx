import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Custom arrow components
const PrevArrow = ({ onClick }) => (
  <button
    className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 z-10
               bg-black/40 text-white p-2.5 rounded-full shadow-lg
               opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out
               hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-yellow-400"
    onClick={onClick}
    style={{ touchAction: 'manipulation' }}
    aria-label="Previous Slide"
  >
    <ArrowLeft size={20} strokeWidth={2.5} />
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 z-10
               bg-black/40 text-white p-2.5 rounded-full shadow-lg
               opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out
               hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-yellow-400"
    onClick={onClick}
    style={{ touchAction: 'manipulation' }}
    aria-label="Next Slide"
  >
    <ArrowRight size={20} strokeWidth={2.5} />
  </button>
);

const SliderBanner = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const placeholderImage = (width, height, text = "Lỗi ảnh") =>
    `https://placehold.co/${width}x${height}/e2e8f0/94a3b8?text=${encodeURIComponent(text)}`;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    beforeChange: (current, next) => setActiveSlide(next),
    appendDots: dots => (
      // Đưa container của dots sát xuống dưới cùng và loại bỏ line-height/font-size có thể gây thêm không gian
      <div style={{ position: "absolute", bottom: "0px", width: "100%", paddingBottom: "0px", lineHeight: "0", fontSize: "0" }}>
        {/* Thêm display:flex cho ul để kiểm soát tốt hơn các li (dots) và đặt chiều cao cố định nhỏ */}
        <ul style={{ margin: "0px", padding: "0px", textAlign: "center", display: 'flex', justifyContent: 'center', alignItems: 'center', height: '12px' /* Đủ cho dot 10px + chút xíu */ }}> {dots} </ul>
      </div>
    ),
    customPaging: i => {
      const isActive = i === activeSlide;
      return (
        <div
          style={{
            width: "10px", // Kích thước dot bằng nhau
            height: "10px", // Kích thước dot bằng nhau
            borderRadius: "50%",
            backgroundColor: isActive ? "#FACC15" : "#D1D5DB", // Màu vàng (yellow-400) cho active, Xám (gray-300) cho inactive
            display: "inline-block",
            margin: "0 px", // Giữ lại margin ban đầu hoặc điều chỉnh nếu cần
            cursor: "pointer",
            transition: "background 0.3s ease-in-out", // Giữ lại transition màu
            // Bỏ transform scale
            verticalAlign: "middle"
          }}
          aria-label={`Go to slide ${i + 1}`}
        ></div>
      );
    },
    className: "main-slider-container", // Class cho thẻ div.slick-slider
    dotsClass: "slick-dots custom-slick-dots" // Class cho thẻ ul chứa các dots
  };

  const slidesData = [
    {
      imgSrc: "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746404967244-984x395_Main-Banner.jpg&w=1920&q=75", // Original slide 1
      altText: "Banner Khuyến Mãi 1",
    },
    {
      imgSrc: "https://cdn.tgdd.vn/2023/04/banner/1200-300-1200x300.png", // Original slide 2
      altText: "Banner Khuyến Mãi 2",
    },
    {
      imgSrc: "https://placehold.co/1200x395/34d399/ffffff?text=Summer+Sale+Banner+3", // Original slide 3
      altText: "Banner Khuyến Mãi 3",
    },
  ];

  return (
    // Container chính của toàn bộ SliderBanner (slider chính + 3 banner phụ bên phải)
    // Thêm px-2 md:px-4 để có padding ngang trên mobile/tablet.
    // lg:px-0 để không có padding ngang trên desktop (giả sử layout cha sẽ xử lý).
    <div className="flex flex-col lg:flex-row lg:gap-4 w-full h-auto lg:h-[395px] px-2 md:px-4 lg:px-0">
      {/* Container của Slider chính */}
      <div className="group w-full lg:w-[calc(80%-0.5rem)] rounded-lg shadow-md overflow-hidden relative
                      h-auto lg:h-[395px]"> {/* h-auto trên mobile/tablet, chiều cao cố định trên lg */}
        {/* Div bọc ngoài Slider để đảm bảo Slider chiếm toàn bộ không gian của container này */}
        <div className="h-full w-full">
            <Slider {...settings}>
            {slidesData.map((slide, index) => (
                <div key={index} className="relative outline-none"> {/* Mỗi slide là một div */}
                <img
                    src={slide.imgSrc}
                    alt={slide.altText}
                    // Thêm 'block' để loại bỏ khoảng trắng dưới ảnh inline.
                    // Giữ lại chiều cao vw ban đầu hoặc điều chỉnh nếu cần
                    className="w-full h-[50vw] sm:h-[45vw] md:h-[40vw] lg:h-[395px] object-cover block"
                    onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = placeholderImage(
                        e.currentTarget.naturalWidth || 1200,
                        e.currentTarget.naturalHeight || 395,
                        slide.altText + " (lỗi)"
                    );
                    }}
                />
                </div>
            ))}
            </Slider>
        </div>
      </div>

      {/* Container cho các banner phụ bên phải (chỉ hiển thị trên lg+) */}
      <div className="hidden lg:flex flex-col gap-2 lg:w-[calc(20%-0.5rem)] lg:h-[395px] mt-4 lg:mt-0">
        {[
          { src: "https://cdn.tgdd.vn/2024/05/banner/DESK-1200x150-1200x150.png", alt: "Banner phụ 1", href: "#banner-phu-1" },
          { src: "https://cdn.tgdd.vn/2024/03/banner/DESKStickybanner-1200x150.png", alt: "Banner phụ 2", href: "#banner-phu-2" },
          { src: "https://cdn.tgdd.vn/2024/05/banner/720-220-720x220-17.png", alt: "Banner phụ 3", href: "#banner-phu-3" },
        ].map((banner, index) => (
          <a
            href={banner.href}
            key={index}
            className="block rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-[calc((100%-1rem)/3)]"
            aria-label={banner.alt}
          >
            <img
              src={banner.src}
              alt={banner.alt}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = placeholderImage(400, 126, banner.alt + " (lỗi)");
              }}
            />
          </a>
        ))}
      </div>
    </div>
  );
};

export default SliderBanner;