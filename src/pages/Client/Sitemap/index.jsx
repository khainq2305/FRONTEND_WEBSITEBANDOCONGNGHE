import React, { useEffect, useState } from 'react';
import { productService } from '../../../services/client/productService';
import { categoryService } from '../../../services/client/categoryService';
import { generateSitemapXML } from '../../../services/seoService';

const SitemapPage = () => {
  const [sitemap, setSitemap] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateSitemap = async () => {
      try {
        const sitemapXML = await generateSitemapXML();
        setSitemap(sitemapXML);
      } catch (error) {
        console.error('Error generating sitemap:', error);
        setSitemap('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
      } finally {
        setLoading(false);
      }
    };

    generateSitemap();
  }, []);

  // Set content type cho XML
  useEffect(() => {
    if (!loading && sitemap) {
      // Nếu có thể, set response headers
      if (typeof window !== 'undefined' && window.document) {
        const metaTag = document.createElement('meta');
        metaTag.setAttribute('http-equiv', 'Content-Type');
        metaTag.setAttribute('content', 'application/xml; charset=utf-8');
        document.head.appendChild(metaTag);
      }
    }
  }, [loading, sitemap]);

  if (loading) {
    return (
      <div style={{ padding: '20px', fontFamily: 'monospace' }}>
        Generating sitemap...
      </div>
    );
  }

  return (
    <pre style={{ 
      whiteSpace: 'pre-wrap', 
      fontFamily: 'monospace',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      border: '1px solid #ddd',
      borderRadius: '4px',
      overflow: 'auto'
    }}>
      {sitemap}
    </pre>
  );
};

export default SitemapPage;
