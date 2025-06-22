import React, { useEffect, useState } from 'react';
import { XMarkIcon, ChevronDownIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate, useLocation } from 'react-router-dom';

const MAX_COMPARE = 3;

const CompareBar = () => {
  const [items, setItems] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

    //Nếu đang ở trang /compare-products thì ẩn thanh bar
  if (location.pathname.startsWith('/compare-products')) return null;

  //Clear compareIds khi quay lại trang chủ
useEffect(() => {
  //Chỉ khi quay về TRANG CHỦ thì xoá compareIds
  if (location.pathname === '/') {
    localStorage.removeItem('compareIds');
    localStorage.removeItem('compareBarCollapsed');
    setItems([]); // cập nhật lại UI
  }
}, [location.pathname]);


  // Load trạng thái thu gọn từ localStorage
  useEffect(() => {
    const collapsedState = localStorage.getItem('compareBarCollapsed');
    if (collapsedState === 'true') setIsCollapsed(true);
  }, []);

  // Lưu lại trạng thái mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem('compareBarCollapsed', isCollapsed.toString());
  }, [isCollapsed]);

  // Cập nhật danh sách và xử lý khi đang thu gọn mà có thay đổi
  useEffect(() => {
    const handleCompareChange = () => {
      const compareList = JSON.parse(localStorage.getItem('compareIds') || '[]');
      const newList = compareList.slice(0, MAX_COMPARE);
      if (isCollapsed && newList.length !== items.length) {
        setIsCollapsed(false);
      }
      setItems(newList);
    };

    window.addEventListener('storage', handleCompareChange);
    return () => window.removeEventListener('storage', handleCompareChange);
  }, [isCollapsed, items.length]);

  // Đồng bộ dữ liệu ban đầu
  useEffect(() => {
    const syncFromStorage = () => {
      const data = JSON.parse(localStorage.getItem('compareIds') || '[]');
      setItems(data.slice(0, MAX_COMPARE));
    };
    syncFromStorage();
    window.addEventListener('storage', syncFromStorage);
    return () => window.removeEventListener('storage', syncFromStorage);
  }, []);

  // Auto hiển thị lại nếu rỗng
  useEffect(() => {
    if (items.length === 0 && isCollapsed) {
      setIsCollapsed(false);
      localStorage.removeItem('compareBarCollapsed');
    }
  }, [items, isCollapsed]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > window.innerHeight / 2);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRemove = (id) => {
    const updated = items.filter((p) => p.id !== id);
    localStorage.setItem('compareIds', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const handleClearAll = () => {
    localStorage.removeItem('compareIds');
    window.dispatchEvent(new Event('storage'));
  };

  const handleCompare = () => {
    if (items.length >= 2) {
      const ids = items.map((p) => p.id).join(',');
      navigate(`/compare-products?ids=${ids}`);
    }
  };

  if (items.length === 0) return null;

  const columns = [...items];
  while (columns.length < MAX_COMPARE) columns.push(null);

  return (
    <>
      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="fixed bottom-4 left-4 z-[110] bg-white border border-gray-300 rounded-full shadow-md px-3 py-1 flex items-center gap-1 text-blue-600 text-sm hover:bg-gray-50 transition-all"
        >
          <ArrowsRightLeftIcon className="w-4 h-4" />
          So sánh ({items.length})
        </button>
      )}

      <div
        className={`fixed bottom-0 left-0 w-full bg-white shadow-md border-t border-gray-300 z-[100] transition-all duration-300 ${
          isScrolled ? 'scale-[0.96] translate-y-1' : ''
        }`}
      >
        {!isCollapsed && (
          <div className="absolute -top-6 right-3">
            <button
              onClick={() => setIsCollapsed(true)}
              className="bg-white border px-2 py-1 rounded-t-md shadow text-sm text-gray-700 flex items-center gap-1"
            >
              <ChevronDownIcon className="w-4 h-4" />
              Thu gọn
            </button>
          </div>
        )}

        {!isCollapsed && (
          <div className="flex items-center justify-between max-w-screen-xl mx-auto">
            {columns.map((item, index) => (
              <div
                key={item?.id || `slot-${index}`}
                className="w-1/4 min-h-[120px] px-2 py-2 relative border-r border-gray-200 flex flex-col items-center justify-center"
              >
                {item ? (
                  <>
                    <button onClick={() => handleRemove(item.id)} className="absolute top-1.5 right-2 text-gray-400 hover:text-red-500">
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                    <img src={item.thumbnail} alt={item.name} className="h-[60px] object-contain mb-1" />
                    <p className="text-xs text-center font-medium leading-tight line-clamp-2 px-1">{item.name}</p>
                  </>
                ) : (
                  <div className="text-gray-300 h-[60px] w-full flex flex-col items-center justify-center">
                    <div className="w-12 h-[60px] border border-dashed border-gray-400 mb-1 flex items-center justify-center text-xl text-gray-400">
                      +
                    </div>
                    <p className="text-xs text-gray-500">Thêm sản phẩm</p>
                  </div>
                )}
              </div>
            ))}

            <div className="w-1/4 px-2 py-2 flex flex-col items-center justify-center text-sm">
              <button
                onClick={handleCompare}
                disabled={items.length < 2}
                className={`w-[60%] h-[48px] font-semibold text-base transition-all ${
                  items.length < 2
                    ? 'bg-[#ccc] text-white cursor-not-allowed'
                    : 'bg-[#005eff] hover:bg-[#004ad1] text-white cursor-pointer'
                }`}
              >
                So sánh ngay
              </button>
              <button onClick={handleClearAll} className="text-blue-600 text-xs mt-2 hover:underline">
                Xoá tất cả sản phẩm
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CompareBar;
