import React, { useState, useEffect } from 'react';

// Hàm helper để thêm số 0 đằng trước cho các số < 10
const formatTime = (time) => time.toString().padStart(2, '0');

const CountdownTimer = ({ expiryTimestamp }) => {
    // Hàm tính toán thời gian còn lại
    const calculateTimeLeft = () => {
        const difference = +new Date(expiryTimestamp) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        // Cập nhật thời gian mỗi giây
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        // Dọn dẹp timer khi component bị hủy
        return () => clearTimeout(timer);
    });

    const renderTimeBox = (value) => (
        <span className="bg-red-600 text-white font-bold text-lg rounded-md px-2 py-1 min-w-[38px] text-center shadow-inner">
            {formatTime(value)}
        </span>
    );

    // Kiểm tra xem còn thời gian hay không
    const hasTimeLeft = Object.values(timeLeft).some(val => val > 0);

    if (!hasTimeLeft) {
        return <span className="text-red-700 font-bold text-lg">Đã kết thúc!</span>;
    }

    // Hiển thị giao diện đồng hồ
    return (
        <div className="flex items-center gap-1.5" aria-label="Thời gian còn lại">
            {/* Hiển thị ngày nếu có */}
            {timeLeft.days > 0 && (
                <>
                    {renderTimeBox(timeLeft.days)}
                    <span className="text-red-600 font-bold text-xl">:</span>
                </>
            )}
            {renderTimeBox(timeLeft.hours)}
            <span className="text-red-600 font-bold text-xl">:</span>
            {renderTimeBox(timeLeft.minutes)}
            <span className="text-red-600 font-bold text-xl">:</span>
            {renderTimeBox(timeLeft.seconds)}
        </div>
    );
};

export default CountdownTimer;