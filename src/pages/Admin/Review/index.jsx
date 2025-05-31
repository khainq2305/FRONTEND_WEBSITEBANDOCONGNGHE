import React from "react";
import { Routes, Route } from "react-router-dom";
import ReviewList from "./ReviewList";
import ReviewDetail from "./ReviewDetail";
import ReviewAll from "./ReviewAll";
import ReviewAllDetail from './ReviewAllDetail';

const ReviewPage = () => {
  return (
    <Routes>
      <Route path="/" element={<ReviewList />} />
      <Route path=":skuId" element={<ReviewDetail />} />
      <Route path="all" element={<ReviewAll />} />
      <Route path="all/:id" element={<ReviewAllDetail />} />
    </Routes>
  );
};

export default ReviewPage;
