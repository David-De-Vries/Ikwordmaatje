import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";

interface TestModeContextValue {
  isTestMode: boolean;
}

const TestModeContext = createContext<TestModeContextValue>({ isTestMode: false });

export function TestModeProvider({ children }: { children: React.ReactNode }) {
  const [isTestMode, setIsTestMode] = useState(false);

  useEffect(() => {
    if (Platform.OS === "web") {
      try {
        const params = new URLSearchParams(window.location.search);
        if (params.get("test") === "1") {
          setIsTestMode(true);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  return (
    <TestModeContext.Provider value={{ isTestMode }}>
      {children}
    </TestModeContext.Provider>
  );
}

export function useTestMode() {
  return useContext(TestModeContext);
}
