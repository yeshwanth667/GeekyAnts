// src/components/CapacityBar.tsx
interface CapacityBarProps {
  allocated: number;
  max: number;
}

const CapacityBar: React.FC<CapacityBarProps> = ({ allocated, max }) => {
  const percent = Math.min((allocated / max) * 100, 100);
  const available = Math.max(max - allocated, 0);

  const barColor = percent >= 90 ? 'bg-red-600' : percent >= 70 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className="space-y-1">
      <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
        <div
          className={`${barColor} h-full transition-all duration-300`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>
      <div className="text-sm text-gray-700">
        {allocated} / {max} - ({Math.round(percent)}%) Allocated
      </div>
    </div>
  );
};

export default CapacityBar;
