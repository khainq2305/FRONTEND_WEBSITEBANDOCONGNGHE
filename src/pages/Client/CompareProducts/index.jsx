import { useState } from "react";
// import "./index.css";
import Compare from "./Compare";
import ProductList from "./ProductCard";
import Sidebar from "./Sidebar";
import ProductImageSlider from "./ProductImageSlider";

export default function CompareProducts() {
  const [activeTab, setActiveTab] = useState("info");

  return (
    <div className="max-w-screen-xl mx-auto px-8 py-6 text-sm text-gray-700">
      <div className="flex flex-col md:flex-row border-gray-300" style={{ boxShadow: '0 20px 10px -15px rgba(102, 102, 102, 0.2)' }}>
        <Sidebar />
        <div className="w-full md:w-3/4 flex flex-col">
          <ProductList />
        </div>
      </div>
      <Compare />
      <div className="py-8">
        <ProductImageSlider />
      </div>
    </div>
  );
}
