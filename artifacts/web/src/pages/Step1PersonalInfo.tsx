import { useState } from "react";
import StepLayout from "../components/StepLayout";
import { useOnboarding } from "../context/OnboardingContext";

interface Props { onNext: () => void; onBack: () => void; }

const PRONOUNS = ["Hij/hem", "Zij/haar", "Hen/hun", "Geen voorkeur"];
const EDUCATIONS = [
  "Geen opleidding",
  "VMBO / MAVO",
  "HAVO / VWO",
  "MBO",
  "HBO",
  "WO / Universiteit",
  "Postdoctoraal",
];
const LANGUAGES = ["Nederlands", "Engels", "Duits", "Frans", "Turks", "Arabisch", "Anders"];

export default function Step1PersonalInfo({ onNext, onBack }: Props) {
  const { data, update } = useOnboarding();
  const [firstName, setFirstName] = useState(data.firstName);
  const [lastName, setLastName] = useState(data.lastName);
  const [dob, setDob] = useState(data.dob);
  const [pronouns, setPronouns] = useState(data.pronouns);
  const [phone, setPhone] = useState(data.phone);
  const [language, setLanguage] = useState(data.language);
  const [education, setEducation] = useState(data.education);

  const handleNext = () => {
    update({ firstName, lastName, dob, pronouns, phone, language, education });
    onNext();
  };

  return (
    <StepLayout step={1} label="Over jou">
      <div className="p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">Over jou</h2>
        <p className="text-sm text-gray-500 mb-6">Vertel ons iets over jezelf zodat senioren je beter kunnen leren kennen.</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Voornaam</label>
            <input
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="Jan"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#A01550]/30 focus:border-[#A01550]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Achternaam</label>
            <input
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder="de Vries"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#A01550]/30 focus:border-[#A01550]"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Geboortedatum</label>
          <input
            type="date"
            value={dob}
            onChange={e => setDob(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#A01550]/30 focus:border-[#A01550]"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Voornaamwoorden</label>
          <div className="flex flex-wrap gap-2">
            {PRONOUNS.map(p => (
              <button
                key={p}
                onClick={() => setPronouns(p)}
                className={`px-3 py-1.5 rounded-full text-sm border transition ${
                  pronouns === p
                    ? "bg-[#A01550] text-white border-[#A01550]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#A01550]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Telefoonnummer</label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="+31 6 00000000"
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#A01550]/30 focus:border-[#A01550]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Taal</label>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#A01550]/30 focus:border-[#A01550] bg-white"
            >
              {LANGUAGES.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Opleiding</label>
            <select
              value={education}
              onChange={e => setEducation(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#A01550]/30 focus:border-[#A01550] bg-white"
            >
              <option value="">Selecteer...</option>
              {EDUCATIONS.map(e => <option key={e}>{e}</option>)}
            </select>
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
