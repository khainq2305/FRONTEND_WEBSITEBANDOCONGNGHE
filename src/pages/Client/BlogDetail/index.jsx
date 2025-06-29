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
import { Helmet } from 'react-helmet';

const NewsDetails = () => {
    const { slug } = useParams(); // 👈 Lấy slug từ URL
    const [newsDetails, setnewsDetails] = useState(null); // 👈 Khởi tạo state
    const [related, setRelated] = useState([])
    const [featuredNews, setfeaturedNews] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fechNewsDetaisl = async () => {
          try {
            setLoading(true);
            setError(null);
            console.log('🔄 Fetching news detail for slug:', slug);
            const res = await newsSevice.getBySlug(slug); // gọi API thật
            console.log('📥 News detail response:', res);
            
            if (res?.data?.data) {
              console.log('✅ News detail loaded:', res.data.data);
              setnewsDetails(res.data.data);
            } else {
              console.warn('⚠️ No news data found');
              setError('Không tìm thấy bài viết');
            }
          } catch (error) {
            console.error('❌ Lỗi lấy tin tức:', error);
            setError('Có lỗi xảy ra khi tải bài viết');
          } finally {
            setLoading(false);
          }
        };
        
        if (slug) {
          fechNewsDetaisl();
        }
      }, [slug]);

    useEffect(() => {
        const getRelated = async () => {
            try {
                console.log('🔄 Fetching related posts for slug:', slug);
                const res = await newsSevice.getRelated(slug)
                console.log('📥 Related posts response:', res);
                
                if (res?.data?.data) {
                  console.log('✅ Related posts loaded:', res.data.data);
                  setRelated(res.data.data);
                }
            } catch (error) {
                console.error('❌ Lỗi lấy bài viết liên quan:', error);
            }
        }
        
        if (slug) {
          getRelated();
        }
    }, [slug])

    useEffect(() => {
        const fetchFeature = async () => {
          try {
            console.log('🔄 Fetching featured posts');
            const res = await newsSevice.getFeature(); // gọi API thật
            console.log('📥 Featured posts response:', res);
            
            if (res?.data?.data) {
              console.log('✅ Featured posts loaded:', res.data.data);
              setfeaturedNews(res.data.data);
            }
          } catch (error) {
            console.error('❌ Lỗi lấy tin tức nổi bật:', error);
          }
        };
        fetchFeature();
      }, []);

    // Loading state
    if (loading) {
        return (
            <div className="max-w-screen-xl mx-auto w-full px-4">
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải bài viết...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="max-w-screen-xl mx-auto w-full px-4">
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="text-center">
                        <div className="text-red-500 text-xl mb-4">⚠️</div>
                        <p className="text-gray-600">{error}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // No data state
    if (!newsDetails) {
        return (
            <div className="max-w-screen-xl mx-auto w-full px-4">
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="text-center">
                        <p className="text-gray-600">Không tìm thấy bài viết</p>
                    </div>
                </div>
            </div>
        );
    }

    // Prepare SEO data
    const seoData = newsDetails.seoData || {};
    const pageTitle = seoData.title || newsDetails.title || 'Bài viết';
    const metaDescription = seoData.metaDescription || newsDetails.title || '';
    const focusKeyword = seoData.focusKeyword || '';
    const canonicalUrl = seoData.canonicalUrl || `${window.location.origin}/tin-tuc/${slug}`;
    const thumbnailUrl = newsDetails.thumbnail ? 
        (newsDetails.thumbnail.startsWith('http') ? 
            newsDetails.thumbnail : 
            `http://localhost:5000/uploads/${newsDetails.thumbnail}`) : '';

    return (
        <>
            {/* SEO Meta Tags */}
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={metaDescription} />
                {focusKeyword && <meta name="keywords" content={focusKeyword} />}
                <link rel="canonical" href={canonicalUrl} />
                
                {/* Open Graph Tags */}
                <meta property="og:title" content={seoData.socialMeta?.facebook?.title || pageTitle} />
                <meta property="og:description" content={seoData.socialMeta?.facebook?.description || metaDescription} />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:type" content="article" />
                {thumbnailUrl && <meta property="og:image" content={thumbnailUrl} />}
                
                {/* Twitter Card Tags */}
                <meta name="twitter:card" content={seoData.socialMeta?.twitter?.cardType || "summary_large_image"} />
                <meta name="twitter:title" content={seoData.socialMeta?.twitter?.title || pageTitle} />
                <meta name="twitter:description" content={seoData.socialMeta?.twitter?.description || metaDescription} />
                {thumbnailUrl && <meta name="twitter:image" content={thumbnailUrl} />}
                
                {/* Robots Meta */}
                {seoData.robots && (
                    <meta name="robots" content={
                        [
                            seoData.robots.index ? 'index' : 'noindex',
                            seoData.robots.follow ? 'follow' : 'nofollow',
                            seoData.robots.archive ? 'archive' : 'noarchive',
                            seoData.robots.snippet ? 'snippet' : 'nosnippet',
                            seoData.robots.imageIndex ? 'imageindex' : 'noimageindex'
                        ].join(', ')
                    } />
                )}
            </Helmet>

            <div className="max-w-screen-xl mx-auto w-full px-4">
                <div className='py-4'>
                    <nav className='text-xs md:text-sm text-gray-600'>
                        <span>Bài viết</span>
                        {newsDetails.category && (
                            <>
                                <span className="mx-2">/</span>
                                <span>{newsDetails.category.name}</span>
                            </>
                        )}
                        <span className="mx-2">/</span>
                        <span className="text-blue-600">{newsDetails.title}</span>
                    </nav>
                </div>
                <div className='flex flex-col lg:flex-row gap-4'>
                    <div className="w-full lg:flex-[3]">
                        <div className='pb-5'><Main post={newsDetails} /></div>
                        <div className='pb-5'><Tags /></div>
                        <div className='py-5 mb-4'><RelatedPosts title='Bài viết liên quan' related={related}/></div>
                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:flex-[1.5] pb-4 md:pb-0">
                        <div className='pb-3'><Sibar title='Tin Khuyến mãi' /></div>
                        <div className='pt-3'><Sibar2 title='Bài viết mới nhất' featuredNews={featuredNews} /></div>
                        <div className='pt-3'><Sibar3 title='Từ khóa gợi ý' /></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NewsDetails;
