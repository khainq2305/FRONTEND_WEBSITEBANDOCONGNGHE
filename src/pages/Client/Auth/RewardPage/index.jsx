import RewardPointSummary from './RewardPointSummary';
import RewardPointHistory  from './RewardPointHistory';

export default function RewardPage() {
  return (
    <div className="mx-auto max-w-4xl px-4">
      <RewardPointSummary />
      <RewardPointHistory />
    </div>
  );
}
