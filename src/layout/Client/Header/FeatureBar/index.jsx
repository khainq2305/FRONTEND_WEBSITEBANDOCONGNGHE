import React from 'react';
import { ThumbsUp, RefreshCw, CreditCard, Truck, Phone } from 'lucide-react';

const FeatureBar = ({ isSticky }) => {
    const features = [
        { icon: <ThumbsUp size={22} strokeWidth={1.5} />, text: "100% HÀNG CHÍNH HÃNG" },
        { icon: <RefreshCw size={22} strokeWidth={1.5} />, text: "45 NGÀY MIỄN PHÍ 1 ĐỔI 1" },
        { icon: <CreditCard size={22} strokeWidth={1.5} />, text: "TRẢ GÓP 0% LÃI SUẤT" },
        { icon: <Truck size={22} strokeWidth={1.5} />, text: "GIAO NHANH MIỄN PHÍ 2H" },
        { isHotline: true, icon: <Phone size={22} strokeWidth={1.5} />, text: "HOTLINE: ", phone: "1900 8922" }
    ];

    return (
        <div
            className={`
                max-w-[1200px] mx-auto bg-white py-3 px-2 shadow-md rounded-lg
                flex flex-nowrap overflow-x-auto
                justify-start lg:justify-around items-center gap-x-4
                ${!isSticky ? 'my-4' : ''}
                hidden lg:hidden xl:flex {/* ĐÂY LÀ DÒNG BẠN CẦN THAY ĐỔI */}
            `}
        >
            {features.map((feature, index) => (
                <div
                    key={index}
                    className="flex items-center gap-x-2.5 whitespace-nowrap px-2 py-1 min-w-fit"
                >
                    <span className={`${feature.isHotline ? 'text-orange-500' : 'text-gray-700'}`}>
                        {feature.icon}
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                        {feature.text}
                        {feature.isHotline && (
                            <span className="text-orange-500 font-bold">{feature.phone}</span>
                        )}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default FeatureBar;