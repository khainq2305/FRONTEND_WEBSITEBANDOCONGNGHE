import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ endTime }) => {
    // --- PHẦN LOGIC (giữ nguyên) ---
    const calculateTimeLeft = () => {
        const difference = +new Date(endTime) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            const totalHours = Math.floor(difference / (1000 * 60 * 60));
            timeLeft = {
                days: Math.floor(totalHours / 24),
                hours: totalHours % 24,
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    });

    const addLeadingZeros = (value) => {
        const numValue = value || 0;
        return numValue < 10 ? `0${numValue}` : numValue;
    };
    
    // --- PHẦN STYLE (CSS đã được chuyển vào đây) ---
    const styles = {
        countdownBox: {
            backgroundColor: '#fff',
            color: '#d73249',
            padding: '8px 10px',
            borderRadius: '6px',
            fontSize: '1.125rem', // 18px
            fontWeight: '700',
            minWidth: '42px',
            textAlign: 'center',
            lineHeight: '1',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        },
        countdownSeparator: {
            fontSize: '1.125rem',
            fontWeight: '700',
            color: '#d73249',
            paddingBottom: '2px',
        },
        container: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem' // 16px
        },
        timeGroup: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem' // 8px
        },
        title: {
            fontSize: '1rem', // 16px
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#d73249'
        }
    };

    // --- PHẦN RENDER ---
    const { days, hours, minutes, seconds } = timeLeft;
    const totalHours = (days || 0) * 24 + (hours || 0);

    if (!Object.keys(timeLeft).length) {
        return <span style={{...styles.title, color: '#4A5568'}}>ĐÃ KẾT THÚC</span>;
    }

    return (
        <div style={styles.container}>
            <span style={styles.title}>Kết thúc trong</span>
            <div style={styles.timeGroup}>
                <div style={styles.countdownBox}>{addLeadingZeros(totalHours)}</div>
                <span style={styles.countdownSeparator}>:</span>
                <div style={styles.countdownBox}>{addLeadingZeros(minutes)}</div>
                <span style={styles.countdownSeparator}>:</span>
                <div style={styles.countdownBox}>{addLeadingZeros(seconds)}</div>
            </div>
        </div>
    );
};

export default CountdownTimer;