import React from 'react';
import newsimg1 from '../../../../assets/Client/images/News/garena-ra-mat-free-city-1-350x250.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faComment } from '@fortawesome/free-regular-svg-icons';
const RelatedPosts = ({ title }) => {
    const items = [
        { name: "Garena ra mắt Free City: Bước ngoặt táo bạo với game thế giới mở" },
        { name: "Top 15+ game PC Online miễn phí, hay được nhiều người chơi nhất 2025" },
        { name: "Top 15+ game PC Online miễn phí, hay được nhiều người chơi nhất 2025" },
        { name: "Top 15+ game PC Online miễn phí, hay được nhiều người chơi nhất 2025" },
        { name: "Top 15+ game PC Online miễn phí, hay được nhiều người chơi nhất 2025" },
        { name: "Top 15+ game PC Online miễn phí, hay được nhiều người chơi nhất 2025" },
    ];

    return (
        <div className="py-4">
            <div className="space-y-4 relative">
                <div className="font-bold text-justify uppercase">{title}</div>
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-yellow-400 to-gray-300"></div>
            </div>
            <div className="flex flex-wrap -mx-2 mb-2">
                {items.map((item, index) => (
                    <div key={index} className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
                        <div className=" overflow-hidden h-full">
                            <img src={newsimg1} alt="news" className="w-full h-[150px] object-cover rounded" />
                            <div className="p-2 text-md font-medium">{item.name}</div>
                            <div className="flex gap-3 text-xs text-gray-600 flex-wrap pl-2">
                                <p className="flex items-center text-xs gap-1">
                                    <FontAwesomeIcon icon={faClock} style={{ color: "#000" }} />
                                    23/20/2001
                                </p>
                                <span className="flex items-center gap-1">
                                    <FontAwesomeIcon icon={faComment} flip="horizontal" style={{ color: "#000" }} />
                                    9
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RelatedPosts;
