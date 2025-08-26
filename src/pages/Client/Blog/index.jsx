// import './News.css'
import { newsSevice } from '@/services/client/newsService';
import Card from './Card';
import Carousel from './Carousel';
import Carousel2 from './Carousel2';
import MidNews from './MidNews';
import SibarMid from './SibarMid';
import SibarTop from './SibarTop';
import TopNews from './TopNews';
import { NewsContext, useNews } from './newsContext';
import React, { useEffect, useState } from 'react';
import { stripHTML } from '@/utils';
import Slider from './Slider';
import Breadcrumb from '@/components/common/Breadcrumb';

const News = () => {
  const [featuredNews, setfeaturedNews] = useState([]);
  const [newsByCategory, setNewsByCategory] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [productPosts, setProductPosts] = useState([]);
  const [newsByTitle, setNewsByTitle] = useState({});
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [newsBySlug, setNewsBySlug] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [getAllTitle, setGetAllTitle] = useState([]);
  const items = newsByTitle['Tin Tức sam sum'] || [];

  const maxIndex = items.length > visibleCount ? items.length - visibleCount : 0;
  useEffect(() => {
    const fetchFeature = async () => {
      try {
        const res = await newsSevice.getFeature();
        setfeaturedNews(res.data.data);
      } catch (error) {
        console.error('Lỗi lấy tin tức:', error);
      }
    };
    fetchFeature();
  }, []);

  // const categorySlugs = [
  //   { slug: 'tin-tuc-sam-sum', limit: 5 },
  //   { slug: 'tin-tuc-apple', limit: 10 },
  //   { slug: 'thu-thuat-meo-hay', limit: 8 },
  //   { slug: 'tri-tue-nhan-tao-ai', limit: 3 },
  //   { slug: 'tin-noi-bat-nhat', limit: 10 }
  // ];
  const categorySlugs = [
    { slug: 'nha-bep', limit: 5 },
    { slug: 'giat-ui', limit: 10 },
    { slug: 'lam-mat-dieu-hoa-khong-khi', limit: 8 },
    { slug: 'giai-tri-thiet-bi-nghe-nhin', limit: 3 },
    { slug: 'bao-quan-thuc-pham', limit: 10 }
  ];
  const fetchByCategory = async () => {
    const result = {};

    const requests = categorySlugs.map(({ slug, limit }) =>
      newsSevice
        .getNewsByCategory(slug, limit)
        .then((res) => ({ slug, data: res.data.data }))
        .catch((err) => {
          // console.error(`❌ Lỗi lấy tin "${slug}":`, err?.message || err);
          return null;
        })
    );

    const responses = await Promise.allSettled(requests);

    for (const res of responses) {
      if (res.status === 'fulfilled' && res.value) {
        result[res.value.slug] = res.value.data;
      }
    }
    setNewsBySlug(result);
  };

  useEffect(() => {
    fetchByCategory();
  }, []);
  const fetchAllTitle = async () => {
    const res = await newsSevice.getAllTitle();
    setGetAllTitle(res.data.data);
  };
  useEffect(() => {
    fetchAllTitle();
  }, []);
  const [carouselIndexes, setCarouselIndexes] = useState({});

  const handlePrev = (slug) => {
    const list = newsBySlug[slug] || [];
    if (list.length === 0) return;
    setCarouselIndexes((prev) => ({
      ...prev,
      [slug]: ((prev[slug] || 0) - 1 + list.length) % list.length
    }));
  };

  const handleNext = (slug) => {
    const list = newsBySlug[slug] || [];
    if (list.length === 0) return;
    setCarouselIndexes((prev) => ({
      ...prev,
      [slug]: ((prev[slug] || 0) + 1) % list.length
    }));
  };
  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Tin nổi bật', href: '/tin-noi-bat' }
  ];
  return (
    <NewsContext.Provider value={{ stripHTML, featuredNews, setfeaturedNews }}>
      <div className="max-w-[1200px] mx-auto w-full px-4 lg:px-0">
        <div className="mb-3 pt-4 sm:pt-4 lg:pt-0">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_390px] gap-4 px-0 md:px-4 lg:px-0">
          {/* TopNews */}
          <div className="w-full py-4 md:py-0">
            <TopNews getAllTitle={getAllTitle} />
          </div>

          {/* Sidebar */}
          <div className="w-full">
            <SibarTop />
          </div>
        </div>

        <div className="my-5">
          <Carousel title="Nhà Bếp" items={newsBySlug['nha-bep'] || []} visibleCount={5} autoautoScroll={true} />
        </div>
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-x-6 px-0 md:px-4 lg:px-0">
          <div className="w-full lg:w-4/6 min-w-0">
            <MidNews title="Làm mát & Điều hòa không khí" items={newsBySlug['lam-mat-dieu-hoa-khong-khi'] || []} visibleCount={3} />
          </div>
          <div className="w-full lg:w-1/3 min-w-0">
            <SibarMid title="Giải trí & Thiết bị nghe nhìn" items={newsBySlug['giai-tri-thiet-bi-nghe-nhin'] || []} visibleCount={5} />
          </div>
        </div>

        <div className="my-5">
          <Carousel2
            title="Bảo quản thực phẩm"
            items={newsBySlug['bao-quan-thuc-pham'] || []}
            currentIndex={carouselIndexes['bao-quan-thuc-pham'] || 0}
            visibleCount={5}
            onPrev={() => handlePrev('bao-quan-thuc-pham')}
            onNext={() => handleNext('bao-quan-thuc-pham')}
          />
        </div>
        {/* <div className="my-5">
          <Card />
        </div> */}
        <div className="my-5">
          <Carousel title="Giặt ủi" items={newsBySlug['giat-ui'] || []} currentIndex={carouselIndex} visibleCount={5} />
        </div>
      </div>
    </NewsContext.Provider>
  );
};

export default News;
