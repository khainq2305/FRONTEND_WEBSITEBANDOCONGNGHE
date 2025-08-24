// src/components/Client/LuckyWheelPage/index.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { spinService } from "@/services/client/spinService";
import QuayButton from "@/components/Client/ButtonSpin";
import { Link } from "react-router-dom";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export default function LuckyWheelPage() {
  const [currentWinner, setCurrentWinner] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinsRemaining, setSpinsRemaining] = useState(0);
  const [countdown, setCountdown] = useState("");
  const [prizes, setPrizes] = useState([]);
  const [showGuide, setShowGuide] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const { width, height } = useWindowSize();
  const wheelRadius = 280;

  const colors = [
    "#FFADAD", "#FFD6A5", "#FDFFB6", "#CAFFBF",
    "#9BF6FF", "#A0C4FF", "#BDB2FF", "#FFC6FF"
  ];

  const toRad = (deg) => (deg * Math.PI) / 180;
  const getCoords = (angle, r) => ({
    x: r * Math.cos(toRad(angle)),
    y: r * Math.sin(toRad(angle))
  });
  const getSegmentPath = (start, end, r) => {
    const s = getCoords(start, r),
      e = getCoords(end, r);
    const large = end - start > 180 ? 1 : 0;
    return `M 0,0 L ${s.x},${s.y} A ${r},${r} 0 ${large} 1 ${e.x},${e.y} Z`;
  };

  const fetchSpinStatus = async () => {
    try {
      const statusRes = await spinService.getStatus();
      if (statusRes.data) {
        setSpinsRemaining(statusRes.data.spinsLeft);
      }
    } catch (err) {
      console.error("Lỗi khi tải trạng thái lượt quay:", err);
      setSpinsRemaining(0);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rewardsRes = await spinService.getRewards();
        if (rewardsRes.data) {
          const sorted = [...rewardsRes.data].sort((a, b) => a.id - b.id);
          setPrizes(sorted);
        }
        await fetchSpinStatus();
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu vòng quay:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (user || token) {
      fetchSpinStatus();
    }
  }, []);

  useEffect(() => {
    if (spinsRemaining === 0) {
      const interval = setInterval(() => {
        const now = new Date();
        const midnight = new Date();
        midnight.setHours(24, 0, 0, 0);
        const diff = midnight - now;
        const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
        const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
        const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
        setCountdown(`${h}:${m}:${s}`);
        if (diff < 1000) {
          fetchSpinStatus();
        }
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCountdown("");
    }
  }, [spinsRemaining]);

  useEffect(() => {
    if (showHistory) {
      spinService
        .getHistory()
        .then((res) => setHistory(res.data || []))
        .catch((err) => console.error("Lỗi tải lịch sử quay:", err));
    }
  }, [showHistory]);

  const handleSpin = async () => {
    if (isSpinning || spinsRemaining === 0 || prizes.length === 0) return;
    setIsSpinning(true);
    setCurrentWinner(null);

    try {
      const spinRes = await spinService.spin();
      const winnerName = spinRes.data.reward;
      const rewardId = spinRes.data.rewardId;

      const winnerIndex = prizes.findIndex((p) => p.id === rewardId);

      if (winnerIndex !== -1) {
        const segmentAngle = 360 / prizes.length;
        const prizeCenter =
          winnerIndex * segmentAngle + segmentAngle / 2;

        let stopAngle = 360 - (prizeCenter - 90);
        const randomOffset =
          (Math.random() - 0.5) * (segmentAngle * 0.4);
        stopAngle += randomOffset;

        const spins = 5 + Math.floor(Math.random() * 3);
        const totalRotation = spins * 360 + stopAngle;

        setRotation(totalRotation);

        setTimeout(async () => {
          setCurrentWinner(winnerName);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 2000);

          await fetchSpinStatus();
          setIsSpinning(false);
        }, 4000);
      } else {
        console.error("Không tìm thấy phần thưởng theo ID:", rewardId);
        setIsSpinning(false);
      }
    } catch (err) {
      console.error("Lỗi quay vòng:", err);
      setIsSpinning(false);
    }
  };

  // Kích thước vòng quay động
  const wheelSize = width < 640 ? 250 : width < 1024 ? 400 : 560;
  const wheelStrokeWidth = width < 640 ? 2 : 4;

  // Kích thước chữ động
  const wheelTextFontSize = width < 640 ? 10 : 14;
  const titleFontSize = width < 640 ? 'text-base' : 'text-lg md:text-xl';
  const prizeTextFontSize = width < 640 ? 'text-lg' : 'text-2xl';
  const popupTitleFontSize = width < 640 ? 'text-2xl' : 'text-4xl';
  const popupContentFontSize = width < 640 ? 'text-base' : 'text-xl md:text-2xl';
  const buttonFontSize = width < 640 ? 'px-4 py-2' : 'px-8 py-3';

  // Chức năng mới: Chia nhỏ chuỗi nếu quá dài
  const wrapText = (text, maxCharsPerLine) => {
    const words = text.split(' ');
    let lines = [];
    let currentLine = '';

    words.forEach(word => {
      if ((currentLine + word).length <= maxCharsPerLine) {
        currentLine += (currentLine.length > 0 ? ' ' : '') + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    });

    if (currentLine.length > 0) {
      lines.push(currentLine);
    }
    return lines;
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-yellow-100 to-pink-50 flex flex-col items-center justify-center p-4 md:p-8">
      {/* Nút quay lại */}
      <div className="absolute top-4 left-4 z-[60]">
        <Link
          to="/"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md hover:scale-110 transition-transform duration-300"
        >
          <i className="fas fa-arrow-left text-lg" />
        </Link>
      </div>

      {/* Nút hướng dẫn & lịch sử */}
      <div className="absolute top-4 right-4 z-[60] flex gap-2">
        <button
          onClick={() => setShowGuide(true)}
          className="w-10 h-10 rounded-full bg-white/80 text-gray-700 hover:bg-white shadow-md flex items-center justify-center"
        >
          <i className="fas fa-info text-md" />
        </button>
        <button
          onClick={() => setShowHistory(true)}
          className="w-10 h-10 rounded-full bg-white/80 text-gray-700 hover:bg-white shadow-md flex items-center justify-center"
        >
          <i className="fas fa-history text-md" />
        </button>
      </div>

      {/* Tiêu đề */}
      <div className="relative mb-6 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-200 via-pink-200 to-red-200 shadow-md border border-pink-300">
        <div className={`font-bold text-fuchsia-700 flex items-center gap-2 ${titleFontSize}`}>
          <span className="text-xl md:text-2xl">🎉</span>
          <span>Vòng Quay May Mắn - Nhận quà mỗi ngày</span>
          <span className="text-xl md:text-2xl">🎁</span>
        </div>
      </div>

      {/* Số lượt quay */}
      <div className="text-center mb-4 text-gray-700 font-semibold text-sm md:text-base">
        Bạn còn{" "}
        <span className="text-pink-600 font-bold">{spinsRemaining}</span> lượt
        quay hôm nay
      </div>

      {/* Vòng quay */}
      <div className="relative bg-white rounded-full p-2 shadow-2xl">
        <motion.svg
          width={wheelSize}
          height={wheelSize}
          viewBox={`-${wheelSize / 2} -${wheelSize / 2} ${wheelSize} ${wheelSize}`}
          animate={{ rotate: rotation }}
          transition={{
            duration: 4,
            ease: [0.17, 0.67, 0.83, 0.67]
          }}
          style={{
            filter: "drop-shadow(0px 10px 10px rgba(0,0,0,0.1))"
          }}
        >
          {prizes.length > 0 &&
            prizes.map((prize, i) => {
              const segmentAngle = 360 / prizes.length;
              const start = i * segmentAngle - 90;
              const end = start + segmentAngle;
              const path = getSegmentPath(start, end, wheelSize / 2);
              const angle = start + segmentAngle / 2;
              const { x, y } = getCoords(angle, (wheelSize / 2) * 0.7);

              const wrappedLines = wrapText(prize.name, 12);
              const totalLines = wrappedLines.length;
              const yOffset = (totalLines - 1) * -8;

              return (
                <g key={i}>
                  <path
                    d={path}
                    fill={colors[i % colors.length]}
                    stroke="#FFF"
                    strokeWidth={wheelStrokeWidth}
                  />
                  <text
                    x={x}
                    y={y}
                    fill="#333"
                    fontSize={wheelTextFontSize}
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${angle} ${x} ${y})`}
                    style={{
                      textShadow:
                        "1px 1px 2px rgba(255,255,255,0.7)"
                    }}
                  >
                    {wrappedLines.map((line, index) => (
                      <tspan key={index} x={x} dy={index === 0 ? yOffset : 16}>
                        {line}
                      </tspan>
                    ))}
                  </text>
                </g>
              );
            })}
        </motion.svg>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
          <QuayButton
            onClick={handleSpin}
            disabled={isSpinning || spinsRemaining === 0}
            text={
              isSpinning ? "" : spinsRemaining === 0 ? countdown : "QUAY x1"
            }
            className="w-[100px] h-[100px] md:w-[150px] md:h-[150px]"
          />
        </div>
      </div>

      {/* Popup trúng thưởng */}
      <AnimatePresence>
        {currentWinner && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl border-4 border-purple-500 text-center max-w-sm md:max-w-md mx-auto"
              initial={{ y: -50, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -50, opacity: 0, scale: 0.8 }}
            >
              <h2 className={`${popupTitleFontSize} font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-4`}>
                🎉 CHÚC MỪNG! 🎉
              </h2>
              <p className={`${popupContentFontSize} font-semibold text-gray-800 mb-6`}>
                Bạn đã trúng: <br />
                <span className={`${prizeTextFontSize} font-bold text-purple-700`}>
                  {currentWinner}
                </span>
              </p>
              <button
                onClick={() => setCurrentWinner(null)}
                className={`mt-4 ${buttonFontSize} bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-full shadow-lg hover:scale-105 transition`}
              >
                Tuyệt vời!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showConfetti && <Confetti width={width} height={height} />}

      {/* Popup hướng dẫn */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 max-w-sm md:max-w-md w-full shadow-2xl"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
            >
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-pink-600">
                📘 Hướng dẫn chơi
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm md:text-base">
                <li>Nhấn nút "QUAY" để thử vận may.</li>
                <li>
                  Bạn có 3 lượt quay miễn phí nhất định mỗi ngày và sẽ được làm mới hàng ngày.
                </li>
                <li>
                  Nếu bạn quay trúng thưởng, phần quà sẽ được tự động cộng vào
                  tài khoản của bạn.
                </li>
              </ul>
              <button
                onClick={() => setShowGuide(false)}
                className="mt-6 w-full py-2 bg-gradient-to-r from-pink-400 to-red-400 text-white font-bold rounded-lg hover:scale-105 transition"
              >
                Đã hiểu
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popup lịch sử */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 max-w-sm md:max-w-md w-full shadow-2xl"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
            >
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-indigo-600">
                🕘 Lịch sử quay
              </h2>
              {history.length === 0 ? (
                <p className="text-gray-500 italic text-sm md:text-base">
                  Chưa có lượt quay nào.
                </p>
              ) : (
                <ul className="space-y-2 text-gray-700 text-xs md:text-sm max-h-64 overflow-y-auto pr-2">
                  {history.map((item, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center border-b pb-1"
                    >
                      <div>
                        🎁 {item.rewardName}
                        {item.couponCode && (
                          <span className="ml-2 text-pink-600 font-semibold">
                            ({item.couponCode})
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(item.createdAt).toLocaleString("vi-VN")}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <button
                onClick={() => setShowHistory(false)}
                className="mt-6 w-full py-2 bg-gradient-to-r from-indigo-400 to-blue-500 text-white font-bold rounded-lg hover:scale-105 transition"
              >
                Đóng
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}