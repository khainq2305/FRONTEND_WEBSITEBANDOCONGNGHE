import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { bannerService } from "@/services/client/bannerService";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ProductBanner.css"; 

export default function ProductBanner({ productId }) {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    if (!productId) return;
    bannerService
      .getByProductId(productId)
      .then((res) => {
        console.log("API banner response:", res);
        setBanners(res.data?.data || []);
      })
      .catch((err) => {
        console.error("Lỗi lấy banner sản phẩm:", err);
      });
  }, [productId]);

  if (!banners.length) return null;

  if (banners.length === 1) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-2">
        <a
          href={banners[0].link || "#"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={banners[0].imageUrl}
            alt={banners[0].title || "banner"}
            className="w-full h-auto rounded-lg"
          />
        </a>
      </div>
    );
  }

  const settings = {
    dots: false, 
    infinite: banners.length > 2,
    speed: 500,
    slidesToShow: Math.min(2, banners.length),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="rounded-lg product-banner-container">
      <Slider {...settings}>
        {banners.map((banner, index) => (
          <div
            key={index}
            className="px-1" 
          >
            <a
              href={banner.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <img
                src={banner.imageUrl}
                alt={banner.title || "banner"}
                className="w-full h-auto rounded-lg object-cover"
              />
            </a>
          </div>
        ))}
      </Slider>
    </div>
  );
}