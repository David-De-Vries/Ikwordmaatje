import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";

interface OnboardingModeContextValue {
  isOnboardingMode: boolean;
}

const OnboardingModeContext = createContext<OnboardingModeContextValue>({
  isOnboardingMode: false,
});

function hasOnboardingParam(url: string): boolean {
  try {
    const q = url.indexOf("?");
    if (q === -1) return false;
    const params = new URLSearchParams(url.slice(q));
    return params.get("flow") === "onboarding";
  } catch {
    return false;
  }
}

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
