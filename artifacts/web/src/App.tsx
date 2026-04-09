import { useState } from "react";
import { OnboardingProvider } from "./context/OnboardingContext";
import SignupPage from "./pages/SignupPage";
import Step1PersonalInfo from "./pages/Step1PersonalInfo";
import StepInternship from "./pages/StepInternship";
import Step2Projects from "./pages/Step2Projects";
import Step3Journey from "./pages/Step3Journey";
import Step4Activities from "./pages/Step4Activities";
import Step5Availability from "./pages/Step5Availability";
import Step6ProfileSummary from "./pages/Step6ProfileSummary";
import Step7Matches from "./pages/Step7Matches";
import Step8Scheduling from "./pages/Step8Scheduling";
import Step9Preferences from "./pages/Step9Preferences";
import Step10Complete from "./pages/Step10Complete";
import DashboardPage from "./pages/DashboardPage";

type Screen =
  | "signup"
  | "step1"
  | "internship"
  | "step2"
  | "step3"
  | "step4"
  | "step5"
  | "step6"
  | "step7"
  | "step8"
  | "step9"
  | "step10"
  | "dashboard";

function AppContent() {
  const [screen, setScreen] = useState<Screen>("signup");

  const go = (s: Screen) => () => setScreen(s);

  switch (screen) {
    case "signup":
      return <SignupPage onNext={go("step1")} />;
    case "step1":
      return (
        <Step1PersonalInfo
          onNext={(wantsInternship) => setScreen(wantsInternship ? "internship" : "step2")}
          onBack={go("signup")}
        />
      );
    case "internship":
      return <StepInternship onNext={go("step2")} onBack={go("step1")} />;
    case "step2":
      return <Step2Projects onNext={go("step3")} onBack={go("step1")} />;
    case "step3":
      return <Step3Journey onNext={go("step4")} onBack={go("step2")} />;
    case "step4":
      return <Step4Activities onNext={go("step5")} onBack={go("step3")} />;
    case "step5":
      return <Step5Availability onNext={go("step6")} onBack={go("step4")} />;
    case "step6":
      return <Step6ProfileSummary onNext={go("step7")} onBack={go("step5")} />;
    case "step7":
      return <Step7Matches onNext={go("step8")} onBack={go("step6")} />;
    case "step8":
      return <Step8Scheduling onNext={go("step9")} onBack={go("step7")} />;
    case "step9":
      return <Step9Preferences onNext={go("step10")} onBack={go("step8")} />;
    case "step10":
      return <Step10Complete onNext={go("dashboard")} />;
    case "dashboard":
      return <DashboardPage />;
    default:
      return <SignupPage onNext={go("step1")} />;
  }
}

export default function App() {
  return (
    <OnboardingProvider>
      <AppContent />
    </OnboardingProvider>
  );
}
