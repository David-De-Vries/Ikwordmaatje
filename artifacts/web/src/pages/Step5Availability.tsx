import { useState } from "react";
import StepLayout from "../components/StepLayout";
import { useOnboarding } from "../context/OnboardingContext";

interface Props { onNext: () => void; onBack: () => void; }

const DAYS = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"];

export default function Step5Availability({ onNext, onBack }: Props) {
  const { data, update } = useOnboarding();
  const [address, setAddress] = useState(data.address);
  const [travelKm, setTravelKm] = useState(data.travelKm);
  const [selectedDays, setSelectedDays] = useState<string[]>(
    data.availabilityDays.map(d => d.day)
  );

  const toggleDay = (day: string) =>
    setSelectedDays(d => d.includes(day) ? d.filter(x => x !== day) : [...d, day]);

  const handleNext = () => {
    update({
      address,
      travelKm,
      availabilityDays: selectedDays.map(day => ({ day, start: "09:00", end: "17:00" })),
    });
    onNext();
  };

  return (
    <StepLayout step={5} label="Beschikbaarheid & locatie">
      <div className="p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">Beschikbaarheid & locatie</h2>
        <p className="text-sm text-gray-500 mb-5">
          Wanneer ben je beschikbaar en hoe ver wil je reizen?
        </p>

        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-800 mb-2">Welke dagen?</label>
          <div className="flex flex-wrap gap-2">
            {DAYS.map(day => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`px-3 py-1.5 rounded-lg text-sm border transition ${
                  selectedDays.includes(day)
                    ? "bg-[#A01550] text-white border-[#A01550]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#A01550]"
                }`}
              >
                {day.slice(0, 2)}
              </button>
            ))}
          </div>
          {selectedDays.length > 0 && (
            <p className="mt-2 text-xs text-gray-500">
              {selectedDays.join(", ")}
            </p>
          )}
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">Jouw adres</label>
          <input
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="Straat + huisnummer, Stad"
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#A01550]/30 focus:border-[#A01550]"
          />
        </div>

        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-800">Maximale reisafstand</label>
            <span className="text-sm font-bold text-[#A01550]">{travelKm} km</span>
          </div>
          <input
            type="range"
            min={1}
            max={50}
            value={travelKm}
            onChange={e => setTravelKm(Number(e.target.value))}
            className="w-full accent-[#A01550]"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1 km</span>
            <span>50 km</span>
          </div>
        </div>

        <div className="mb-6 rounded-xl overflow-hidden border border-gray-200" style={{ height: 180 }}>
          <div
            className="w-full h-full flex items-center justify-center text-gray-400 text-sm"
            style={{
              background: "linear-gradient(135deg, #E8F4F8 0%, #D1E8F0 50%, #C0DDE8 100%)",
            }}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">🗺️</div>
              <div className="text-sm font-medium text-gray-600">Kaartweergave</div>
              <div className="text-xs text-gray-400">{address || "Voer je adres in"}</div>
            </div>
          </div>
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
            className="flex-1 py-3 rounded-lg bg-[#A01550] text-white text-sm font-semibold hover:bg-[#87113f] transition"
          >
            Volgende
          </button>
        </div>
      </div>
    </StepLayout>
  );
}
