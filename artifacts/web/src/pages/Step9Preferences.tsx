import { useState } from "react";
import StepLayout from "../components/StepLayout";

interface Props { onNext: () => void; onBack: () => void; }

export default function Step9Preferences({ onNext, onBack }: Props) {
  const [notifications, setNotifications] = useState({
    email: true,
    whatsapp: false,
    app: true,
  });
  const [updates, setUpdates] = useState(true);
  const [newsletter, setNewsletter] = useState(false);

  const Toggle = ({ val, onChange }: { val: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ${val ? "bg-[#A01550]" : "bg-gray-200"}`}
    >
      <div
        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${val ? "translate-x-4" : ""}`}
      />
    </button>
  );

  return (
    <StepLayout step={9} label="Meldingen & voorkeuren">
      <div className="p-4 sm:p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">Meldingen & voorkeuren</h2>
        <p className="text-sm text-gray-500 mb-5">
          Hoe wil je op de hoogte blijven van je matches en afspraken?
        </p>

        <div className="space-y-4 mb-6">
          <div className="p-4 rounded-xl border border-gray-200">
            <div className="text-sm font-semibold text-gray-800 mb-3">Meldingen via</div>
            <div className="space-y-3">
              {[
                { key: "email" as const, label: "E-mail", icon: "📧" },
                { key: "whatsapp" as const, label: "WhatsApp", icon: "💬" },
                { key: "app" as const, label: "App-melding", icon: "🔔" },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </div>
                  <Toggle
                    val={notifications[item.key]}
                    onChange={() =>
                      setNotifications(n => ({ ...n, [item.key]: !n[item.key] }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-gray-200">
            <div className="text-sm font-semibold text-gray-800 mb-3">Overige instellingen</div>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm text-gray-700">Voortgangsupdates</div>
                  <div className="text-xs text-gray-400">Wekelijks overzicht van je activiteiten</div>
                </div>
                <Toggle val={updates} onChange={() => setUpdates(u => !u)} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm text-gray-700">Nieuwsbrief</div>
                  <div className="text-xs text-gray-400">Careibu nieuws en inspiratie</div>
                </div>
                <Toggle val={newsletter} onChange={() => setNewsletter(n => !n)} />
              </div>
            </div>
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
