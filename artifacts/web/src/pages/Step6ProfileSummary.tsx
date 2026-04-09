import StepLayout from "../components/StepLayout";
import { useOnboarding } from "../context/OnboardingContext";

interface Props { onNext: () => void; onBack: () => void; }

export default function Step6ProfileSummary({ onNext, onBack }: Props) {
  const { data } = useOnboarding();

  const rows = [
    { label: "Naam", value: `${data.firstName} ${data.lastName}`.trim() || "—" },
    { label: "Geboortedatum", value: data.dob || "—" },
    { label: "Voornaamwoorden", value: data.pronouns || "—" },
    { label: "Telefoon", value: data.phone || "—" },
    { label: "Taal", value: data.language || "—" },
    { label: "Opleiding", value: data.education || "—" },
    { label: "Project", value: data.project || "—" },
    { label: "Activiteiten", value: data.activities.join(", ") || "—" },
    { label: "Dementie ervaring", value: data.dementiaExperience || "—" },
    { label: "Comfortniveau", value: `${data.comfortScore}/10` },
    { label: "Beschikbaar", value: data.availabilityDays.map(d => d.day).join(", ") || "—" },
    { label: "Reisafstand", value: `${data.travelKm} km` },
    { label: "Adres", value: data.address || "—" },
  ];

  return (
    <StepLayout step={6} label="Profieloverzicht">
      <div className="p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#FFF0F5] border-2 border-[#A01550] flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">
              {data.firstName ? data.firstName[0].toUpperCase() : "👤"}
            </span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            {data.firstName ? `Hoi, ${data.firstName}!` : "Jouw profiel"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">Controleer je gegevens voor we doorgaan.</p>
        </div>

        <div className="space-y-2 mb-6">
          {rows.map(r => (
            <div key={r.label} className="flex items-start py-2 border-b border-gray-100 last:border-0">
              <span className="text-xs text-gray-500 w-36 flex-shrink-0 pt-0.5">{r.label}</span>
              <span className="text-sm text-gray-800 font-medium flex-1">{r.value}</span>
            </div>
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
            onClick={onNext}
            className="flex-1 py-3 rounded-lg bg-[#A01550] text-white text-sm font-semibold hover:bg-[#87113f] transition"
          >
            Bevestigen
          </button>
        </div>
      </div>
    </StepLayout>
  );
}
