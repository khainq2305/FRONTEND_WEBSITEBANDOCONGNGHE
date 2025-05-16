import { useState } from "react";

export default function TechnicalSpec() {
  const [showSpecModal, setShowSpecModal] = useState(false);

  const briefSpecs = [
    ["Màn hình", "6.9” Super Retina XDR"],
    ["Camera", "48MP + Tele + Ultra"],
    ["Camera trước", "12MP f/1.9"],
    ["Chipset", "Apple A18 Pro"],
    ["RAM", "12GB"],
    ["Bộ nhớ", "1TB"],
    ["SIM", "nano + eSIM"],
    ["OS", "iOS 18"],
    ["Tính năng", "120Hz, HDR, Dynamic Island"],
  ];

  const fullSpecs = [
    {
      title: "Màn hình",
      data: [
        ["Kích thước màn hình", "6.9 inches"],
        ["Công nghệ màn hình", "Super Retina XDR OLED"],
        ["Độ phân giải", "2868 x 1320 pixels"],
        ["Tần số quét", "120Hz"],
        [
          "Tính năng",
          "Dynamic Island, HDR, True Tone, ProMotion 120Hz",
        ],
      ],
    },
    {
      title: "Camera sau",
      data: [
        ["Thông số", "48MP + 12MP Tele + 12MP Siêu rộng"],
        ["Quay video", "4K@24/60fps, 1080p@120fps"],
        ["Tính năng", "Night mode, Deep Fusion, HDR 5"],
      ],
    },
    {
      title: "Camera trước",
      data: [
        ["Độ phân giải", "12MP, f/1.9"],
        ["Quay video", "4K@60fps, 1080p@60fps"],
      ],
    },
    {
      title: "Hiệu năng",
      data: [
        ["Chipset", "Apple A18 Pro"],
        ["GPU", "6 lõi"],
        ["CPU", "6 lõi (2 hiệu năng + 4 tiết kiệm)"],
      ],
    },
    {
      title: "Bộ nhớ",
      data: [
        ["RAM", "12GB"],
        ["Bộ nhớ trong", "256GB"],
      ],
    },
    {
      title: "Kết nối & Giao tiếp",
      data: [
        ["SIM", "2 SIM (nano + eSIM)"],
        ["Wi-Fi", "Wi-Fi 7"],
        ["Bluetooth", "5.3"],
        ["GPS", "GPS, GLONASS, Galileo, BeiDou, NavIC"],
        ["NFC", "Có"],
      ],
    },
    {
      title: "Pin & Sạc",
      data: [
        ["Công nghệ sạc", "MagSafe 25W, Qi2 15W"],
        ["Cổng sạc", "USB Type-C"],
      ],
    },
    {
      title: "Thiết kế",
      data: [
        ["Chất liệu", "Mặt lưng kính, viền Titanium"],
        ["Kích thước", "163 x 77.6 x 8.25 mm"],
        ["Trọng lượng", "227g"],
        ["Chuẩn kháng nước", "IP68"],
      ],
    },
    {
      title: "Tính năng khác",
      data: [
        ["Bảo mật", "Face ID"],
        ["Tính năng đặc biệt", "5G, SOS, Apple Pay, AI Phone"],
        ["Âm thanh", "Dolby Atmos, FLAC, MP3..."],
      ],
    },
    {
      title: "Thông tin khác",
      data: [
        ["Hệ điều hành", "iOS 18"],
        ["Thời điểm ra mắt", "09/2024"],
      ],
    },
  ];

  return (
    <>
      <div className="bg-white p-4 rounded border border-gray-200 shadow-md text-sm md:sticky md:top-4 md:self-start">
        <h2 className="font-semibold text-base mb-3">Thông số kỹ thuật</h2>
        <table className="w-full text-sm">
          <tbody>
            {briefSpecs.map(([label, value], i) => (
              <tr key={i} className="align-top">
                <td className="py-1 pr-2 text-gray-600 font-medium whitespace-nowrap">{label}:</td>
                <td className="py-1 text-gray-800">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={() => setShowSpecModal(true)}
          className="w-full mt-4 bg-gray-100 py-2 rounded hover:bg-gray-200 text-center text-sm text-red-600"
        >
          Xem chi tiết cấu hình
        </button>
      </div>

      {showSpecModal && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center z-50">
          <div className="bg-white border border-gray-300 max-w-2xl w-full rounded-lg shadow-lg overflow-y-auto max-h-[80vh]">
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="text-base font-semibold text-gray-800">Thông số kỹ thuật chi tiết</h2>
              <button
                className="text-xl font-bold text-gray-600 hover:text-red-600"
                onClick={() => setShowSpecModal(false)}
              >
                ×
              </button>
            </div>

            <div className="text-sm text-gray-800 space-y-6 p-4">
              {fullSpecs.map((section, idx) => (
                <div key={idx} className="border border-gray-200 rounded-md overflow-hidden">
                  <h3 className="font-semibold bg-gray-100 px-4 py-2 text-gray-700">
                    {section.title}
                  </h3>
                  {section.data.map(([label, value], i) => (
                    <div
                      key={i}
                      className={`flex justify-between items-start gap-3 px-4 py-2 ${
                        i % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <span className="text-gray-600 w-1/2">{label}</span>
                      <span className="text-right w-1/2">{value}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
