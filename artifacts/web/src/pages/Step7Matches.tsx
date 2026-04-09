import { useState } from "react";
import StepLayout from "../components/StepLayout";

interface Props { onNext: () => void; onBack: () => void; }

const MATCHES = [
  {
    name: "Mevrouw Janssen",
    age: 78,
    city: "Amsterdam",
    distance: "1.2 km",
    projects: ["Wandelmaatje", "Leesclub"],
    emoji: "👵",
    bg: "#FEF3C7",
    desc: "Ik hou van wandelingen in het park en lees graag historische romans.",
    compatibility: 94,
  },
  {
    name: "Dhr. De Boer",
    age: 83,
    city: "Amsterdam",
    distance: "2.8 km",
    projects: ["Digitale Maatje"],
    emoji: "👴",
    bg: "#DBEAFE",
    desc: "Wil graag leren video-bellen met mijn kleinkinderen in Canada.",
    compatibility: 88,
  },
  {
    name: "Mevrouw Bakker",
    age: 71,
    city: "Amstelveen",
    distance: "4.1 km",
    projects: ["Samen Koken", "Creatief Atelier"],
    emoji: "🧓",
    bg: "#D1FAE5",
    desc: "Ik was vroeger kok en deel graag recepten. Ik schilder ook graag.",
    compatibility: 82,
  },
];

export default function Step7Matches({ onNext, onBack }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <StepLayout step={7} label="Jouw matches">
      <div className="p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">Jouw matches</h2>
        <p className="text-sm text-gray-500 mb-5">
          We hebben de beste senioren voor je gevonden. Kies iemand voor een kennismaking.
        </p>

        <div className="space-y-3 mb-6">
          {MATCHES.map((m, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`w-full text-left rounded-xl border-2 p-4 transition-all ${
                selected === i
                  ? "border-[#A01550] bg-[#FFF5F8]"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                  style={{ backgroundColor: m.bg }}
                >
                  {m.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{m.name}</div>
                      <div className="text-xs text-gray-500">{m.age} jaar · {m.city} · {m.distance}</div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <div className="text-sm font-bold text-[#A01550]">{m.compatibility}%</div>
                      <div className="text-xs text-gray-400">match</div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{m.desc}</p>
                  <div className="flex flex-wrap gap-1">
                    {m.projects.map(p => (
                      <span key={p} className="px-2 py-0.5 rounded-full bg-[#FFF0F5] text-[#A01550] text-xs font-medium">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
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
            onClick={onNext}
            disabled={selected === null}
            className="flex-1 py-3 rounded-lg bg-[#A01550] text-white text-sm font-semibold hover:bg-[#87113f] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Kennismaking plannen
          </button>
        </div>
      </div>
    </StepLayout>
  );
}
