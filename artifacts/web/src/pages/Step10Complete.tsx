import StepLayout from "../components/StepLayout";
import { useOnboarding } from "../context/OnboardingContext";

interface Props { onNext: () => void; }

export default function Step10Complete({ onNext }: Props) {
  const { data } = useOnboarding();
  const name = data.firstName || "vrijwilliger";

  return (
    <StepLayout step={10} label="Welkom bij Careibu!">
      <div className="p-10 text-center">
        <div className="w-20 h-20 rounded-full bg-[#FFF0F5] border-4 border-[#A01550] flex items-center justify-center mx-auto mb-6 shadow-lg">
          <span className="text-4xl">🎉</span>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Welkom, {name}!
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Jouw profiel is klaar. Je maakt nu deel uit van een bijzondere gemeenschap van vrijwilligers die het verschil maken voor senioren.
        </p>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: "🤝", label: "Match gevonden" },
            { icon: "📅", label: "Afspraak gepland" },
            { icon: "🌟", label: "Profiel compleet" },
          ].map(item => (
            <div
              key={item.label}
              className="p-4 rounded-xl bg-gray-50 border border-gray-200"
            >
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-xs font-medium text-gray-700">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="mb-6 p-4 rounded-xl bg-[#FFF5F8] border border-[#F5C6D6] text-left">
          <div className="text-sm font-semibold text-[#A01550] mb-1">Wat nu?</div>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✓ We sturen je een bevestiging per e-mail</li>
            <li>✓ Je kennismakingsafspraak staat in je agenda</li>
            <li>✓ Careibu begeleidt jullie de eerste weken</li>
          </ul>
        </div>

        <button
          onClick={onNext}
          className="w-full py-3.5 rounded-xl bg-[#A01550] text-white text-sm font-semibold hover:bg-[#87113f] transition shadow-md"
        >
          Naar mijn dashboard →
        </button>
      </div>
    </StepLayout>
  );
}
