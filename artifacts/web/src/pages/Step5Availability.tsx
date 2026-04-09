import { useState } from "react";
import StepLayout from "../components/StepLayout";
import { useOnboarding } from "../context/OnboardingContext";

interface Props { onNext: () => void; onBack: () => void; }

const DAYS = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];
const DISTANCES = [2, 5, 10, 15, 20];

type Slot = { day: string; start: string; end: string };

export default function Step5Availability({ onNext, onBack }: Props) {
  const { data, update } = useOnboarding();
  const [slots, setSlots] = useState<Slot[]>(
    data.availabilityDays.length > 0
      ? data.availabilityDays
      : [{ day: "", start: "", end: "" }]
  );
  const [unknown, setUnknown] = useState(data.availabilityUnknown);
  const [address, setAddress] = useState(data.address);
  const [travelKm, setTravelKm] = useState(data.travelKm);

  const updateSlot = (index: number, field: keyof Slot, value: string) => {
    const next = slots.map((s, i) => (i === index ? { ...s, [field]: value } : s));
    setSlots(next);
  };

  const addSlot = () => setSlots(s => [...s, { day: "", start: "", end: "" }]);

  const removeSlot = (index: number) => {
    if (slots.length <= 1) return;
    setSlots(s => s.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    update({ availabilityDays: slots, availabilityUnknown: unknown, address, travelKm });
    onNext();
  };

  return (
    <StepLayout step={5} label="Beschikbaarheid & locatie">
      <div className="p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">Wanneer ben je beschikbaar?</h2>
        <p className="text-sm text-gray-500 mb-5">
          Kies de dagdelen waarop jij beschikbaar bent om een senior te bezoeken.
        </p>

        {!unknown && (
          <div className="mb-4 flex flex-col gap-3">
            {slots.map((slot, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-xl p-4 flex flex-col gap-3"
              >
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {DAYS.map(day => (
                    <button
                      key={day}
                      onClick={() => updateSlot(i, "day", slot.day === day ? "" : day)}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                        slot.day === day
                          ? "bg-[#f3e0e8] border-[#A01550] text-[#A01550]"
                          : "bg-white border-gray-200 text-gray-500 hover:border-[#A01550]"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="09:00"
                    value={slot.start}
                    onChange={e => updateSlot(i, "start", e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#A01550]/30 focus:border-[#A01550] text-center"
                  />
                  <span className="text-gray-400 text-sm">–</span>
                  <input
                    type="text"
                    placeholder="12:00"
                    value={slot.end}
                    onChange={e => updateSlot(i, "end", e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#A01550]/30 focus:border-[#A01550] text-center"
                  />
                  {slots.length > 1 && (
                    <button
                      onClick={() => removeSlot(i)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 transition"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              onClick={addSlot}
              className="flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-[#A01550] text-[#A01550] text-sm font-medium hover:bg-[#f9f0f4] transition"
            >
              <span className="text-lg leading-none">+</span>
              Dag toevoegen
            </button>
          </div>
        )}

        <div
          className={`flex items-center justify-between gap-3 p-4 rounded-xl border mb-5 transition ${
            unknown ? "border-[#A01550] bg-[#f3e0e8]" : "border-gray-200 bg-white"
          }`}
        >
          <div>
            <p className="text-sm font-semibold text-gray-800">Ik weet het nog niet</p>
            <p className="text-xs text-gray-500">Geen probleem, je kunt dit later invullen.</p>
          </div>
          <button
            onClick={() => setUnknown(u => !u)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
              unknown ? "bg-[#A01550]" : "bg-gray-200"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                unknown ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <hr className="border-gray-100 mb-5" />

        <h3 className="text-base font-semibold text-gray-800 mb-1">Jouw locatie</h3>
        <p className="text-sm text-gray-500 mb-4">We gebruiken dit om matches in de buurt te vinden.</p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Adres of postcode</label>
          <input
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="Bijv. Amsterdam of 1011 AB"
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#A01550]/30 focus:border-[#A01550]"
          />
        </div>

        <div className="mb-5">
          <label className="block text-xs text-gray-500 mb-2">Maximale reisafstand</label>
          <div className="flex flex-wrap gap-2">
            {DISTANCES.map(km => (
              <button
                key={km}
                onClick={() => setTravelKm(km)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition ${
                  travelKm === km
                    ? "bg-[#f3e0e8] border-[#A01550] text-[#A01550]"
                    : "bg-white border-gray-200 text-gray-500 hover:border-[#A01550]"
                }`}
              >
                {km} km
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center" style={{ height: 120, background: "linear-gradient(135deg,#E8F4F8 0%,#D1E8F0 50%,#C0DDE8 100%)" }}>
          <div className="text-center">
            <div className="text-2xl mb-1">🗺️</div>
            <div className="text-xs font-medium text-gray-600">Kaartweergave beschikbaar</div>
            <div className="text-xs text-gray-400">{address || "nadat je een adres hebt ingevuld"}</div>
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
            className="flex-2 py-3 px-8 rounded-lg bg-[#A01550] text-white text-sm font-semibold hover:bg-[#87113f] transition"
          >
            Volgende
          </button>
        </div>
      </div>
    </StepLayout>
  );
}
