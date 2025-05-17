import React from "react";
import SliderBanner from "./SliderBanner";
import ProductCategorySection from "./ProductCategorySection";

import ViewedProductsSlider from "./ViewedProductsSlider";
import FreshProductSlider from "./FreshProductSlider";
import PromoGridSection from "./PromoGridSection";
import MainBannerSlider from "./MainBannerSlider";

import ProductCategorySlider from "./ProductCategorySlider";
import TwoRowMarketSlider from "./TwoRowMarketSlider";
const HomePage = () => {
  return (
    <>
    <div className="flex justify-center px-2 py-2 bg-gray-100">
        <div className="max-w-screen-xl w-full mx-auto">
          <SliderBanner />
        </div>
      </div>
       <div className="flex justify-center px-2 py-2 bg-gray-100">
        <div className="max-w-screen-xl w-full mx-auto">
          <ProductCategorySection />
        </div>
      </div>
      <div className="flex justify-center px-2 py-2 bg-gray-100">
        <div className="max-w-screen-xl w-full mx-auto flex flex-col gap-6 items-start">
          <ViewedProductsSlider />
        </div>
      </div>
      
      <div className="flex justify-center px-2 py-2 bg-gray-100">
        <div className="max-w-screen-xl w-full mx-auto flex flex-col gap-6 items-start">
          <PromoGridSection />
        </div>
      </div>
    {/* KHỐI SLIDER BANNER CHÍNH (Summer Sale) */}
      <div className="flex justify-center px-2 py-2 bg-gray-100">
        <div className="max-w-screen-xl w-full mx-auto">
          <TwoRowMarketSlider />
        </div>
      </div>
      
      <div className="flex justify-center px-2 py-2 bg-gray-100">
        <div className="max-w-screen-xl w-full mx-auto">
          <FreshProductSlider />
        </div>
      </div>
      <div className="flex justify-center px-2 py-2 bg-gray-100">
        <div className="max-w-screen-xl w-full mx-auto">
          <ProductCategorySlider />
        </div>
      </div>
    
      
      
         <div className="flex justify-center py-2 bg-gray-100">
        <div className="max-w-screen-xl w-full mx-auto flex flex-col gap-6 items-start">
          <MainBannerSlider />
        </div>
      </div>
      
   
     
        </>
  );
};

export default HomePage;
