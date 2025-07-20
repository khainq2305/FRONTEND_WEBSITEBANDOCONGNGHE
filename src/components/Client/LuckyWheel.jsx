"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, X } from "lucide-react";
import QuayButton from "@/components/Client/ButtonSpin";
import { spinService } from "@/services/client/spinService";
import PopupModal from "@/layout/Client/Header/PopupModal";

const LuckyWheel = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentWinner, setCurrentWinner] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinsRemaining, setSpinsRemaining] = useState(0);
  const [countdown, setCountdown] = useState("");
  const [prizes, setPrizes] = useState([]);
  const [localHistory, setLocalHistory] = useState([]);

  const wheelRadius = 280;
  const centerButtonRadius = 50;
  const colors = ["#FF0066", "#FF6600", "#FFCC00", "#993399"];

  const getUser = () => {
    try {
      const user = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      return token && user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  };

  const isLoggedIn = !!getUser();

  const toRad = (deg) => (deg * Math.PI) / 180;
  const getCoords = (angle, r) => ({
    x: r * Math.cos(toRad(angle)),
    y: r * Math.sin(toRad(angle)),
  });
  const getSegmentPath = (start, end, r) => {
    const s = getCoords(start, r),
      e = getCoords(end, r);
    const large = end - start > 180 ? 1 : 0;
    return `M 0,0 L ${s.x},${s.y} A ${r},${r} 0 ${large} 1 ${e.x},${e.y} Z`;
  };

  const displayPrizes =
    prizes.length > 0
      ? prizes.flatMap((p) => Array(Math.round(p.probability * 16)).fill(p.name))
      : [];

  const segmentAngle = displayPrizes.length > 0 ? 360 / displayPrizes.length : 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rewardsRes = await spinService.getRewards();
        const statusRes = await spinService.getStatus();
        const historyRes = await spinService.getHistory();

        if (rewardsRes.data) setPrizes(rewardsRes.data);
        if (statusRes.data) setSpinsRemaining(statusRes.data.spinsLeft);
        if (historyRes.data) {
          const data = historyRes.data.map((item) => ({
            winner: item.reward_name,
            time: new Date(item.createdAt).toLocaleTimeString("vi-VN"),
            date: new Date(item.createdAt).toLocaleDateString("vi-VN"),
          }));
          setLocalHistory(data);
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu vòng quay:", err);
      }
    };
    fetchData();
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
          spinService
            .getStatus()
            .then((res) => res.data && setSpinsRemaining(res.data.spinsLeft));
        }
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCountdown("");
    }
  }, [spinsRemaining]);

  const handleSpin = async () => {
    if (isSpinning || spinsRemaining === 0 || prizes.length === 0) return;
    setIsSpinning(true);
    setCurrentWinner(null);

    try {
      const spinRes = await spinService.spin();
      const winnerName = spinRes.data.reward;

      const index = displayPrizes.findIndex((n) => n === winnerName);
      if (index !== -1) {
        const angleOffset = -(index * segmentAngle);
        const spins = 5 + Math.random() * 5;
        const total = rotation + spins * 360 + angleOffset - (rotation % 360);
        setRotation(total);

        setTimeout(async () => {
          setCurrentWinner(winnerName);
          const statusRes = await spinService.getStatus();
          if (statusRes.data) setSpinsRemaining(statusRes.data.spinsLeft);

          const historyRes = await spinService.getHistory();
          if (historyRes.data) {
            const data = historyRes.data.map((item) => ({
              winner: item.reward_name,
              time: new Date(item.createdAt).toLocaleTimeString("vi-VN"),
              date: new Date(item.createdAt).toLocaleDateString("vi-VN"),
            }));
            setLocalHistory(data);
          }
          setIsSpinning(false);
        }, 2000);
      } else {
        console.error("Không tìm thấy phần thưởng:", winnerName);
        setIsSpinning(false);
      }
    } catch (err) {
      console.error("Lỗi quay vòng:", err);
      setIsSpinning(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      {/* Nút Gift */}
      <button
        onClick={() => {
          if (!isLoggedIn) {
            setShowLoginModal(true);
          } else {
            setShowPopup(true);
          }
        }}
        className="fixed bottom-24 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 text-white shadow-lg border-4 border-white flex items-center justify-center animate-bounce"
      >
        <Gift className="w-7 h-7" />
      </button>

      {/* Popup yêu cầu đăng nhập */}
      <PopupModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

      {/* Popup vòng quay */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-7xl bg-white text-black rounded-xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-500 p-2 rounded-full hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="grid lg:grid-cols-[1.2fr_2fr_1.2fr] gap-6 items-start mt-4">
              {/* LEFT: Phần thưởng + Lịch sử */}
              <div className="flex flex-col gap-6">
                <div className="bg-white rounded-xl p-4 border border-blue-300 shadow-lg">
                  <h3 className="text-xl font-bold mb-4 text-blue-600 border-b pb-2 border-blue-200">🎁 Phần thưởng & Tỉ lệ</h3>
                  <div className="max-h-[250px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-blue-400 scrollbar-track-blue-50">
                    {prizes.map((p, i) => (
                      <div key={i} className="px-3 py-2 rounded-md bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm border border-blue-100 mb-2">
                        <span className="font-semibold text-gray-800">{p.name}</span>
                        <p className="text-gray-600 text-xs">{p.description}</p>
                        <span className="text-purple-600 font-bold">Tỉ lệ: {(p.probability * 100).toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-yellow-300 shadow-lg">
                  <h3 className="text-xl font-bold mb-4 text-pink-600 border-b pb-2 border-pink-200">🕘 Lịch sử quay</h3>
                  <div className="max-h-[250px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-blue-400 scrollbar-track-blue-50">
                    {localHistory.length === 0 ? (
                      <p className="text-gray-500 italic text-center py-4">Chưa có lượt quay nào.</p>
                    ) : (
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        {localHistory.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center px-3 py-2 rounded-md bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm border border-blue-100">
                            <span className="font-semibold text-gray-800 truncate">{item.winner}</span>
                            <div className="text-right text-xs text-gray-600 font-mono">
                              <div>{item.time}</div>
                              <div>{item.date}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* CENTER: Vòng quay */}
              <div className="relative flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Vòng Quay May Mắn</h2>
                <motion.svg
                  width={wheelRadius * 2}
                  height={wheelRadius * 2}
                  viewBox={`-${wheelRadius} -${wheelRadius} ${wheelRadius * 2} ${wheelRadius * 2}`}
                  animate={{ rotate: rotation }}
                  transition={{ type: "spring", stiffness: 70, damping: 20 }}
                >
                  {displayPrizes.map((name, i) => {
                    const start = i * segmentAngle - 90;
                    const end = (i + 1) * segmentAngle - 90;
                    const path = getSegmentPath(start, end, wheelRadius);
                    const angle = start + segmentAngle / 2;
                    const { x, y } = getCoords(angle, wheelRadius * 0.72);
                    return (
                      <g key={i}>
                        <path d={path} fill={colors[i % colors.length]} stroke="white" strokeWidth="2" />
                        <text
                          x={x}
                          y={y}
                          transform={`rotate(${angle} ${x} ${y})`}
                          fill="#fff"
                          fontSize="14"
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          {name}
                        </text>
                      </g>
                    );
                  })}
                </motion.svg>

                <div className="absolute top-[52.5%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <QuayButton
                    onClick={handleSpin}
                    disabled={isSpinning || spinsRemaining === 0}
                    text={isSpinning ? "" : spinsRemaining === 0 ? countdown : "Quay"}
                    style={{
                      width: centerButtonRadius * 2,
                      height: centerButtonRadius * 2,
                      fontSize: "20px",
                      backgroundColor: "#fff",
                      color: "#000",
                    }}
                  />
                </div>
              </div>

              {/* RIGHT: Cách chơi */}
              <div className="bg-white rounded-xl p-4 border border-green-300 shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-green-600 border-b pb-2 border-green-200">💡 Cách chơi</h3>
                <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                  <li>Bạn có <span className="font-bold text-base text-red-500">{spinsRemaining}</span> lượt quay miễn phí mỗi ngày.</li>
                  <li>Nhấn nút <b>“Quay”</b> ở trung tâm vòng quay để bắt đầu.</li>
                  <li>Phần thưởng sẽ hiển thị sau khi vòng quay dừng lại.</li>
                  <li>Xem lại phần thưởng đã trúng tại <b>“Lịch sử quay”</b>.</li>
                  <li>Lượt quay được đặt lại vào lúc <b>00:00</b> hàng ngày.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kết quả trúng thưởng */}
      <AnimatePresence>
        {currentWinner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="relative bg-white p-8 rounded-2xl shadow-xl border-4 border-purple-400 text-center max-w-md mx-auto z-10 pointer-events-auto"
            >
              <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-4">
                🎉 CHÚC MỪNG! 🎉
              </h2>
              <p className="text-xl font-semibold text-gray-800 mb-6">
                Bạn đã trúng: <br />
                <span className="text-purple-700 text-2xl font-bold">{currentWinner}</span>
              </p>
              <button
                onClick={() => setCurrentWinner(null)}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full shadow-lg hover:from-purple-600 hover:to-indigo-700 transition-all"
              >
                Tuyệt vời!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LuckyWheel;
