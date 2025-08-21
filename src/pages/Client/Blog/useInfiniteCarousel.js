import { useState, useEffect } from 'react';

export default function useInfiniteCarousel({ items, visibleCount, autoScroll = true }) {
  const totalItems = items.length;
  const clonedItems = [
    ...items.slice(-visibleCount),
    ...items,
    ...items.slice(0, visibleCount),
  ];
  const totalCloned = clonedItems.length;

  const [currentIndex, setCurrentIndex] = useState(visibleCount);
  const [isAnimating, setIsAnimating] = useState(false);

  const next = () => {
    setCurrentIndex((prev) => prev + 1);
    setIsAnimating(true);
  };

  const prev = () => {
    setCurrentIndex((prev) => prev - 1);
    setIsAnimating(true);
  };

  // ✅ Auto scroll nếu được bật
  useEffect(() => {
    if (!autoScroll) return;
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [autoScroll]);

  // ✅ Reset nếu chạm clone
  useEffect(() => {
    if (currentIndex === totalCloned - visibleCount) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setCurrentIndex(visibleCount);
      }, 500);
      return () => clearTimeout(timer);
    }

    if (currentIndex === 0) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setCurrentIndex(totalItems);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, totalCloned, visibleCount, totalItems]);

  // ✅ Reset index khi items load xong
  useEffect(() => {
    if (items.length > 0) {
      setCurrentIndex(visibleCount);
      setIsAnimating(false);
    }
  }, [items, visibleCount]);

  return {
    currentIndex,
    isAnimating,
    clonedItems,
    totalCloned,
    next,
    prev,
  };
}
