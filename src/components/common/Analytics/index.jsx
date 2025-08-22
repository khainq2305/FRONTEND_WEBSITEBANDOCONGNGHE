import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component theo dõi Google Analytics
 */
const GoogleAnalytics = ({ trackingId }) => {
  const location = useLocation();

  useEffect(() => {
    // Chỉ chạy trên client side
    if (typeof window === 'undefined' || !trackingId) return;

    // Load Google Analytics script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${trackingId}', {
        page_title: document.title,
        page_location: window.location.href,
        send_page_view: true
      });
    `;
    document.head.appendChild(script2);

    return () => {
      // Cleanup scripts khi component unmount
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, [trackingId]);

  // Theo dõi thay đổi route
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', trackingId, {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname
      });
    }
  }, [location, trackingId]);

  return null;
};

/**
 * Component theo dõi Facebook Pixel
 */
const FacebookPixel = ({ pixelId }) => {
  useEffect(() => {
    if (typeof window === 'undefined' || !pixelId) return;

    const script = document.createElement('script');
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${pixelId}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);

    // Thêm noscript fallback
    const noscript = document.createElement('noscript');
    const img = document.createElement('img');
    img.height = 1;
    img.width = 1;
    img.style.display = 'none';
    img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`;
    noscript.appendChild(img);
    document.body.appendChild(noscript);

    return () => {
      document.head.removeChild(script);
      document.body.removeChild(noscript);
    };
  }, [pixelId]);

  return null;
};

/**
 * Component tracking cho ecommerce events
 */
export const EcommerceTracking = {
  // Track xem sản phẩm
  viewProduct: (product) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'view_item', {
        currency: 'VND',
        value: parseFloat(product.price),
        items: [{
          item_id: product.id,
          item_name: product.name,
          category: product.category,
          quantity: 1,
          price: parseFloat(product.price)
        }]
      });
    }

    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_ids: [product.id],
        content_type: 'product',
        value: parseFloat(product.price),
        currency: 'VND'
      });
    }
  },

  // Track thêm vào giỏ hàng
  addToCart: (product, quantity = 1) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'add_to_cart', {
        currency: 'VND',
        value: parseFloat(product.price) * quantity,
        items: [{
          item_id: product.id,
          item_name: product.name,
          category: product.category,
          quantity: quantity,
          price: parseFloat(product.price)
        }]
      });
    }

    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'AddToCart', {
        content_ids: [product.id],
        content_type: 'product',
        value: parseFloat(product.price) * quantity,
        currency: 'VND'
      });
    }
  },

  // Track mua hàng
  purchase: (transactionId, items, total) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: transactionId,
        value: parseFloat(total),
        currency: 'VND',
        items: items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          category: item.category,
          quantity: item.quantity,
          price: parseFloat(item.price)
        }))
      });
    }

    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Purchase', {
        value: parseFloat(total),
        currency: 'VND',
        content_ids: items.map(item => item.id),
        content_type: 'product'
      });
    }
  },

  // Track tìm kiếm
  search: (searchTerm) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'search', {
        search_term: searchTerm
      });
    }

    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Search', {
        search_string: searchTerm
      });
    }
  }
};

/**
 * Component tổng hợp tracking
 */
const Analytics = ({ 
  googleAnalyticsId, 
  facebookPixelId,
  children 
}) => {
  return (
    <>
      {googleAnalyticsId && <GoogleAnalytics trackingId={googleAnalyticsId} />}
      {facebookPixelId && <FacebookPixel pixelId={facebookPixelId} />}
      {children}
    </>
  );
};

export default Analytics;
