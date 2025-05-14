import React from "react";
import SliderBanner from "./SliderBanner";
import ProductCategorySection from "./ProductCategorySection";

import ViewedProductsSlider from "./ViewedProductsSlider";
import ProductShowcase from "./ProductShowcase";
const HomePage = () => {
  return (
    <>
    {/* KHỐI SLIDER BANNER CHÍNH (Summer Sale) */}
      <div className="flex justify-center py-2 bg-gray-100">
        <div className="max-w-screen-xl w-full mx-auto">
          <SliderBanner />
        </div>
      </div>
      {/* KHỐI DANH MỤC SẢN PHẨM - ĐẢM BẢO CHỈ XUẤT HIỆN MỘT LẦN */}
      <div className="flex justify-center py-4 bg-gray-100">
        <div className="max-w-screen-xl w-full mx-auto">
          <ProductCategorySection />
        </div>
      </div>
       {/* KHỐI VIEWED PRODUCTS */}
      <div className="flex justify-center py-10 bg-gray-100">
        <div className="max-w-screen-xl w-full mx-auto flex flex-col gap-6 items-start">
          <ViewedProductsSlider />
        </div>
      </div>
        {/* <div className="flex justify-center py-10 bg-gray-100">
        <div className="max-w-screen-xl w-full mx-auto flex flex-col gap-6 items-start">
          <ProductShowcase />
        </div>
      </div> */}
        </>
  );
};

export default HomePage;
