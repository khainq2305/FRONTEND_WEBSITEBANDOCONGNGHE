import { useRef, useEffect, useState, useCallback } from "react";

export default function useCarouselLogic({ totalSlides, delay = 3000, autoPlay = true }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef(null);

  const next = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goTo = useCallback((index) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlide(index);
    }
  }, [totalSlides]);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (autoPlay && !timerRef.current) {
      timerRef.current = setInterval(next, delay);
    }
  }, [autoPlay, delay, next]);

  const resetInterval = useCallback(() => {
    stop();
    start();
  }, [stop, start]);

  useEffect(() => {
    start();
    return stop;
  }, [start, stop]);

  return {
    currentSlide,
    next,
    prev,
    goTo,
    stop,
    start,
    resetInterval
  };
}
