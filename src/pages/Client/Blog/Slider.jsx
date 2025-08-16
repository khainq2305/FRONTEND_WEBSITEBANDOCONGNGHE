import React, { useEffect, useState } from "react";

const fakeData = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `Sản phẩm ${i + 1}`,
  color: `hsl(${(i + 1) * 36}, 80%, 70%)`,
}));

const VISIBLE_COUNT = 5;

export default function Slider() {
  const [index, setIndex] = useState(VISIBLE_COUNT); 
  const [transition, setTransition] = useState(true);

  const extendedData = [
    ...fakeData.slice(-VISIBLE_COUNT),
    ...fakeData,
    ...fakeData.slice(0, VISIBLE_COUNT),
  ];

  const total = extendedData.length;

  const next = () => {
    setIndex((prev) => prev + 1);
    setTransition(true);
  };

  const prev = () => {
    setIndex((prev) => prev - 1);
    setTransition(true);
  };

  useEffect(() => {
    
    const timer = setInterval(() => {
      next();
    }, 4000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (index === total - VISIBLE_COUNT) {
      setTimeout(() => {
        setTransition(false);
        setIndex(VISIBLE_COUNT);
      }, 300);
    } else if (index === 0) {
      setTimeout(() => {
        setTransition(false);
        setIndex(total - VISIBLE_COUNT * 2);
      }, 300);
    }
  }, [index]);

  return (
    <div className="relative w-full overflow-hidden max-w-6xl mx-auto">
      <div
        className="flex"
        style={{
          width: `${(total * 100) / VISIBLE_COUNT}%`,
          transform: `translateX(-${(100 / total) * index}%)`,
          transition: transition ? "transform 0.3s ease-in-out" : "none",
        }}
        onTransitionEnd={() => setTransition(true)}
      >
        {extendedData.map((item, i) => (
          <div
            key={i}
            className="p-2"
            style={{ width: `${100 / total}%` }}
          >
            <div
              className="h-[100px] rounded-lg flex items-center justify-center text-white font-semibold"
              style={{ backgroundColor: item.color }}
            >
              {item.name}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prev}
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-white px-3 py-1 rounded-full shadow z-10"
      >
        ◀
      </button>
      <button
        onClick={next}
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-white px-3 py-1 rounded-full shadow z-10"
      >
        ▶
      </button>
    </div>
  );
}
