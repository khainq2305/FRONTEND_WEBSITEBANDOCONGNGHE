import React from 'react';
import newsimg1 from '../../../../assets/Client/images/News/garena-ra-mat-free-city-1-350x250.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faComment } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';
const RelatedPosts = ({ title, related }) => {
    return (
        <div className="py-4">
            <div className="space-y-4 relative">
                <div className="font-bold text-justify uppercase">{title}</div>
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-yellow-400 to-gray-300"></div>
            </div>
            <div className="flex flex-wrap -mx-2 mb-2">
                {Array.isArray(related) && related.map((item, index) => (
                    <div key={index} className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
                        <Link to={`/tin-noi-bat/${item.slug}`} onClick={() => {
                            console.log(`post ne ${item.slug}`);
                        }} className=" overflow-hidden h-full">
                            <img src={newsimg1} alt="news" className="w-full h-[150px] object-cover rounded" />
                            <div className="p-2 text-md font-medium">{item.title}</div>
                            <div className="flex gap-3 text-xs text-gray-600 flex-wrap pl-2">
                                <p className="flex items-center text-xs gap-1">
                                    <FontAwesomeIcon icon={faClock} style={{ color: "#000" }} />
                                    {item.publishAt ? new Date(item.publishAt).toLocaleDateString('vi-VN') : new Date(item.createdAt).toLocaleDateString('vi-VN')}
                                </p>
                                <span className="flex items-center gap-1">
                                    <FontAwesomeIcon icon={faComment} flip="horizontal" style={{ color: "#000" }} />
                                    0
                                </span>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RelatedPosts;
