import { useState } from "react";
import StepLayout from "../components/StepLayout";
import { useOnboarding } from "../context/OnboardingContext";

interface Props { onNext: () => void; onBack: () => void; }

const PROJECTS = Array.from({ length: 8 }, (_, i) => ({
  id: `project-${i + 1}`,
  name: `Project ${i + 1}`,
  desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
}));

export default function Step2Projects({ onNext, onBack }: Props) {
  const { data, update } = useOnboarding();
  const [selected, setSelected] = useState<string>(data.project);

  const handleNext = () => {
    update({ project: selected });
    onNext();
  };

  return (
    <StepLayout step={2} label="Jouw project" wide>
      <div className="p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">Kies jouw project</h2>
        <p className="text-sm text-gray-500 mb-6">
          Welk Careibu project spreekt jou het meeste aan? Je kunt er altijd van wisselen.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {PROJECTS.map(p => (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              className="flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all"
              style={{
                backgroundColor: selected === p.id ? "#FFF0F5" : "#FAFAFA",
                borderColor: selected === p.id ? "#A01550" : "#E5E7EB",
              }}
            >
              <div className="text-xs font-semibold text-gray-800 mb-1 leading-tight">{p.name}</div>
              <div className="text-xs text-gray-500 leading-relaxed">{p.desc}</div>
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 py-3 rounded-lg border border-[#A01550] text-[#A01550] text-sm font-medium hover:bg-[#FFF5F8] transition"
          >
            Terug
          </button>
          <button
            onClick={handleNext}
            disabled={!selected}
            className="flex-1 py-3 rounded-lg bg-[#A01550] text-white text-sm font-semibold hover:bg-[#87113f] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Volgende
          </button>
        </div>
      </div>
    </StepLayout>
  );
}
