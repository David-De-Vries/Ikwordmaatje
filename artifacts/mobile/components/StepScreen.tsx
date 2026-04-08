import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { DS } from "@/constants/design-system";
import { ProgressHeader } from "@/components/ProgressHeader";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { Button } from "@/components/ui";

export const TOTAL_STEPS = 11;

export const STEP_NAMES: Record<number, string> = {
  1:  "Account",
  2:  "Project",
  3:  "Context",
  4:  "Preferences",
  5:  "Availability",
  6:  "Availability",
  7:  "Expectations",
  8:  "Summary",
  9:  "Matching",
  10: "Scheduling",
  11: "Ready",
};

interface StepScreenProps {
  step: number;
  children: React.ReactNode;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  showBack?: boolean;
  onBack?: () => void;
}

export function StepScreen({
  step,
  children,
  onNext,
  nextLabel = "Verder",
  nextDisabled = false,
  showBack = true,
  onBack,
}: StepScreenProps) {
  const insets = useSafeAreaInsets();
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + DS.spacing[3];

  const handleBack = onBack ?? (() => router.back());

  return (
    <View style={styles.screen}>
      <ProgressHeader step={step} totalSteps={TOTAL_STEPS} sectionName={STEP_NAMES[step] ?? ""} />

      <KeyboardAwareScrollViewCompat
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, DS.shadows.lg]}>
          {children}
        </View>
      </KeyboardAwareScrollViewCompat>

      <View style={[styles.nav, { paddingBottom: botPad }]}>
        {showBack && (
          <Button
            variant="outlined"
            color="neutral"
            onPress={handleBack}
            startIcon={<Feather name="arrow-left" size={14} color={DS.palette.text.secondary} />}
            style={styles.backBtn}
          >
            Terug
          </Button>
        )}
        <Button
          variant="contained"
          color="primary"
          size="lg"
          onPress={onNext}
          disabled={nextDisabled}
          style={showBack ? styles.nextBtn : styles.nextFull}
        >
          {nextLabel}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: DS.palette.background.default,
  },
  scroll: { flex: 1 },
  content: {
    padding: DS.spacing[4],
    paddingBottom: DS.spacing[3],
  },
  card: {
    backgroundColor: DS.palette.background.paper,
    borderRadius: DS.shape.borderRadius.xl,
    padding: DS.spacing[4],
    gap: DS.spacing[4],
  },
  nav: {
    flexDirection: "row",
    paddingHorizontal: DS.spacing[4],
    paddingTop: DS.spacing[3],
    gap: DS.spacing[3],
    backgroundColor: "transparent",
  },
  backBtn:  { minWidth: 100 },
  nextBtn:  { flex: 1 },
  nextFull: { flex: 1 },
});
