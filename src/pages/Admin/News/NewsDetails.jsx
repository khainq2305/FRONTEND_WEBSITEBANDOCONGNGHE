import { newsService } from '@/services/admin/postService';
import { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { MoveLeft } from 'lucide-react';
import formatDateFlexible from '@/utils/formatCurrentDateTime';
import {CLOUDINARY_BASE_URL} from '@/config/apiEndpoints'
const img = 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2024_4_28_638499448585792760_rsz_bia-5.jpg';
const NewsDetails = () => {
  const { slug } = useParams();
  const [post, setPost] = useState({});
  const navigate = useNavigate();
  const fechPost = async () => {
    try {
      const res = await newsService.getBySlug(slug);
      setPost(res.data.data);
    } catch (error) {
      console.error('Lỗi khi tải bài viết', error);
    }
  };

  useEffect(() => {
    fechPost();
  }, []);

  return (
    <div className="flex gap-6">
      <div className="flex-1 overflow-y-auto max-h-screen pb-8 pr-4 scrollbar-hide">
        {/* Nút quay lại */}
        <div className="mb-4">
          <Button
            variant="contained"
            onClick={() => {
              navigate(`/admin/quan-ly-bai-viet`);
            }}
          >
            <MoveLeft size={16} style={{ marginRight: '6px' }} /> Quay lại
          </Button>
        </div>
        <h1 className="text-1xl md:text-4xl font-bold mb-4 text-justify">{post.title}</h1>

        <div className="flex items-center gap-3 mb-4 text-sm text-gray-600">
          <img src={'f' || 'c'} alt="Tác giả" className="w-9 h-9 rounded-full" />
          <span>
            Bởi {'' || 'Ẩn danh'} - {formatDateFlexible(post.createdAt, { showWeekday: true })}
          </span>
        </div>

        <div className="w-full flex justify-center px-4">
          <div className="prose prose-sm md:prose-lg max-w-3xl w-full">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </div>
      </div>

      <div className="w-64 shrink-0 text-black/80">
        <div>
          <div className="mb-3 NewDetails">Ảnh đại diện</div>
          <div className="mb-3 w-full">
            <img src={`${CLOUDINARY_BASE_URL}/${post.thumbnail}`} alt="" className="rounded border-1 border-gray-200" />
          </div>
        </div>
        <div className="sticky top-6 bg-white p-4 shadow rounded border border-gray-300 text-sx">
          <div className="mb-1 NewDetails">Tác giả: <b>{post.author?.fullName || 'Lỗi hiển thị'}</b></div>
          {post.publishAt ? (
            <div className="mb-1 NewDetails">Thời gian đăng: {formatDateFlexible(post.publishAt)}</div>
          ) : (
            <div className="mb-1 NewDetails">Ngày đăng: {formatDateFlexible(post.createdAt)}</div>
          )}
          {post.updatedAt && <div className="mb-1 NewDetails">Đã chỉnh sửa: {formatDateFlexible(post.updatedAt)}</div>}
          <div className="mb-1 NewDetails flex gap-1">
            Trạng thái: <p
              className={`mb-1 NewDetails font-semibold ${
                post.status === 1 ? 'text-green-600' : post.status === 0 ? 'text-gray-500' : 'text-orange-500'
              }`}
            >
              {post.status === 1 ? 'Đã xuất bản' : post.status === 0 ? 'Bản nháp' : 'Hẹn giờ đăng'}
            </p>
          </div>
          <div className="mb-1 NewDetails">Danh mục: {post.category?.name || 'Lỗi hiển thị'}</div>
          <div className="mb-1 NewDetails flex">
            <div>Tags:</div>
            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-0.5">
                {post.tags.map((item, index) => (
                  <span key={index} className="ml-1 bg-gray-400 text-white font-light px-1 py-0.5 text-xs rounded mt-1">
                    {item.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mb-1">
            <a href={`/admin/quan-ly-bai-viet/chinh-sua-bai-viet/${slug}`} className="text-xs leading-none text-blue-400 underline">
              Chỉnh sửa
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetails;
