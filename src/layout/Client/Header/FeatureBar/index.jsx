// src/layout/Client/FeatureBar.jsx

import React from 'react';
import { ThumbsUp, RefreshCw, CreditCard, Truck, Phone } from 'lucide-react'; 

// THAY ĐỔI: Nhận prop 'isSticky' từ Header
const FeatureBar = ({ isSticky }) => {
    const features = [
        { icon: <ThumbsUp size={22} strokeWidth={1.5} />, text: "100% HÀNG CHÍNH HÃNG" },
        { icon: <RefreshCw size={22} strokeWidth={1.5} />, text: "45 NGÀY MIỄN PHÍ 1 ĐỔI 1" },
        { icon: <CreditCard size={22} strokeWidth={1.5} />, text: "TRẢ GÓP 0% LÃI SUẤT" },
        { icon: <Truck size={22} strokeWidth={1.5} />, text: "GIAO NHANH MIỄN PHÍ 2H" },
        { isHotline: true, icon: <Phone size={22} strokeWidth={1.5} />, text: "HOTLINE: ", phone: "1900 8922" }
    ];

    return (
        // THAY ĐỔI: Thêm logic để quyết định có class 'my-4' hay không
        <div className={`max-w-[1200px] mx-auto bg-white py-3 shadow-md rounded-lg flex flex-wrap justify-around items-center gap-y-2 
            ${!isSticky ? 'my-4' : ''} 
        `}>
            
            {features.map((feature, index) => (
                <div key={index} className="group flex items-center gap-x-2.5 p-1 cursor-pointer">
                    <span className={`${feature.isHotline ? 'text-orange-500' : 'text-gray-700'}`}>
                       {feature.icon}
                    </span>
                    <span className="text-sm font-semibold text-gray-800 text-center">
                        {feature.text}
                        {feature.isHotline && (
                            <span className="text-orange-500 font-bold">
                                {feature.phone}
                            </span>
                        )}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default FeatureBar;