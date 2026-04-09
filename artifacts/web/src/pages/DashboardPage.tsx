import { useState } from "react";
import { useOnboarding } from "../context/OnboardingContext";

const NAV = [
  { icon: "🏠", label: "Dashboard" },
  { icon: "🤝", label: "Matches" },
  { icon: "📅", label: "Agenda" },
  { icon: "💬", label: "Berichten" },
  { icon: "👤", label: "Profiel" },
];

const ACTIVITIES = [
  { time: "Gisteren", text: "Kennismakingsgesprek ingepland met Mevr. Janssen", icon: "📅" },
  { time: "2 dagen geleden", text: "Profiel aangemaakt en goedgekeurd", icon: "✅" },
  { time: "3 dagen geleden", text: "Match gevonden: 3 senioren in jouw buurt", icon: "🎉" },
];

const QUICK_ACTIONS = [
  { emoji: "💬", label: "Bericht sturen", color: "#DBEAFE" },
  { emoji: "📅", label: "Afspraak plannen", color: "#D1FAE5" },
  { emoji: "📋", label: "Rapport invullen", color: "#FEF3C7" },
  { emoji: "❓", label: "Hulp nodig?", color: "#F3E5F5" },
];

export default function DashboardPage() {
  const { data } = useOnboarding();
  const [activeNav, setActiveNav] = useState(0);
  const name = data.firstName || "vrijwilliger";

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#8CBFBB" }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-2xl font-bold text-[#A01550]">careibu</div>
            <div className="text-sm text-white/80">Vrijwilligersplatform</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white border-2 border-[#A01550] flex items-center justify-center text-[#A01550] font-bold">
              {name[0]?.toUpperCase() || "V"}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Goedemorgen, {name}! 👋</h1>
                  <p className="text-sm text-gray-500 mt-0.5">Jij maakt vandaag het verschil.</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#A01550]">7</div>
                  <div className="text-xs text-gray-500">weken actief</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Afspraken", value: "3", icon: "📅", color: "#E3F2FD" },
                  { label: "Uren", value: "12", icon: "⏱", color: "#F3E5F5" },
                  { label: "Matches", value: "94%", icon: "⭐", color: "#FFF3E0" },
                ].map(stat => (
                  <div
                    key={stat.label}
                    className="rounded-xl p-3 text-center"
                    style={{ backgroundColor: stat.color }}
                  >
                    <div className="text-lg">{stat.icon}</div>
                    <div className="text-lg font-bold text-gray-800">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-800">Je match</h2>
                <button className="text-xs text-[#A01550] font-medium hover:underline">Alle matches</button>
              </div>
              <div className="flex gap-4 p-4 rounded-xl bg-[#FFF5F8] border border-[#F5C6D6]">
                <div className="w-12 h-12 rounded-full bg-[#FEF3C7] flex items-center justify-center text-2xl">
                  👵
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">Mevrouw Janssen, 78 jaar</div>
                  <div className="text-xs text-gray-500 mb-1">Amsterdam · Wandelmaatje</div>
                  <div className="flex items-center gap-1">
                    <div className="w-16 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                      <div className="h-full bg-[#A01550] rounded-full" style={{ width: "94%" }} />
                    </div>
                    <span className="text-xs font-medium text-[#A01550]">94% match</span>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button className="px-3 py-1 rounded-lg bg-[#A01550] text-white text-xs font-medium">
                      Berichten
                    </button>
                    <button className="px-3 py-1 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium">
                      Profiel
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-800">Recente activiteit</h2>
              </div>
              <div className="space-y-3">
                {ACTIVITIES.map((a, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm flex-shrink-0">
                      {a.icon}
                    </div>
                    <div>
                      <div className="text-sm text-gray-700">{a.text}</div>
                      <div className="text-xs text-gray-400">{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-800 mb-3">Volgende afspraak</h2>
              <div className="p-3 rounded-xl bg-[#DBEAFE] text-center mb-3">
                <div className="text-2xl font-bold text-blue-700">14</div>
                <div className="text-sm text-blue-600">April</div>
                <div className="text-xs text-blue-500">10:00</div>
              </div>
              <div className="text-xs text-gray-600 text-center">
                Kennismaking met Mevr. Janssen
              </div>
              <button className="w-full mt-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition">
                Bekijk agenda
              </button>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-800 mb-3">Snelle acties</h2>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_ACTIONS.map(a => (
                  <button
                    key={a.label}
                    className="p-3 rounded-xl text-center border border-gray-100 hover:border-gray-200 transition"
                    style={{ backgroundColor: a.color }}
                  >
                    <div className="text-xl mb-1">{a.emoji}</div>
                    <div className="text-xs font-medium text-gray-700 leading-tight">{a.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-800 mb-2">Jouw voortgang</h2>
              <div className="space-y-2">
                {[
                  { label: "Profiel", pct: 100 },
                  { label: "Eerste gesprek", pct: 80 },
                  { label: "Actief project", pct: 20 },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">{item.label}</span>
                      <span className="text-[#A01550] font-medium">{item.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#A01550] rounded-full transition-all"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex justify-around max-w-lg mx-auto left-1/2 -translate-x-1/2 rounded-t-2xl shadow-lg" style={{ maxWidth: 480 }}>
        {NAV.map((n, i) => (
          <button
            key={n.label}
            onClick={() => setActiveNav(i)}
            className={`flex flex-col items-center py-1 px-3 rounded-lg transition ${
              activeNav === i ? "text-[#A01550]" : "text-gray-400"
            }`}
          >
            <span className="text-lg">{n.icon}</span>
            <span className="text-xs mt-0.5">{n.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
