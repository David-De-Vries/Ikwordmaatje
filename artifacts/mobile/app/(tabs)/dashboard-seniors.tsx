import React from "react";

import DashboardScreen, { DashboardModeContext } from "./dashboard";

export default function DashboardSeniorsScreen() {
  return (
    <DashboardModeContext.Provider value={{ allTasksDone: true, hideTaskList: false }}>
      <DashboardScreen />
    </DashboardModeContext.Provider>
  );
}
