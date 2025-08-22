const Main = ({ post }) => {
  if (!post) return null;
  console.log(post)
  return (
    <div className="pb-8">
      <h1 className="text-1xl md:text-4xl font-bold mb-4 text-justify">{post.title}</h1>

      <div className="flex items-center gap-3 mb-4 text-sm text-gray-600">
        <img src={post.author?.avatarUrl} alt="Tác giả" className="w-9 h-9 rounded-full" />
        <span>Bởi { post.author?.fullName || 'Ẩn danh'} - {new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
      </div>

      {/* ✅ Nội dung gốc có ảnh + chữ */}
      <div
        className="prose prose-sm md:prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></div>
    </div>
  );
};
export default Main
