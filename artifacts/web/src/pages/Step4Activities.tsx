import { useState } from "react";
import StepLayout from "../components/StepLayout";
import { useOnboarding } from "../context/OnboardingContext";

interface Props { onNext: () => void; onBack: () => void; }

const ACTIVITIES = [
  { id: "wandelen", label: "Wandelen", emoji: "🚶" },
  { id: "koken", label: "Koken", emoji: "🍳" },
  { id: "muziek", label: "Muziek", emoji: "🎵" },
  { id: "lezen", label: "Lezen", emoji: "📚" },
  { id: "sport", label: "Sport", emoji: "⚽" },
  { id: "kunst", label: "Kunst", emoji: "🎨" },
  { id: "games", label: "Spelletjes", emoji: "🎲" },
  { id: "digitaal", label: "Digitaal", emoji: "💻" },
  { id: "tuinieren", label: "Tuinieren", emoji: "🌿" },
  { id: "boodschappen", label: "Boodschappen", emoji: "🛒" },
  { id: "film", label: "Films kijken", emoji: "🎬" },
  { id: "gezelschap", label: "Gezelschap", emoji: "☕" },
];

export default function Step4Activities({ onNext, onBack }: Props) {
  const { data, update } = useOnboarding();
  const [selected, setSelected] = useState<string[]>(data.activities);
  const [dementia, setDementia] = useState(data.dementiaExperience);
  const [comfort, setComfort] = useState(data.comfortScore);

  const toggle = (id: string) =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const handleNext = () => {
    update({ activities: selected, dementiaExperience: dementia, comfortScore: comfort });
    onNext();
  };

  return (
    <StepLayout step={4} label="Activiteiten & ervaring">
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">Activiteiten & ervaring</h2>
        <p className="text-sm text-gray-500 mb-5">
          Welke activiteiten doe je graag? Selecteer alles wat van toepassing is.
        </p>

        <div className="grid grid-cols-2 gap-2 mb-6">
          {ACTIVITIES.map(a => (
            <button
              key={a.id}
              onClick={() => toggle(a.id)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all ${
                selected.includes(a.id)
                  ? "bg-[#FFF0F5] border-[#A01550] text-[#A01550] font-medium"
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              <span>{a.emoji}</span>
              <span className="text-xs leading-tight">{a.label}</span>
            </button>
          ))}
        </div>

        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Heb je ervaring met dementie?
          </label>
          <div className="space-y-2">
            {["Ja, persoonlijke ervaring", "Ja, professionele ervaring", "Nee, maar ik wil leren", "Nee, liever niet"].map(opt => (
              <label key={opt} className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setDementia(opt)}
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center cursor-pointer transition ${
                    dementia === opt ? "border-[#A01550]" : "border-gray-300"
                  }`}
                >
                  {dementia === opt && <div className="w-2 h-2 rounded-full bg-[#A01550]" />}
                </div>
                <span className="text-sm text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-800">
              Hoe comfortabel voel je je bij ouderen?
            </label>
            <span className="text-sm font-bold text-[#A01550]">{comfort}/10</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={comfort}
            onChange={e => setComfort(Number(e.target.value))}
            className="w-full accent-[#A01550]"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Onzeker</span>
            <span>Heel comfortabel</span>
          </div>
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
            className="flex-1 py-3 rounded-lg bg-[#A01550] text-white text-sm font-semibold hover:bg-[#87113f] transition"
          >
            Volgende
          </button>
        </div>
      </div>
    </StepLayout>
  );
}
