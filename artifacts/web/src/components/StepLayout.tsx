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
}: StepLayoutProps) {
  return (
    <div className="min-h-screen flex justify-center" style={{ backgroundColor: "#8CBFBB" }}>
      <div className="flex flex-col w-full bg-white" style={{ maxWidth: 480 }}>
        <ProgressBar step={step} totalSteps={totalSteps} label={label} />
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
