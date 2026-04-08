/**
 * OnboardingContext — Persisted form state for the 11-step onboarding flow.
 * Uses AsyncStorage for persistence between app launches.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const STORAGE_KEY = "@careibu_onboarding_v1";

export interface AvailabilitySlot {
  day: string;
  startTime: string;
  endTime: string;
}

export interface OnboardingState {
  // Step 1: Account — About You
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  pronouns: string;
  phoneNumber: string;
  language: string;

  // Step 2: Project Selection
  selectedProject: string;
  projectUndecided: boolean;

  // Step 4: Preferences
  selectedActivities: string[];
  dementiaExperience: string;
  comfortLevel: number;

  // Step 5: Availability & Location
  availabilitySlots: AvailabilitySlot[];
  availabilityUnknown: boolean;
  address: string;
  travelDistance: number;

  // Step 7: Expectations
  expectationsAccepted: boolean;

  // Step 10: Schedule / Contact
  contactWhatsApp: boolean;
  contactEmail: boolean;
}

const defaultState: OnboardingState = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  pronouns: "",
  phoneNumber: "",
  language: "Nederlands",

  selectedProject: "",
  projectUndecided: false,

  selectedActivities: [],
  dementiaExperience: "",
  comfortLevel: 5,

  availabilitySlots: [{ day: "", startTime: "", endTime: "" }],
  availabilityUnknown: false,
  address: "",
  travelDistance: 5,

  expectationsAccepted: false,

  contactWhatsApp: true,
  contactEmail: false,
};

interface OnboardingContextValue {
  data: OnboardingState;
  update: (partial: Partial<OnboardingState>) => void;
  reset: () => void;
  isHydrated: boolean;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<OnboardingState>(defaultState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as Partial<OnboardingState>;
          setData((prev) => ({ ...prev, ...parsed }));
        } catch {
          // ignore corrupt data
        }
      }
      setIsHydrated(true);
    });
  }, []);

  const update = useCallback((partial: Partial<OnboardingState>) => {
    setData((prev) => {
      const next = { ...prev, ...partial };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setData(defaultState);
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  }, []);

  return (
    <OnboardingContext.Provider value={{ data, update, reset, isHydrated }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used inside OnboardingProvider");
  return ctx;
}
