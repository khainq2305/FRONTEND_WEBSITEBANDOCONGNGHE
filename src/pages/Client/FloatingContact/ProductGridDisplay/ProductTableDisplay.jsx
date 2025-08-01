import React from 'react';

export default function ProductTableDisplay({ tableTitle, headers, rows }) {
  return (
    <div className="product-table-display mb-5 w-full overflow-x-auto">
      {tableTitle && (
        <h3 className="text-[15px] font-semibold text-gray-800 mb-2 leading-tight">
          {tableTitle}
        </h3>
      )}

      <div className="min-w-[500px] rounded-md border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full table-auto text-[13px] text-left text-gray-700">
          <thead className="bg-gray-50 text-gray-600 uppercase">
            <tr>
              {headers.map((header, idx) => (
                <th
                  key={idx}
                  className={`px-3 py-2 font-medium border-b border-gray-200 ${
                    idx === 0 ? 'text-left w-[50%]' : 'text-center'
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`px-3 py-2 text-gray-800 ${
                      cellIndex === 0
                        ? 'text-left break-words max-w-[120px]'
                        : 'text-center whitespace-nowrap'
                    }`}
                    dangerouslySetInnerHTML={{ __html: cell }}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
