import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { rewardPointService } from "@/services/client/rewardPointService";

const RewardPointContext = createContext();

export const RewardPointProvider = ({ children }) => {
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchPoints = useCallback(async () => {
    try {
      setLoading(true);
      const res = await rewardPointService.getTotalPoints();
      setPoints(res?.data?.totalPoints || 0);
    } catch (err) {
      console.error("❌ Lỗi lấy điểm:", err);
      setPoints(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch lần đầu
  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);

  // Lắng nghe event pointsUpdated để refetch
  useEffect(() => {
    const handlePointsUpdated = () => {
      fetchPoints();
    };
    window.addEventListener("pointsUpdated", handlePointsUpdated);
    return () => window.removeEventListener("pointsUpdated", handlePointsUpdated);
  }, [fetchPoints]);

  const refreshPoints = () => {
    fetchPoints();
  };

  return (
    <RewardPointContext.Provider value={{ points, loading, refreshPoints }}>
      {children}
    </RewardPointContext.Provider>
  );
};

export const useRewardPoints = () => useContext(RewardPointContext);
