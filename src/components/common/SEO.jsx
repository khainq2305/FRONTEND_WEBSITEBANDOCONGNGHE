import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  ogTitle, 
  ogDescription, 
  ogImage, 
  twitterTitle, 
  twitterDescription, 
  twitterImage,
  canonicalUrl,
  robots,
  schema
}) => {
  const siteName = "Tech Shop"; // Default site name

  // Xử lý robots metadata từ database JSON
  const getRobotsContent = (robotsData) => {
    if (typeof robotsData === 'object' && robotsData !== null) {
      const robotsArray = [];
      if (robotsData.index === false || robotsData.isNoIndex) robotsArray.push('noindex');
      if (robotsData.follow === false || robotsData.isNoFollow) robotsArray.push('nofollow');
      if (robotsData.archive === false) robotsArray.push('noarchive');
      if (robotsData.snippet === false) robotsArray.push('nosnippet');
      if (robotsData.imageIndex === false) robotsArray.push('noimageindex');
      
      return robotsArray.length > 0 ? robotsArray.join(', ') : 'index, follow';
    }
    if (typeof robotsData === 'string') return robotsData;
    return 'index, follow'; // default
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={getRobotsContent(robots)} />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="article" />
      <meta property="og:site_name" content={siteName} />
      {(ogTitle || title) && <meta property="og:title" content={ogTitle || title} />}
      {(ogDescription || description) && <meta property="og:description" content={ogDescription || description} />}
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      {(twitterTitle || ogTitle || title) && <meta name="twitter:title" content={twitterTitle || ogTitle || title} />}
      {(twitterDescription || ogDescription || description) && <meta name="twitter:description" content={twitterDescription || ogDescription || description} />}
      {(twitterImage || ogImage) && <meta name="twitter:image" content={twitterImage || ogImage} />}
      
      {/* Schema markup từ database */}
      {schema && (
        <script type="application/ld+json">
          {typeof schema === 'string' ? schema : JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
