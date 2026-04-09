import { useState } from "react";
import StepLayout from "../components/StepLayout";
import { useOnboarding } from "../context/OnboardingContext";

interface Props { onNext: () => void; onBack: () => void; }

const PROJECTS = [
  {
    id: "boodschappen",
    name: "Boodschappen Vrienden",
    emoji: "🛒",
    desc: "Samen boodschappen doen met een senior uit jouw buurt.",
    color: "#FFF3E0",
    accent: "#F57C00",
  },
  {
    id: "wandelen",
    name: "Wandelmaatje",
    emoji: "🚶",
    desc: "Regelmatig wandelen en frisse lucht snuiven samen.",
    color: "#E8F5E9",
    accent: "#388E3C",
  },
  {
    id: "koken",
    name: "Samen Koken",
    emoji: "🍲",
    desc: "Ontdek gerechten en kook gezellig samen een maaltijd.",
    color: "#FCE4EC",
    accent: "#C2185B",
  },
  {
    id: "muziek",
    name: "Muziek Herinnert",
    emoji: "🎵",
    desc: "Muziek beluisteren en herinneringen ophalen.",
    color: "#E3F2FD",
    accent: "#1565C0",
  },
  {
    id: "digitaal",
    name: "Digitale Maatje",
    emoji: "💻",
    desc: "Hulp bij smartphone, tablet en internet.",
    color: "#F3E5F5",
    accent: "#7B1FA2",
  },
  {
    id: "sport",
    name: "Beweeg Buddy",
    emoji: "🏃",
    desc: "Sporten en bewegen met een enthousiaste buddy.",
    color: "#E0F2F1",
    accent: "#00796B",
  },
  {
    id: "kunst",
    name: "Creatief Atelier",
    emoji: "🎨",
    desc: "Samen schilderen, tekenen of knutselen.",
    color: "#FFF8E1",
    accent: "#F9A825",
  },
  {
    id: "lezen",
    name: "Leesclub",
    emoji: "📚",
    desc: "Boeken bespreken en voorlezen aan elkaar.",
    color: "#EDE7F6",
    accent: "#512DA8",
  },
];

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
                backgroundColor: selected === p.id ? p.color : "#FAFAFA",
                borderColor: selected === p.id ? p.accent : "#E5E7EB",
              }}
            >
              <div className="text-2xl mb-2">{p.emoji}</div>
              <div className="text-xs font-semibold text-gray-800 mb-1 leading-tight">{p.name}</div>
              <div className="text-xs text-gray-500 leading-relaxed">{p.desc}</div>
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 py-3 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
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
