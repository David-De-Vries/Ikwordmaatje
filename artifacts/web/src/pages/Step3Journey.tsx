import StepLayout from "../components/StepLayout";

interface Props { onNext: () => void; onBack: () => void; }

const STEPS = [
  {
    icon: "📋",
    title: "Aanmelden",
    desc: "Je maakt een account aan en vult je profiel in. We leren je kennen.",
    color: "#FEF3C7",
  },
  {
    icon: "🤝",
    title: "Matching",
    desc: "Op basis van jouw interesses, locatie en beschikbaarheid zoeken we de beste match.",
    color: "#DBEAFE",
  },
  {
    icon: "☕",
    title: "Kennismaking",
    desc: "Je maakt kennis met je toekomstige senior. Een kopje koffie of een wandelingetje.",
    color: "#D1FAE5",
  },
  {
    icon: "⭐",
    title: "Van start!",
    desc: "Jullie starten het project. Careibu begeleidt jullie de eerste weken.",
    color: "#FCE7F3",
  },
];

export default function Step3Journey({ onNext, onBack }: Props) {
  return (
    <StepLayout step={3} label="Jouw tijd bij Careibu">
      <div className="p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">Jouw tijd bij Careibu</h2>
        <p className="text-sm text-gray-500 mb-6">
          Van aanmelding tot actief vrijwilliger — dit is hoe het werkt.
        </p>

        <div className="relative">
          <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-[#E5E7EB]" />
          <div className="space-y-5">
            {STEPS.map((s, i) => (
              <div key={i} className="flex gap-4 relative">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0 z-10"
                  style={{ backgroundColor: s.color }}
                >
                  {s.icon}
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 rounded-full bg-[#A01550] text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="text-sm font-semibold text-gray-800">{s.title}</div>
                  </div>
                  <p className="text-sm text-gray-500 pl-7">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 p-4 rounded-xl bg-[#FFF5F8] border border-[#F5C6D6]">
          <p className="text-sm text-[#A01550] font-medium">
            💡 Gemiddeld 2–4 uur per week. Jij bepaalt het tempo!
          </p>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onBack}
            className="flex-1 py-3 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
          >
            Terug
          </button>
          <button
            onClick={onNext}
            className="flex-1 py-3 rounded-lg bg-[#A01550] text-white text-sm font-semibold hover:bg-[#87113f] transition"
          >
            Volgende
          </button>
        </div>
      </div>
    </StepLayout>
  );
}
