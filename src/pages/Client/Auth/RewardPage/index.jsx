import { useState } from 'react';
import RewardPointSummary from './RewardPointSummary';
import RewardPointHistory from './RewardPointHistory';
import Loader from '@/components/common/Loader';

export default function RewardPage() {
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [reloadFlag, setReloadFlag] = useState(0);

  const reloadSummary = () => setReloadFlag(prev => prev + 1);

  const isLoading = loadingSummary || loadingHistory;

  return (
    <div>
      <RewardPointSummary onLoadingChange={setLoadingSummary} reloadFlag={reloadFlag} />
      <RewardPointHistory onLoadingChange={setLoadingHistory} onCancelSuccess={reloadSummary} />
    </div>
  );
}
