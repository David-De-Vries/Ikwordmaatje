import { useState } from "react";
import { useOnboarding } from "../context/OnboardingContext";

interface Props { onNext: () => void; }

export default function SignupPage({ onNext }: Props) {
  const { update } = useOnboarding();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleContinue = () => {
    if (!email || !password) {
      setError("Vul je e-mailadres en wachtwoord in.");
      return;
    }
    update({ email, password });
    onNext();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#8CBFBB" }}>
      <div className="bg-white rounded-2xl shadow-xl w-full p-8" style={{ maxWidth: 480 }}>
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-[#A01550] tracking-tight mb-1">careibu</div>
          <p className="text-gray-400 text-sm">Vrijwilligers platform voor senioren</p>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-1">Maak een account</h2>
        <p className="text-sm text-gray-500 mb-6">Kom ons team versterken als vrijwilliger!</p>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            {error}
          </div>
        )}

        <div className="space-y-3 mb-4">
          <button
            onClick={handleContinue}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg border border-[#E0E0E0] bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
            Doorgaan met Google
          </button>
          <button
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg border border-[#E0E0E0] bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            Doorgaan met LinkedIn
          </button>
        </div>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">of met e-mail</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mailadres</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jouw@email.nl"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#A01550]/30 focus:border-[#A01550]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Wachtwoord</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimaal 8 tekens"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#A01550]/30 focus:border-[#A01550]"
            />
          </div>
        </div>

        <button
          onClick={handleContinue}
          className="mt-5 w-full py-3 rounded-lg bg-[#A01550] text-white text-sm font-semibold hover:bg-[#87113f] transition"
        >
          Account aanmaken
        </button>

        <p className="mt-4 text-center text-xs text-gray-400">
          Heb je al een account?{" "}
          <button className="text-[#A01550] font-medium hover:underline">Inloggen</button>
        </p>
        <p className="mt-3 text-center text-xs text-gray-400">
          Door je te registreren ga je akkoord met onze{" "}
          <span className="text-[#A01550] cursor-pointer hover:underline">Gebruiksvoorwaarden</span>{" "}
          en{" "}
          <span className="text-[#A01550] cursor-pointer hover:underline">Privacybeleid</span>.
        </p>
      </div>
    </div>
  );
}
