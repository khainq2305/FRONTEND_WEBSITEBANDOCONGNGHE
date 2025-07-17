import React, { useState, useEffect, useRef } from 'react';

const CountdownTimer = ({ expiryTimestamp, mode = 'end' }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(expiryTimestamp) - +new Date();
        if (difference <= 0) return null;

        const totalSeconds = Math.floor(difference / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        const totalDays = Math.floor(totalHours / 24);

        // Số ngày trong tháng trung bình (365.25 / 12)
        const daysInMonthAvg = 30.4375;
        const months = Math.floor(totalDays / daysInMonthAvg);
        const daysRemainingAfterMonths = Math.floor(totalDays % daysInMonthAvg);

        return {
            months,
            days: daysRemainingAfterMonths, // Ngày còn lại sau khi tính tháng
            hours: totalHours % 24,
            minutes: totalMinutes % 60,
            seconds: totalSeconds % 60,
        };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    const timerRef = useRef(null);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [expiryTimestamp]);

    const formatTime = (value) => value.toString().padStart(2, '0');

    const renderTimeBox = (value) => (
        <span className="bg-red-600 text-white font-bold text-xs sm:text-base rounded-md px-1 py-0.5 min-w-[28px] sm:min-w-[34px] text-center shadow-inner">
            {formatTime(value)}
        </span>
    );

    if (!timeLeft) {
        if (mode === 'start') {
            return <span className="text-white font-bold text-sm sm:text-lg whitespace-nowrap">Đang diễn ra!</span>;
        }
        return <span className="text-white font-bold text-sm sm:text-lg whitespace-nowrap">Đã kết thúc!</span>;
    }

    const { months, days, hours, minutes, seconds } = timeLeft;

    return (
        <div className="flex items-center gap-0.5 sm:gap-1 flex-nowrap overflow-hidden" aria-label="Thời gian còn lại">
            {months > 0 && (
                <>
                    {renderTimeBox(months)}
                    {/* Đã xóa chữ "tháng" */}
                    <span className="text-red-600 font-bold text-sm sm:text-lg px-px">:</span>
                </>
            )}
            {days > 0 && (
                <>
                    {renderTimeBox(days)}
                    {/* Đã xóa chữ "ngày" */}
                    <span className="text-red-600 font-bold text-sm sm:text-lg px-px">:</span>
                </>
            )}
            {/* Giờ, phút, giây luôn hiển thị */}
            {renderTimeBox(hours)}
            <span className="text-red-600 font-bold text-sm sm:text-lg px-px">:</span>
            {renderTimeBox(minutes)}
            <span className="text-red-600 font-bold text-sm sm:text-lg px-px">:</span>
            {renderTimeBox(seconds)}
        </div>
    );
};

export default CountdownTimer;