import React, { createContext, useContext, useState } from "react";

interface OnboardingData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dob: string;
  pronouns: string;
  phone: string;
  language: string;
  education: string;
  wantsInternship: boolean;
  internshipCourse: string;
  internshipSchool: string;
  internshipStart: string;
  internshipEnd: string;
  internshipHoursPerWeek: number;
  project: string;
  activities: string[];
  dementiaExperience: string;
  comfortScore: number;
  availabilityDays: Array<{ day: string; start: string; end: string }>;
  address: string;
  travelKm: number;
}

interface OnboardingCtx {
  data: OnboardingData;
  update: (partial: Partial<OnboardingData>) => void;
}

const defaults: OnboardingData = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  dob: "",
  pronouns: "",
  phone: "",
  language: "Nederlands",
  education: "",
  wantsInternship: false,
  internshipCourse: "",
  internshipSchool: "",
  internshipStart: "",
  internshipEnd: "",
  internshipHoursPerWeek: 0,
  project: "",
  activities: [],
  dementiaExperience: "",
  comfortScore: 5,
  availabilityDays: [],
  address: "",
  travelKm: 10,
};

const Ctx = createContext<OnboardingCtx>({ data: defaults, update: () => {} });

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<OnboardingData>(defaults);
  const update = (partial: Partial<OnboardingData>) =>
    setData((prev) => ({ ...prev, ...partial }));
  return <Ctx.Provider value={{ data, update }}>{children}</Ctx.Provider>;
}

export function useOnboarding() {
  return useContext(Ctx);
}
