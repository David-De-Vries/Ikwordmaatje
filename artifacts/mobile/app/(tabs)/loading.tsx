import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconBadge, Typography } from "@/components/ui";
import { DS } from "@/constants/design-system";
import { useColors } from "@/hooks/useColors";

const STEPS = [
  { iconName: "user" as const, color: "teal" as const, label: "Profiel aanmaken" },
  { iconName: "search" as const, color: "navy" as const, label: "Matches zoeken" },
  { iconName: "check-circle" as const, color: "green" as const, label: "Resultaten klaarzetten" },
];

export default function LoadingScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activeStep, setActiveStep] = useState(0);

  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setActiveStep(1), 900));
    timers.push(setTimeout(() => setActiveStep(2), 1800));
    timers.push(setTimeout(() => router.replace("/step9"), 3000));

    return () => timers.forEach(clearTimeout);
  }, []);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const topPad = Platform.OS === "web"
    ? Math.max(insets.top, 67)
    : insets.top;

  return (
    <View
      style={[
        styles.root,
        { backgroundColor: colors.background, paddingTop: topPad },
      ]}
    >
      <View style={styles.center}>
        <Animated.View
          style={[
            styles.spinnerRing,
            { borderColor: "#FFFFFF", transform: [{ rotate }] },
          ]}
        />

        <Typography variant="h4" style={{ color: "#FFFFFF" }} align="center">
          We verwerken je profiel
        </Typography>
        <Typography
          variant="body2"
          style={{ color: "#FFFFFF", opacity: 0.8 }}
          align="center"
        >
          Even geduld terwijl we jouw ideale matches zoeken.
        </Typography>

        <View style={styles.steps}>
          {STEPS.map((step, i) => (
            <View
              key={i}
              style={[
                styles.stepRow,
                { opacity: i <= activeStep ? 1 : 0.35 },
              ]}
            >
              <IconBadge
                iconName={i < activeStep ? "check" : step.iconName}
                color={i < activeStep ? "green" : step.color}
                size="md"
              />
              <Typography
                variant="body1"
                style={{
                  color: "#FFFFFF",
                  fontFamily:
                    i <= activeStep
                      ? DS.typography.fontFamily.semiBold
                      : DS.typography.fontFamily.regular,
                }}
              >
                {step.label}
              </Typography>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    alignItems: "center",
    gap: DS.spacing.xxl,
    paddingHorizontal: DS.spacing.xxxl,
  },
  spinnerRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderTopColor: "transparent",
  },
  steps: {
    gap: DS.spacing.lg,
    alignSelf: "stretch",
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.lg,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: DS.shape.radius.sm,
    padding: DS.spacing.md,
  },
});
