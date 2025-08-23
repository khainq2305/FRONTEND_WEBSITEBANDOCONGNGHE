import React from 'react';
import Main from './Main';
import Sibar from './Sibar';
import Sibar2 from './Sibar2';
import Sibar3 from './Sibar3';
import RelatedPosts from './RelatedPosts';
import { useEffect, useState } from 'react';
import { newsSevice } from '@/services/client/newsService';
import { useParams } from 'react-router-dom';
import Tags from './Tag';
import Breadcrumb from '@/components/common/Breadcrumb';
const NewsDetails = () => {
  const { slug } = useParams();
  const [newsDetails, setnewsDetails] = useState(null);
  const [related, setRelated] = useState([]);
  const [featuredNews, setfeaturedNews] = useState([]);
  useEffect(() => {
    const fechNewsDetaisl = async () => {
      try {
        const res = await newsSevice.getBySlug(slug);
        setnewsDetails(res.data.data);
      } catch (error) {
        console.error('Lỗi lấy tin tức:', error);
      }
    };
    fechNewsDetaisl();
  }, [slug]);
  useEffect(() => {
    const getRelated = async () => {
      try {
        const res = await newsSevice.getRelated(slug);
        console.log('bai viet liwn quan', res.data.data);
        setRelated(res.data.data);
      } catch (error) {
        console.error('Lỗi lấy tin tức:', error);
      }
    };
    getRelated();
  }, [slug]);
  useEffect(() => {
    const fetchFeature = async () => {
      try {
        const res = await newsSevice.getFeature();
        console.log('bai viet moi nhat', res.data.data);
        setfeaturedNews(res.data.data);
      } catch (error) {
        console.error('Lỗi lấy tin tức:', error);
      }
    };
    fetchFeature();
  }, []);
  const breadcrumbItems = [{ label: 'Trang chủ', href: '/' }, { label: 'Tin nổi bật', href: '/tin-noi-bat' }, { label: newsDetails?.title || 'Loading...', href: `/tin-noi-bat/${slug}` },];
  return (
    <>
      <div className="max-w-[1280px] mx-auto w-full px-4 lg:px-0">
      <div className="mb-3 pt-4 sm:pt-4 lg:pt-0">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:flex-[3]">
            <div className="pb-5">
              <Main post={newsDetails} />
            </div>
            <div className="pb-5">
              <Tags />
            </div>
            <div className="py-5 mb-4">
              <RelatedPosts title="Bài viết liên quan" related={related} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:flex-[1.5] pb-4 md:pb-0">
            <div className="pb-3">
              <Sibar title="Tin Khuyến mãi" />
            </div>
            <div className="pt-3">
              <Sibar2 title="Bài viết mới nhất" featuredNews={featuredNews} />
            </div>
            <div className="pt-3">
              <Sibar3 title="Từ khóa gợi ý" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewsDetails;
