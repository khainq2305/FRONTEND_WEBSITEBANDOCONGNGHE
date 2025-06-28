import { ClipboardCopy, Check } from 'lucide-react'; // Import ClipboardCopy and Check from Lucide
import { useState } from 'react';
import { toast } from 'react-toastify';

const CopyableRow = ({ label, value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success('Đã sao chép mã đơn!');
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex justify-between items-center text-gray-800">
      <span>{label}</span>

      <button
        type="button"
        onClick={handleCopy}
        className="flex items-center gap-1 p-1 rounded hover:bg-gray-100 active:scale-95 transition"
        title="Sao chép"
      >
        {copied ? (
          // Lucide's Check icon is also clean and fits well
          <Check className="w-5 h-5 text-green-600 shrink-0" />
        ) : (
          // Use ClipboardCopy for the "two-part" look
          <ClipboardCopy className="w-5 h-5 text-gray-600 shrink-0" />
        )}
        <span className="font-semibold">{value}</span>
      </button>
    </div>
  );
};

export default CopyableRow;