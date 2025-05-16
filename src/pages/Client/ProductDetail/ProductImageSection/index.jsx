import React from "react";
import FeatureSlider from "../FeatureSlider";

export default function ProductImageSection({ mainImage, setMainImage }) {
  return (
    <div className="space-y-6">
      <div className="w-full aspect-[4/2] border border-gray-200 rounded overflow-hidden">
        <img
          src={mainImage}
          alt=""
          className="w-full h-full object-contain"
        />
      </div>
      <FeatureSlider onSelect={(img) => setMainImage(img)} />
    </div>
  );
}
