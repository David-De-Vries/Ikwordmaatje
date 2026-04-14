import React from "react";

import DashboardScreen, { DashboardModeContext } from "./dashboard";

export default function DashboardCompleteScreen() {
  return (
    <DashboardModeContext.Provider value={{ allTasksDone: true }}>
      <DashboardScreen />
    </DashboardModeContext.Provider>
  );
}
