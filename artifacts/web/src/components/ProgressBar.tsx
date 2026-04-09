interface ProgressBarProps {
  step: number;
  totalSteps: number;
  label: string;
}

export default function ProgressBar({ step, totalSteps, label }: ProgressBarProps) {
  const pct = Math.round((step / totalSteps) * 100);

  return (
    <div className="w-full bg-white border-b border-gray-100 px-6 py-3">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-xs font-medium text-gray-500">
              Step {step} of {totalSteps}
            </span>
            <div className="text-xs text-[#A01550] font-medium">{label}</div>
          </div>
          <span className="text-xs font-semibold text-gray-400">{pct}%</span>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className="h-[3px] flex-1 rounded-full transition-all duration-300"
              style={{
                backgroundColor: i < step ? "#A01550" : "#E5E7EB",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
