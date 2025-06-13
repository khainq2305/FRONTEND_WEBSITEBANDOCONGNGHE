import React, { useState } from 'react';


const TocIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

export default function ProductHighlights({ data }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!data || !data.detailedSections || data.detailedSections.length === 0) {
    return null;
  }

  const collapsedItemCount = 1;
  const canExpand = data.detailedSections.length > collapsedItemCount && data.detailedSections[0]?.content.length > 500; // Ví dụ: chỉ hiện nút khi có nhiều hơn 1 section hoặc section đầu tiên đủ dài
  const itemsToShow = isExpanded ? data.detailedSections : data.detailedSections.slice(0, collapsedItemCount);

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">{data.title}</h2>

      {data.shortFeatures && data.shortFeatures.length > 0 && (
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 mb-6 pl-4">
          {data.shortFeatures.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      )}

      {data.tableOfContents && data.tableOfContents.length > 0 && (
        <div className="border border-gray-300 rounded-md p-4 mb-6 bg-gray-50">
          <div className="flex items-center mb-3">
            <TocIcon className="w-5 h-5 text-gray-600 mr-2" />
            <h3 className="text-md font-semibold text-gray-800">Nội dung chính</h3>
          </div>
          <ul className="space-y-1.5 text-sm">
            {data.tableOfContents.map((item, index) => (
              <li key={index}>
                <a href={`#section-${index}`} className="text-blue-600 hover:text-blue-700 hover:underline">
                  {index + 1}. {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div
        className={`
        prose prose-sm max-w-none text-gray-700 leading-relaxed 
        transition-all duration-300 ease-in-out
        ${!isExpanded && canExpand ? 'max-h-[500px] overflow-hidden relative' : ''}
      `}
      >
        {itemsToShow.map((section, index) => (
          <div key={index} id={`section-${index}`}>
            {section.title && <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">{section.title}</h3>}

            <div dangerouslySetInnerHTML={{ __html: section.content }} />

            {section.points && section.points.length > 0 && (
              <ul className="list-disc list-inside space-y-1 mt-2 pl-4">
                {section.points.map((point, pIndex) => (
                  <li key={pIndex}>{point}</li>
                ))}
              </ul>
            )}
            {section.image && (
              <img
                src={section.image}
                alt={section.title || 'Hình ảnh minh họa'}
                className="mt-3 mb-3 rounded-lg shadow-sm w-full max-w-2xl mx-auto"
              />
            )}
          </div>
        ))}
        {!isExpanded && canExpand && (
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
        )}
      </div>

      {canExpand && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-white text-primary border border-primary px-6 py-2.5 rounded-md font-semibold hover:bg-blue-50 text-sm transition-colors duration-150"
          >
            {isExpanded ? 'Thu gọn' : 'Xem thêm nội dung'}
          </button>
        </div>
      )}
    </div>
  );
}
