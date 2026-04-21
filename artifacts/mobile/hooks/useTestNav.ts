import { Href, useRouter } from "expo-router";

import { useTestMode } from "@/context/TestModeContext";

const ALLOWED_IN_TEST_MODE = new Set([
  "/",
  "/signup",
  "/step1",
  "/stageinfo",
  "/step2",
  "/step3",
  "/step4",
  "/step5",
  "/step7",
  "/step8",
  "/loading",
  "/step9",
  "/step10",
  "/step11",
  "/dashboard",
  "/dashboard-intake",
]);

export function useTestNav() {
  const router = useRouter();
  const { isTestMode } = useTestMode();

  const push = (path: Href) => {
    if (isTestMode) {
      const basePath = typeof path === "string" ? path.split("?")[0] : "/";
      if (!ALLOWED_IN_TEST_MODE.has(basePath)) {
        return;
      }
    }
    router.push(path);
  };

  return { push, isTestMode };
}
