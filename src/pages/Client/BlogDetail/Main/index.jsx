const Main = ({ post }) => {
  if (!post) return null;
  console.log(post)
  return (
    <div className="pb-8">
      {/* Article Title */}
      <h1 className="text-2xl md:text-4xl font-bold mb-6 text-gray-900 leading-tight">
        {post.title}
      </h1>

      <div className="flex items-center gap-3 mb-4 text-sm text-gray-600">
        <img src={post.author?.avatarUrl} alt="Tác giả" className="w-9 h-9 rounded-full" />
        <span>Bởi { post.author?.fullName || 'Ẩn danh'} - {new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
      </div>

      {/* Featured Image */}
      {thumbnailUrl && (
        <div className="mb-8">
          <img 
            src={thumbnailUrl} 
            alt={post.title}
            className="w-full h-auto rounded-lg shadow-lg object-cover max-h-96"
            onError={(e) => {
              console.error('❌ Image load error:', e);
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Article Excerpt/Summary (if available) */}
      {post.seoData?.metaDescription && (
        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
          <p className="text-gray-700 italic text-lg leading-relaxed">
            {post.seoData.metaDescription}
          </p>
        </div>
      )}

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        <div
          className="text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      {/* Article Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {post.publishAt && (
              <div>
                <span className="font-medium">Xuất bản:</span> {new Date(post.publishAt).toLocaleDateString('vi-VN')}
              </div>
            )}
            {post.updatedAt && post.updatedAt !== post.createdAt && (
              <div>
                <span className="font-medium">Cập nhật:</span> {new Date(post.updatedAt).toLocaleDateString('vi-VN')}
              </div>
            )}
          </div>
          
          {/* SEO Score Display */}
          {post.seoData?.seoScore && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">SEO Score:</span>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                post.seoData.seoScore >= 80 ? 'bg-green-100 text-green-800' :
                post.seoData.seoScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {post.seoData.seoScore}/100
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;
