// import './News.css'
import { newsSevice } from '@/services/client/newsService'
import Card from './Card'
import Carousel from './Carousel'
import Carousel2 from './Carousel2'
import MidNews from './MidNews'
import SibarMid from './SibarMid'
import SibarTop from "./SibarTop"
import TopNews from "./TopNews"
import { NewsContext, useNews } from './newsContext';
import React, { useEffect, useState } from 'react';
import { stripHTML } from '@/utils';
const newsPosts = Array.from({ length: 10 }, (_, i) => ({
    title: `Tin nóng Galaxy S25 #${i + 1}`,
    date: '09/05/2025',
    image: 'https://images.samsung.com/vn/smartphones/galaxy-s25/buy/product_color_blueBlack_plus_PC.png'
}));

const productPosts = Array.from({ length: 10 }, (_, i) => ({
    title: `Sản phẩm nổi bật #${i + 1}`,
    date: "09/05/2025",
    image: 'https://tintuc.dienthoaigiakho.vn/wp-content/uploads/2025/05/cach-lam-trend-pixsever-3-350x250.jpg',
}));
const News = () => {
    const [featuredNews, setfeaturedNews] = useState([]);
    const [newsByCategory, setNewsByCategory] = useState([])
    const [featuredPosts, setFeaturedPosts] = useState([]);
    const [productPosts, setProductPosts] = useState([]);
    const [newsByTitle, setNewsByTitle] = useState({});
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [newsBySlug, setNewsBySlug] = useState([]);
    const [visibleCount, setVisibleCount] = useState(5);
    const items = newsByTitle["Tin Tức sam sum"] || [];
    const maxIndex = items.length > visibleCount ? items.length - visibleCount : 0;
    const titles = ["Tin Tức sam sum", "Tin tức Apple", "Thủ thuật - mẹo hay", ];
    useEffect(() => {
        const fetchFeature = async () => {
            try {
                const res = await newsSevice.getFeature(); // gọi API thật
                setfeaturedNews(res.data.data);

            } catch (error) {
                console.error('Lỗi lấy tin tức:', error);
            }
        };
        fetchFeature();
    }, []);

    const categorySlugs = ['tin-tuc-sam-sum', 'tin-tuc-apple', 'thu-thuat-meo-hay','tri-tue-nhan-tao-ai'];

    const fetchByCategory = async () => {
        const result = {};

        const requests = categorySlugs.map(slug =>
            newsSevice.getNewsByCategory(slug)
                .then(res => ({ slug, data: res.data.data }))
                .catch(err => {
                    console.error(`❌ Lỗi lấy tin "${slug}":`, err?.message || err);
                    return null;
                })
        );

        const responses = await Promise.allSettled(requests);

        for (const res of responses) {
            if (res.status === 'fulfilled' && res.value) {
                result[res.value.slug] = res.value.data;
            }
        }

        console.log('bai viet', result)
        setNewsBySlug(result); // state mới
    };

    useEffect(() => {
        fetchByCategory();
    }, [])
    console.log("🧪 Carousel items:", newsByTitle["tin-tuc-sam-sum"]);

    return (
        <NewsContext.Provider value={{ stripHTML, featuredNews, setfeaturedNews }}>
            <div className="max-w-screen-xl mx-auto w-full px-4">
                <div className="text-left px-4 py-4">
                    <h1>Trang chủ / Tin tức nổi bật </h1>
                </div>
                <div className='flex flex-col lg:flex-row justify-between px-0 md:px-4'>
                    <div className="w-full py-4 md:py-0">
                        <TopNews />
                    </div>
                    <div style={{ maxWidth: '390px' }}>
                        <SibarTop />
                    </div>
                </div>

                <div className='my-5'>
                    {/* <Carousel title="Tin Tức sam sum" items={newsPosts} visibleCount={5} /> */}
                    <Carousel
  title="Tin Tức sam sum"
  items={newsBySlug["tin-tuc-sam-sum"] || []}
  currentIndex={carouselIndex}
  visibleCount={5}
/>


                </div>

                <div className='flex flex-col lg:flex-row justify-between gap-4 px-0 md:px-4'>
                    <div className="w-full">
                        <MidNews title="Tin tức Apple" items={newsBySlug["tin-tuc-apple"] || []} />
                    </div>
                    <div style={{ maxWidth: '430px' }}>
                        <SibarMid title="Trí tuệ nhân tạo - AI" items={newsBySlug["tri-tue-nhan-tao-ai"] || []} visibleCount={5} />
                    </div>
                </div>
                <div className='my-5'>
                    <Carousel2 title="Tin nổi bật nhất" />
                </div>
                <div className='my-5'>
                    <Card />
                </div>
                <div className='my-5'>
                    <Carousel
  title="Thủ thuật - mẹo hay"
  items={newsBySlug["thu-thuat-meo-hay"] || []}
  currentIndex={carouselIndex}
  visibleCount={5}
/>
                </div>
            </div>
        </NewsContext.Provider>
    )
}

export default News
