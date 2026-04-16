import React from "react";

import DashboardScreen, { DashboardModeContext } from "./dashboard";

export default function DashboardActiveScreen() {
  return (
    <DashboardModeContext.Provider value={{ allTasksDone: true, hideTaskList: true }}>
      <DashboardScreen />
    </DashboardModeContext.Provider>
  );
}
