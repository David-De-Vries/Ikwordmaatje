import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Linking, Platform } from "react-native";

interface TestModeContextValue {
  isTestMode: boolean;
  activateTestMode: () => void;
}

const TestModeContext = createContext<TestModeContextValue>({
  isTestMode: false,
  activateTestMode: () => {},
});

function hasTestParam(url: string): boolean {
  try {
    const questionMark = url.indexOf("?");
    if (questionMark === -1) return false;
    const params = new URLSearchParams(url.slice(questionMark));
    return params.get("test") === "1";
  } catch {
    return false;
  }
}

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
    } else {
      Linking.getInitialURL().then((url) => {
        if (url && hasTestParam(url)) {
          setIsTestMode(true);
        }
      });
    }
  }, []);

  const activateTestMode = useCallback(() => {
    setIsTestMode(true);
  }, []);

  return (
    <TestModeContext.Provider value={{ isTestMode, activateTestMode }}>
      {children}
    </TestModeContext.Provider>
  );
}

export function useTestMode() {
  return useContext(TestModeContext);
}
