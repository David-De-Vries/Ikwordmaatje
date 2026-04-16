import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + DS.spacing.sm;

  const handleBack = onBack ?? (() => router.back());

  return (
    <View style={styles.screen}>
      <ProgressHeader step={step} totalSteps={TOTAL_STEPS} sectionName={STEP_NAMES[step] ?? ""} />

      <KeyboardAwareScrollViewCompat
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, DS.shadows.elevation2]}>
          {children}
        </View>
      </KeyboardAwareScrollViewCompat>

      <View style={[styles.nav, { paddingBottom: botPad }]}>
        {showBack && (
          <Button
            variant="outlined"
            color="default"
            onPress={handleBack}
            startIconName="arrow-left"
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
    backgroundColor: DS.palette.background.page,
  },
  scroll: { flex: 1 },
  content: {
    padding: DS.spacing.md,
    paddingBottom: DS.spacing.sm,
  },
  card: {
    backgroundColor: DS.palette.background.paper,
    borderRadius: DS.shape.radius.xl,
    padding: DS.spacing.md,
    gap: DS.spacing.md,
  },
  nav: {
    flexDirection: "row",
    paddingHorizontal: DS.spacing.md,
    paddingTop: DS.spacing.sm,
    gap: DS.spacing.sm,
    backgroundColor: "transparent",
  },
  backBtn:  { minWidth: 100 },
  nextBtn:  { flex: 1 },
  nextFull: { flex: 1 },
});
