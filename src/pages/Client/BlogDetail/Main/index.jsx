const Main = ({ post }) => {
  if (!post) {
    return (
      <div className="pb-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded mb-4 w-2/3"></div>
          <div className="h-64 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  console.log('📝 Rendering post:', post);

  // Get thumbnail URL
  const thumbnailUrl = post.thumbnail ? 
    (post.thumbnail.startsWith('http') ? 
      post.thumbnail : 
      `http://localhost:5001/uploads/${post.thumbnail}`) : 
    null;

  return (
    <div className="pb-8">
      {/* Article Title */}
      <h1 className="text-2xl md:text-4xl font-bold mb-6 text-gray-900 leading-tight">
        {post.title}
      </h1>

      {/* Article Meta Info */}
      <div className="flex items-center gap-4 mb-6 text-sm text-gray-600 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2">
          {post.author?.avatarUrl ? (
            <img 
              src={post.author.avatarUrl} 
              alt={post.author.fullName || 'Tác giả'} 
              className="w-10 h-10 rounded-full object-cover" 
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              {(post.author?.fullName || 'A').charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="font-medium text-gray-900">
              Bởi {post.author?.fullName || 'Ẩn danh'}
            </div>
            <div className="text-xs text-gray-500">
              {new Date(post.createdAt).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
        
        {post.category && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400">•</span>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
              {post.category.name}
            </div>
          </div>
        )}
        
        {post.seoData?.focusKeyword && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400">•</span>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
              {post.seoData.focusKeyword}
            </div>
          </div>
        )}
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
