/**
 * ProgressHeader — Onboarding step progress bar
 *
 * Figma: Components / ProgressHeader
 *   Shows: step counter (left), section name, percentage (right),
 *          segmented progress bar
 */
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DS } from "@/constants/design-system";
import { useColors } from "@/hooks/useColors";

import { Typography } from "./ui/Typography";

interface ProgressHeaderProps {
  step: number;
  totalSteps: number;
  sectionName: string;
}

export function ProgressHeader({ step, totalSteps, sectionName }: ProgressHeaderProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const percent = Math.round((step / totalSteps) * 100);

  const topPad = Platform.OS === "web"
    ? Math.max(insets.top, 67)
    : insets.top;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: topPad + DS.spacing.sm },
      ]}
    >
      <View style={styles.labelRow}>
        <View style={styles.stepInfo}>
          <Typography variant="overline" color="textDisabled">
            Step {step} of {totalSteps}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {sectionName}
          </Typography>
        </View>
        <Typography variant="caption" color="textDisabled">
          {percent}%
        </Typography>
      </View>

      <View style={styles.segmentsRow}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.segment,
              {
                backgroundColor:
                  i < step ? colors.primary : DS.palette.border,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: DS.spacing.lg,
    paddingBottom: DS.spacing.md,
    gap: DS.spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: DS.palette.border,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  stepInfo: {
    gap: 1,
  },
  segmentsRow: {
    flexDirection: "row",
    gap: 3,
  },
  segment: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
});
