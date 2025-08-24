import React, { useEffect, useState } from 'react';
import Main from './Main';
import Sibar from './Sibar';
import Sibar2 from './Sibar2';
import Sibar3 from './Sibar3';
import RelatedPosts from './RelatedPosts';
import { newsSevice } from '@/services/client/newsService';
import { useParams } from 'react-router-dom';
import Tags from './Tag';
import Breadcrumb from '@/components/common/Breadcrumb';
import { Helmet } from 'react-helmet';
import { seoService } from '@/services/admin/seoService';

const NewsDetails = () => {
    const { slug } = useParams(); // 👈 Lấy slug từ URL
    const [newsDetails, setnewsDetails] = useState(null); // 👈 Khởi tạo state
    const [related, setRelated] = useState([])
    const [featuredNews, setfeaturedNews] = useState([])
    const [seoConfig, setSeoConfig] = useState(null); // 👈 Thêm state cho SEO config
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

    // 👈 Thêm useEffect để lấy SEO config
    useEffect(() => {
        const fetchSeoConfig = async () => {
            try {
                console.log('🔄 Fetching SEO config');
                const res = await seoService.getSEOConfig(); // Lấy SEO config
                console.log('📥 SEO config response:', res);
                
                if (res?.data?.data) {
                    console.log('✅ SEO config loaded:', res.data.data);
                    setSeoConfig(res.data.data);
                }
            } catch (error) {
                console.error('❌ Lỗi lấy SEO config:', error);
                // Set default config nếu không lấy được
                setSeoConfig({
                    enableOpenGraph: true,
                    enableTwitterCard: true,
                    enableJsonLd: true
                });
            }
        };
        fetchSeoConfig();
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

    // Prepare SEO data với safe string conversion
    const seoData = newsDetails.seoData || {};
    const pageTitle = seoData.title || newsDetails.title || 'Bài viết';
    const metaDescription = seoData.metaDescription || newsDetails.title || '';
    const focusKeyword = seoData.focusKeyword || '';
    const canonicalUrl = seoData.canonicalUrl || (typeof window !== 'undefined' ? `${window.location.origin}/tin-tuc/${slug}` : `/tin-tuc/${slug}`);
    const thumbnailUrl = newsDetails.thumbnail ? 
        (newsDetails.thumbnail.startsWith('http') ? 
            newsDetails.thumbnail : 
            `http://localhost:5000/uploads/${newsDetails.thumbnail}`) : '';

    // Safe conversion cho Twitter Card data
    const safeTwitterCard = String(seoData.socialMeta?.twitter?.cardType || "summary_large_image");
    const safeTwitterTitle = String(seoData.socialMeta?.twitter?.title || pageTitle);
    const safeTwitterDescription = String(seoData.socialMeta?.twitter?.description || metaDescription);
    
    // Safe conversion cho Open Graph data  
    const safeOgTitle = String(seoData.socialMeta?.facebook?.title || pageTitle);
    const safeOgDescription = String(seoData.socialMeta?.facebook?.description || metaDescription);
    
    const schemaMarkup = seoData.schema;
    const breadcrumbItems = [{ label: 'Trang chủ', href: '/' }, { label: 'Tin nổi bật', href: '/tin-noi-bat' }, { label: newsDetails?.title || 'Loading...', href: `/tin-noi-bat/${slug}` },];
    return (
        <>
            {/* SEO Meta Tags */}
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={metaDescription} />
                {focusKeyword && <meta name="keywords" content={focusKeyword} />}
                <link rel="canonical" href={canonicalUrl} />
                
                {/* Open Graph Tags - Conditional rendering */}
                {seoConfig?.enableOpenGraph ? (
                    <meta property="og:title" content={safeOgTitle} />
                ) : null}
                {seoConfig?.enableOpenGraph ? (
                    <meta property="og:description" content={safeOgDescription} />
                ) : null}
                {seoConfig?.enableOpenGraph ? (
                    <meta property="og:url" content={canonicalUrl} />
                ) : null}
                {seoConfig?.enableOpenGraph ? (
                    <meta property="og:type" content="article" />
                ) : null}
                {seoConfig?.enableOpenGraph && thumbnailUrl ? (
                    <meta property="og:image" content={thumbnailUrl} />
                ) : null}
                
                {/* Twitter Card Tags - Conditional rendering */}
                {seoConfig?.enableTwitterCard ? (
                    <meta name="twitter:card" content={safeTwitterCard} />
                ) : null}
                {seoConfig?.enableTwitterCard ? (
                    <meta name="twitter:title" content={safeTwitterTitle} />
                ) : null}
                {seoConfig?.enableTwitterCard ? (
                    <meta name="twitter:description" content={safeTwitterDescription} />
                ) : null}
                {seoConfig?.enableTwitterCard && thumbnailUrl ? (
                    <meta name="twitter:image" content={thumbnailUrl} />
                ) : null}
                
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

                {/* JSON-LD Schema Markup - Conditional rendering */}
                {seoConfig?.enableJsonLd && schemaMarkup ? (
                    <script type="application/ld+json">
                        {JSON.stringify(schemaMarkup)}
                    </script>
                ) : null}
            </Helmet>

            <div className="max-w-[1200px] mx-auto w-full px-4 lg:px-0">
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
