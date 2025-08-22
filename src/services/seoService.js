import { createSitemapData } from '../utils/seoUtils';

/**
 * Tạo sitemap cho website
 */
export const generateSitemap = async () => {
  try {
    // Static pages
    const staticPages = [
      {
        url: '/',
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 1.0
      },
      {
        url: '/dang-nhap',
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.3
      },
      {
        url: '/dang-ky',
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.3
      },
      {
        url: '/tin-tuc',
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.7
      },
      {
        url: '/gio-hang',
        lastmod: new Date().toISOString(),
        changefreq: 'never',
        priority: 0.1
      },
      {
        url: '/tra-cuu-don-hang',
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.4
      },
      {
        url: '/so-sanh-san-pham',
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.4
      }
    ];

    // Dynamic pages sẽ được thêm từ API
    // const categoryPages = await fetchCategoryPages();
    // const productPages = await fetchProductPages();
    // const newsPages = await fetchNewsPages();

    const allPages = [
      ...staticPages,
      // ...categoryPages,
      // ...productPages,
      // ...newsPages
    ];

    return createSitemapData(allPages);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return [];
  }
};

/**
 * Tạo XML sitemap
 */
export const generateSitemapXML = async () => {
  const sitemapData = await generateSitemap();
  
  const urlEntries = sitemapData.map(page => `
  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
};

/**
 * Tạo robots.txt
 */
export const generateRobotsTxt = () => {
  const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'https://dienthoaigiakho.vn';
  
  return `User-agent: *
Allow: /

# SEO-friendly URLs
Allow: /san-pham/
Allow: /danh-muc/
Allow: /tin-tuc/

# Block admin and sensitive pages
Disallow: /admin/
Disallow: /auth/
Disallow: /api/
Disallow: /thanh-toan/
Disallow: /gio-hang/
Disallow: /*?*
Disallow: *.json$
Disallow: *.js$
Disallow: *.css$

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay
Crawl-delay: 1`;
};
