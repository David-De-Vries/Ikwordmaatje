import React from "react";

import DashboardScreen, { DashboardModeContext } from "./dashboard";

export default function DashboardSeniorsScreen() {
  return (
    <DashboardModeContext.Provider value={{ allTasksDone: true }}>
      <DashboardScreen />
    </DashboardModeContext.Provider>
  );
}
