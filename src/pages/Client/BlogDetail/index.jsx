import React from 'react';
import Main from './Main';
import Sibar from './Sibar';
import Sibar2 from './Sibar2';
import Sibar3 from './Sibar3';
import RelatedPosts from './RelatedPosts';

const NewsDetails = () => {
    return (
        <>
            <div className="max-w-screen-xl mx-auto w-full px-4">
                <div className='py-4'>
                    <h1 className='text-xs md:text-sm'>Bài viết / Galaxy s25</h1>
                </div>
                <div className='flex flex-col lg:flex-row gap-4'><div className="w-full lg:flex-[3]">
                    <div className='pb-5'><Main /></div>
                    <div className='py-5 mb-4'><RelatedPosts title='Bài viết liên quan'/></div>
                </div>

                    {/* Sidebar */}
                    <div className="w-full lg:flex-[1.5] pb-4 md:pb-0">
                        <div className='pb-3'><Sibar title='Tin Khuyến mãi' /></div>
                        <div className='pt-3'><Sibar2 title='Bài viết mới nhất' /></div>
                        <div className='pt-3'><Sibar3 title='Từ khóa gợi ý' /></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NewsDetails;
