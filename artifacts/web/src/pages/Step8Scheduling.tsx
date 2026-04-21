import { useState } from "react";
import StepLayout from "../components/StepLayout";

interface Props { onNext: () => void; onBack: () => void; }

const TIMES = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];
const DATES = [
  { label: "Ma 14 apr", sub: "2 plekken vrij" },
  { label: "Di 15 apr", sub: "3 plekken vrij" },
  { label: "Wo 16 apr", sub: "1 plek vrij" },
  { label: "Do 17 apr", sub: "4 plekken vrij" },
];

export default function Step8Scheduling({ onNext, onBack }: Props) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [note, setNote] = useState("");

  return (
    <StepLayout step={8} label="Plan een kennismaking">
      <div className="p-4 sm:p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">Plan een kennismaking</h2>
        <p className="text-sm text-gray-500 mb-5">
          Kies een datum en tijd voor jullie eerste kennismaking.
        </p>

        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-800 mb-2">Datum</label>
          <div className="grid grid-cols-2 gap-2">
            {DATES.map(d => (
              <button
                key={d.label}
                onClick={() => setSelectedDate(d.label)}
                className={`p-3 rounded-xl border-2 text-left transition ${
                  selectedDate === d.label
                    ? "border-[#A01550] bg-[#FFF5F8]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-sm font-medium text-gray-800">{d.label}</div>
                <div className="text-xs text-gray-500">{d.sub}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-800 mb-2">Tijdstip</label>
          <div className="grid grid-cols-3 gap-2">
            {TIMES.map(t => (
              <button
                key={t}
                onClick={() => setSelectedTime(t)}
                className={`py-2 rounded-lg border text-sm font-medium transition ${
                  selectedTime === t
                    ? "border-[#A01550] bg-[#A01550] text-white"
                    : "border-gray-200 text-gray-700 hover:border-gray-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-800 mb-1">Bericht (optioneel)</label>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={3}
            placeholder="Stel jezelf kort voor..."
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#A01550]/30 focus:border-[#A01550]"
          />
        </div>

        {selectedDate && selectedTime && (
          <div className="mb-4 p-3 rounded-xl bg-[#F0FDF4] border border-green-200">
            <p className="text-sm text-green-700 font-medium">
              ✓ Kennismaking gepland: {selectedDate} om {selectedTime}
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 py-3 rounded-lg border border-[#A01550] text-[#A01550] text-sm font-medium hover:bg-[#FFF5F8] transition"
          >
            Terug
          </button>
          <button
            onClick={onNext}
            disabled={!selectedDate || !selectedTime}
            className="flex-1 py-3 rounded-lg bg-[#A01550] text-white text-sm font-semibold hover:bg-[#87113f] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Bevestigen
          </button>
        </div>
      </div>
    </StepLayout>
  );
}
