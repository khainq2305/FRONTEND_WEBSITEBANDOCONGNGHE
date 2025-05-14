import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const banners = [
  {
    src: "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1738746634864-600x180_Subbanner-Mua-truoc-tra-sau.jpg&w=1920&q=75",
    alt: "Banner 1",
  },
  {
    src: "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1738922725165-600x180_Sub-banner-Tablet-Macbook.jpg&w=1080&q=75",
    alt: "Banner 2",
  },
];

export default function Banner() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="mt-4">
      {/* Mobile: slider */}
      <div className="block md:hidden">
        <Slider {...settings}>
          {banners.map((banner, i) => (
            <div key={i}>
              <img
                src={banner.src}
                alt={banner.alt}
                className="w-full h-auto object-cover rounded"
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* Desktop: 2 cột */}
      <div className="hidden md:grid grid-cols-2 gap-2">
        {banners.map((banner, i) => (
          <img
            key={i}
            src={banner.src}
            alt={banner.alt}
            className="w-full h-auto object-cover rounded"
          />
        ))}
      </div>
    </div>
  );
}
