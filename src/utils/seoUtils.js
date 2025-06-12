/**
 * Utility functions for creating SEO-friendly URLs
 */

/**
 * Tạo slug từ chuỗi tiếng Việt
 * @param {string} str - Chuỗi cần chuyển thành slug
 * @returns {string} - Slug SEO-friendly
 */
export const createSlug = (str) => {
  if (!str) return '';
  
  // Chuyển thành chữ thường
  str = str.toLowerCase();
  
  // Xóa dấu tiếng Việt
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  
  // Xóa các ký tự đặc biệt
  str = str.replace(/[^a-z0-9 -]/g, '');
  
  // Thay thế khoảng trắng và nhiều dấu gạch ngang liên tiếp bằng một dấu gạch ngang
  str = str.replace(/\s+/g, '-').replace(/-+/g, '-');
  
  // Xóa dấu gạch ngang ở đầu và cuối
  str = str.replace(/^-+|-+$/g, '');
  
  return str;
};

/**
 * Tạo URL cho sản phẩm
 * @param {string} slug - Slug của sản phẩm
 * @returns {string} - URL đầy đủ
 */
export const createProductUrl = (slug) => {
  return `/san-pham/${slug}`;
};

/**
 * Tạo URL cho danh mục
 * @param {string} slug - Slug của danh mục
 * @returns {string} - URL đầy đủ
 */
export const createCategoryUrl = (slug) => {
  return `/danh-muc/${slug}`;
};

/**
 * Tạo URL cho tin tức
 * @param {string} slug - Slug của tin tức
 * @returns {string} - URL đầy đủ
 */
export const createNewsUrl = (slug) => {
  return `/tin-tuc/${slug}`;
};

/**
 * Tạo breadcrumb cho SEO
 * @param {Array} items - Mảng các item breadcrumb
 * @returns {Object} - Structured data cho breadcrumb
 */
export const createBreadcrumbStructuredData = (items) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url ? `${import.meta.env.VITE_APP_BASE_URL || 'https://dienthoaigiakho.vn'}${item.url}` : undefined
    }))
  };
};

/**
 * Tạo structured data cho sản phẩm
 * @param {Object} product - Thông tin sản phẩm
 * @returns {Object} - Structured data cho sản phẩm
 */
export const createProductStructuredData = (product) => {
  const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'https://dienthoaigiakho.vn';
  
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.images?.map(img => img.url) || [],
    "sku": product.sku,
    "brand": {
      "@type": "Brand",
      "name": product.brand?.name || "Điện Thoại Giá Kho"
    },
    "offers": {
      "@type": "Offer",
      "url": `${baseUrl}/san-pham/${product.slug}`,
      "priceCurrency": "VND",
      "price": product.price,
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Điện Thoại Giá Kho"
      }
    },
    ...(product.rating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating,
        "reviewCount": product.reviewCount || 0
      }
    })
  };
};

/**
 * Tạo structured data cho tổ chức
 * @returns {Object} - Structured data cho tổ chức
 */
export const createOrganizationStructuredData = () => {
  const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'https://dienthoaigiakho.vn';
  
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Điện Thoại Giá Kho",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "description": "Cửa hàng điện thoại uy tín với giá cả phải chăng, đa dạng mẫu mã từ các thương hiệu nổi tiếng",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+84-xxx-xxx-xxx",
      "contactType": "customer service"
    },
    "sameAs": [
      // Thêm các link mạng xã hội
    ]
  };
};

/**
 * Chuẩn hóa URL (loại bỏ trailing slash, chuyển thành lowercase)
 * @param {string} url - URL cần chuẩn hóa
 * @returns {string} - URL đã chuẩn hóa
 */
export const normalizeUrl = (url) => {
  if (!url) return '';
  
  // Loại bỏ trailing slash (trừ root path)
  if (url.length > 1 && url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  
  return url;
};

/**
 * Tạo sitemap data
 * @param {Array} pages - Danh sách các trang
 * @returns {Array} - Sitemap data
 */
export const createSitemapData = (pages) => {
  const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'https://dienthoaigiakho.vn';
  
  return pages.map(page => ({
    url: `${baseUrl}${normalizeUrl(page.url)}`,
    lastmod: page.lastmod || new Date().toISOString(),
    changefreq: page.changefreq || 'weekly',
    priority: page.priority || 0.5
  }));
};
