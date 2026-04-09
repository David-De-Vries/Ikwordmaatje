import ProgressBar from "./ProgressBar";

interface StepLayoutProps {
  step: number;
  totalSteps?: number;
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}

export default function StepLayout({
  step,
  totalSteps = 10,
  label,
  children,
  wide = false,
}: StepLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#8CBFBB" }}>
      <ProgressBar step={step} totalSteps={totalSteps} label={label} />
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div
          className="bg-white rounded-2xl shadow-xl w-full"
          style={{ maxWidth: wide ? 720 : 560 }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
