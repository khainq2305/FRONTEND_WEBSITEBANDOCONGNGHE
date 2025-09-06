import { useState } from 'react';
import RewardPointSummary from './RewardPointSummary';
import RewardPointHistory from './RewardPointHistory';
import { useRewardPoints } from '@/contexts/RewardPointContext';

export default function RewardPage() {
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const { refreshPoints } = useRewardPoints();

  const reloadSummary = () => {
    refreshPoints(); // chỉ gọi context thôi
  };

  return (
    <div>
      <RewardPointSummary onLoadingChange={setLoadingSummary} /> 
      <RewardPointHistory
        onLoadingChange={setLoadingHistory}
        onCancelSuccess={reloadSummary}
      />
    </div>
  );
}
