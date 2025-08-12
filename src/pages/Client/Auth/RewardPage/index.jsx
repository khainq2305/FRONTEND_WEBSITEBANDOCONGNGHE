import { useState } from 'react';
import RewardPointSummary from './RewardPointSummary';
import RewardPointHistory from './RewardPointHistory';
import Loader from '@/components/common/Loader'; 

export default function RewardPage() {
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const isLoading = loadingSummary || loadingHistory;

  return (
    <div>
      
      <RewardPointSummary onLoadingChange={setLoadingSummary} />
      <RewardPointHistory onLoadingChange={setLoadingHistory} />
    </div>
  );
}
