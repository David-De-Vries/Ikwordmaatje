import StepLayout from "../components/StepLayout";

interface Props { onNext: () => void; onBack: () => void; }

const STEPS = [
  {
    color: "#F4B5AD",
    title: "Jij kiest een project dat bij je past",
    content: (
      <>
        <p className="text-sm text-gray-600">
          Maak impact op jouw manier. Kies een project dat aansluit bij wat jij leuk vindt en waar jij energie van krijgt.
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Twijfel je nog?&nbsp; Onze coördinatoren denken met je mee en helpen je kiezen.
        </p>
      </>
    ),
  },
  {
    color: "#8CBFBB",
    title: "We matchen je met de juiste senior",
    content: (
      <>
        <p className="text-sm text-gray-600">
          Tijdens een kort kennismakingsgesprek kijken we naar jouw interesses en beschikbaarheid.
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Daarna koppelen we je aan een maatje die écht bij je past.
        </p>
      </>
    ),
  },
  {
    color: "#F5A87A",
    title: "Je start je project",
    content: (
      <>
        <p className="text-sm text-gray-600">Je kan aan de slag! Tijdens je traject:</p>
        <ul className="mt-1 space-y-0.5 pl-4 list-disc">
          <li className="text-sm text-gray-600">Doe je activiteiten met je maatje</li>
          <li className="text-sm text-gray-600">Houd je een logboek bij</li>
          <li className="text-sm text-gray-600">Krijg je tips en coaching voor je persoonlijke en professionele groei</li>
        </ul>
      </>
    ),
  },
  {
    color: "#7DC87A",
    title: "Je ontvang een MDT-Certificaat",
    content: (
      <p className="text-sm text-gray-600">
        Klaar met je project? Dan krijg je een officieel MDT-certificaat. Een mooie bevestiging dat jij je hebt ingezet voor een ander{" "}
        <span className="text-[#A01550] font-medium">(en goed voor je CV )</span>
      </p>
    ),
  },
];

export default function Step3Journey({ onNext, onBack }: Props) {
  return (
    <StepLayout step={3} label="Jouw Tijd Bij Careibu">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Jouw Tijd Bij Careibu</h2>
        <p className="text-sm text-gray-500 mb-7">
          Dit kan je verwachten in de komende periode
        </p>

        <div className="space-y-6">
          {STEPS.map((s, i) => (
            <div key={i} className="flex gap-4">
              <div
                className="w-11 h-11 rounded-xl flex-shrink-0"
                style={{ backgroundColor: s.color }}
              />
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-800 mb-1">{s.title}</p>
                {s.content}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-3 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
          >
            ← terug
          </button>
          <button
            onClick={onNext}
            className="flex-1 py-3 rounded-lg bg-[#A01550] text-white text-sm font-semibold hover:bg-[#87113f] transition"
          >
            Aan de slag!
          </button>
        </div>
      </div>
    </StepLayout>
  );
}
