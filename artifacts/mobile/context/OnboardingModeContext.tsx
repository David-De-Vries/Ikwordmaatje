import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";

interface OnboardingModeContextValue {
  isOnboardingMode: boolean;
}

const OnboardingModeContext = createContext<OnboardingModeContextValue>({
  isOnboardingMode: false,
});

export function OnboardingModeProvider({ children }: { children: React.ReactNode }) {
  const [isOnboardingMode, setIsOnboardingMode] = useState(false);

  useEffect(() => {
    if (Platform.OS === "web") {
      try {
        const params = new URLSearchParams(window.location.search);
        if (params.get("flow") === "onboarding") {
          setIsOnboardingMode(true);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  return (
    <OnboardingModeContext.Provider value={{ isOnboardingMode }}>
      {children}
    </OnboardingModeContext.Provider>
  );
}

export function useOnboardingMode() {
  return useContext(OnboardingModeContext);
}
