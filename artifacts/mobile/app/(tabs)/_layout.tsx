import { Stack } from "expo-router";
import React from "react";

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="step1" />
      <Stack.Screen name="stageinfo" />
      <Stack.Screen name="step2" />
      <Stack.Screen name="step3" />
      <Stack.Screen name="step4" />
      <Stack.Screen name="step5" />
      <Stack.Screen name="step7" />
      <Stack.Screen name="step8" />
      <Stack.Screen name="loading" />
      <Stack.Screen name="step9" />
      <Stack.Screen name="step10" />
      <Stack.Screen name="step11" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="dashboard-complete" />
      <Stack.Screen name="dashboard-intake" />
      <Stack.Screen name="dashboard-seniors" />
      <Stack.Screen name="dashboard-active" />
      <Stack.Screen name="seniors-list" />
      <Stack.Screen name="senior-profile" />
    </Stack>
  );
}
