import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

// Component giờ sẽ nhận props `specs` từ component cha
export default function TechnicalSpec({ specs = [] }) {
  const [showSpecModal, setShowSpecModal] = useState(false);
  
  const [fullSpecs, setFullSpecs] = useState([]);

  useEffect(() => {
    // Ngăn cuộn trang khi modal mở
    if (showSpecModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup function khi component unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showSpecModal]);

  // Xử lý dữ liệu động
  useEffect(() => {
    if (!specs || specs.length === 0) {
      setFullSpecs([]);
      return;
    }

    const groupedSpecs = specs.reduce((acc, spec) => {
      const group = spec.specGroup || "Thông số khác"; 
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push([spec.specKey, spec.specValue]);
      return acc;
    }, {});

    const processedFullSpecs = Object.entries(groupedSpecs).map(([title, data]) => ({
      title,
      data,
    }));
    setFullSpecs(processedFullSpecs);

  }, [specs]); 


  const SpecModal = () => {
    const modalContentRef = useRef(null);

    const handleBackdropClick = (e) => {
      if (modalContentRef.current && !modalContentRef.current.contains(e.target)) {
        setShowSpecModal(false);
      }
    };

    return (
      <div 
        className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4"
        onMouseDown={handleBackdropClick}
      >
        <div ref={modalContentRef} className="bg-white max-w-xl w-full rounded-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 bg-primary text-white flex-shrink-0">
            <h2 className="text-lg font-bold">Thông số kỹ thuật</h2>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 transition-colors"
              onClick={() => setShowSpecModal(false)}
              aria-label="Đóng"
            >
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Content */}
          <div className="text-sm text-gray-800 space-y-4 p-4 overflow-y-auto bg-gray-50">
            {fullSpecs.map((section, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <h3 className="font-semibold bg-gray-100 px-4 py-2.5 text-gray-800 border-b border-gray-200">
                  {section.title}
                </h3>
                <div className="divide-y divide-gray-100">
                  {section.data.map(([label, value], i) => (
                    <div key={i} className="flex justify-between items-start gap-4 px-4 py-2.5">
                      <span className="text-gray-600 w-2/5">{label}</span>
                      <span className="text-right w-3/5 font-semibold text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Footer */}
          <div className="flex-shrink-0 p-3 border-t border-gray-200 bg-white">
            <button
              onClick={() => setShowSpecModal(false)}
              className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    )
  };

  if (fullSpecs.length === 0) {
      return null;
  }

  return (
    <>
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-sm">
        {/* ✅ TIÊU ĐỀ CHÍNH CĂN GIỮA */}
        <h2 className="text-center font-bold text-lg mb-4 text-gray-800">
          Thông số kỹ thuật
        </h2>
        
        {/* ✅ GIAO DIỆN MỚI CHO PHẦN TÓM TẮT */}
        <div className="space-y-4">
          {fullSpecs.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              {/* Tiêu đề nhóm với nền xám */}
              <h3 className="font-semibold bg-gray-100 rounded-md px-3 py-2 text-gray-700">
                {section.title}
              </h3>
              {/* Các dòng thông số */}
              <div className="mt-2 space-y-2">
                {section.data.map(([label, value], specIdx) => (
                  <div key={specIdx} className="flex justify-between items-start text-xs px-2">
                    <p className="text-gray-600 w-2/5">{label}</p>
                    <p className="text-gray-800 font-medium w-3/5 text-right">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowSpecModal(true)}
          className="w-full mt-4 bg-primary text-white py-2 rounded-md hover:opacity-90 transition-all text-sm font-semibold"
        >
          Xem chi tiết cấu hình
        </button>
      </div>

      {showSpecModal && ReactDOM.createPortal(
        <SpecModal />,
        document.body
      )}
    </>
  );
}
