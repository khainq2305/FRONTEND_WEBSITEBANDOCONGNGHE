import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { notificationService } from '../../../services/admin/notificationService';

const NotificationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    notificationService.getById(id)
      .then((res) => setData(res))
      .catch((err) => {
        console.error('❌ Lỗi lấy chi tiết:', err);
        navigate('/admin/notifications');
      });
  }, [id, navigate]);

  if (!data) return <p className="p-6">Đang tải...</p>;

  return (
    <div className="w-full px-6 py-8">
      <div className="bg-white border border-gray-200 shadow p-6 space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Chi tiết thông báo</h2>
          <button
            onClick={() => navigate('/admin/notifications')}
            className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Trở về danh sách
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-gray-700">
          <p><strong>Tiêu đề:</strong> {data.title}</p>
          <p><strong>Link:</strong> <a href={data.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{data.link}</a></p>
          <p className="md:col-span-2"><strong>Nội dung:</strong> {data.message}</p>
          <p><strong>Gửi toàn bộ:</strong> {data.isGlobal ? 'Có' : 'Không'}</p>
          <p><strong>Hiển thị:</strong> {data.isActive ? 'Có' : 'Không'}</p>
          <p><strong>Loại:</strong> {data.type}</p>
          <p><strong>Target:</strong> {data.targetType} #{data.targetId}</p>
          <p><strong>Ngày tạo:</strong> {new Date(data.createdAt).toLocaleString()}</p>
        </div>

        {data.imageUrl && (
          <div className="pt-4">
            <p className="mb-2 font-medium text-gray-700">Ảnh minh hoạ:</p>
            <img
              src={data.imageUrl}
              alt="thumbnail"
              className="w-[250px] h-auto border border-gray-300"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDetail;
