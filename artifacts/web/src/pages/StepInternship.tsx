import { useState, useRef } from "react";
import StepLayout from "../components/StepLayout";
import { useOnboarding } from "../context/OnboardingContext";

interface Props { onNext: () => void; onBack: () => void; }

const SCHOOLS = [
  "HvA – Hogeschool van Amsterdam",
  "VU – Vrije Universiteit Amsterdam",
  "UvA – Universiteit van Amsterdam",
  "Erasmus Universiteit Rotterdam",
  "TU Delft",
  "TU/e – Technische Universiteit Eindhoven",
  "Radboud Universiteit",
  "Universiteit Utrecht",
  "Rijksuniversiteit Groningen",
  "Tilburg University",
  "Maastricht University",
  "Universiteit Twente",
  "Hogeschool Rotterdam",
  "Fontys Hogescholen",
  "Windesheim",
  "Saxion Hogeschool",
  "Hanze Hogeschool",
  "NHL Stenden",
  "Avans Hogeschool",
  "Inholland",
];

const MONTHS = [
  "Januari", "Februari", "Maart", "April", "Mei", "Juni",
  "Juli", "Augustus", "September", "Oktober", "November", "December",
];

const YEARS = ["2026", "2027"];

export default function StepInternship({ onNext, onBack }: Props) {
  const { data, update } = useOnboarding();
  const [course, setCourse] = useState(data.internshipCourse);
  const [school, setSchool] = useState(data.internshipSchool);
  const [schoolQuery, setSchoolQuery] = useState(data.internshipSchool);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [startMonth, setStartMonth] = useState((data.internshipStart || "").split("-")[0] || "");
  const [startYear, setStartYear] = useState((data.internshipStart || "").split("-")[1] || "");
  const [endMonth, setEndMonth] = useState((data.internshipEnd || "").split("-")[0] || "");
  const [endYear, setEndYear] = useState((data.internshipEnd || "").split("-")[1] || "");
  const [hours, setHours] = useState<number | "">(data.internshipHoursPerWeek || "");
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = SCHOOLS.filter(
    (s) => schoolQuery.length > 0 && s.toLowerCase().includes(schoolQuery.toLowerCase()) && s !== school
  ).slice(0, 5);

  const handleSelectSchool = (s: string) => {
    setSchool(s);
    setSchoolQuery(s);
    setShowSuggestions(false);
  };

  const isComplete = Boolean(course && (school || schoolQuery) && startMonth && startYear && endMonth && endYear && hours !== "");

  const handleNext = () => {
    update({
      internshipCourse: course,
      internshipSchool: school || schoolQuery,
      internshipStart: startMonth && startYear ? `${startMonth}-${startYear}` : "",
      internshipEnd: endMonth && endYear ? `${endMonth}-${endYear}` : "",
      internshipHoursPerWeek: Number(hours) || 0,
    });
    onNext();
  };

  return (
    <StepLayout step={2} totalSteps={11} label="Jouw stage">
      <div className="p-4 sm:p-8">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-gray-800">Jouw stage bij Careibu</h2>
          <p className="text-sm text-gray-500">Vertel ons iets over je stageplek.</p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Welke opleiding volg je?
            </label>
            <input
              type="text"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              placeholder="Bijv. Social Work, HBO Verpleegkunde, Psychologie…"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#A01550]/30 focus:border-[#A01550]"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Aan welke school?
            </label>
            <input
              ref={inputRef}
              type="text"
              value={schoolQuery}
              onChange={(e) => {
                setSchoolQuery(e.target.value);
                setSchool("");
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Zoek op naam, bijv. HvA, VU, Erasmus…"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#A01550]/30 focus:border-[#A01550]"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onMouseDown={() => handleSelectSchool(s)}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-[#FFF5F8] hover:text-[#A01550] transition border-b border-gray-100 last:border-0"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gewenste stageperiode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-gray-500 mb-1.5">Van</div>
                <div className="flex gap-2">
                  <select
                    value={startMonth}
                    onChange={(e) => setStartMonth(e.target.value)}
                    className="flex-1 px-2 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#A01550]/30 focus:border-[#A01550] bg-white"
                  >
                    <option value="">Maand</option>
                    {MONTHS.map((m) => <option key={m}>{m}</option>)}
                  </select>
                  <select
                    value={startYear}
                    onChange={(e) => setStartYear(e.target.value)}
                    className="w-20 px-2 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#A01550]/30 focus:border-[#A01550] bg-white"
                  >
                    <option value="">Jaar</option>
                    {YEARS.map((y) => <option key={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1.5">Tot</div>
                <div className="flex gap-2">
                  <select
                    value={endMonth}
                    onChange={(e) => setEndMonth(e.target.value)}
                    className="flex-1 px-2 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#A01550]/30 focus:border-[#A01550] bg-white"
                  >
                    <option value="">Maand</option>
                    {MONTHS.map((m) => <option key={m}>{m}</option>)}
                  </select>
                  <select
                    value={endYear}
                    onChange={(e) => setEndYear(e.target.value)}
                    className="w-20 px-2 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#A01550]/30 focus:border-[#A01550] bg-white"
                  >
                    <option value="">Jaar</option>
                    {YEARS.map((y) => <option key={y}>{y}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Aantal uren per week
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={40}
                value={hours}
                onChange={(e) => setHours(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="Bijv. 24"
                className="w-32 px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#A01550]/30 focus:border-[#A01550]"
              />
              <span className="text-sm text-gray-500">uren / week</span>
            </div>
            <div className="flex gap-2 mt-2 flex-wrap">
              {[8, 16, 24, 32, 40].map((h) => (
                <button
                  key={h}
                  onClick={() => setHours(h)}
                  className={`px-3 py-1 rounded-full text-xs border transition ${
                    hours === h
                      ? "bg-[#A01550] text-white border-[#A01550]"
                      : "bg-white text-gray-500 border-gray-200 hover:border-[#A01550]"
                  }`}
                >
                  {h} uur
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className="rounded-xl border mb-6 overflow-hidden transition-all duration-500 ease-out"
          style={{
            maxHeight: isComplete ? "80px" : "0px",
            opacity: isComplete ? 1 : 0,
            transform: isComplete ? "translateY(0)" : "translateY(10px)",
            borderColor: isComplete ? "#A01550" : "transparent",
            padding: isComplete ? "12px" : "0px",
          }}
        >
          <p className="text-xs text-[#A01550]">
            Jouw stagegegevens worden doorgestuurd naar ons stagebegeleiders-team. Je hoort snel van ons!
          </p>
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
            className="flex-1 py-3 rounded-lg bg-[#A01550] text-white text-sm font-semibold hover:bg-[#87113f] transition"
          >
            Volgende
          </button>
        </div>
      </div>
    </StepLayout>
  );
}
