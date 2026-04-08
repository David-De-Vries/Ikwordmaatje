/**
 * Card — MUI-inspired elevated surface
 *
 * Figma: Components / Card
 *   Properties:
 *     elevation: 0 | 1 | 2 | 4 | 8
 *     padding: none | sm | md | lg
 *
 * Usage:
 *   <Card elevation={2} padding="lg">...</Card>
 */
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { DS } from "@/constants/design-system";
import { useColors } from "@/hooks/useColors";

type Elevation = 0 | 1 | 2 | 4 | 8;
type Padding = "none" | "sm" | "md" | "lg";

interface CardProps {
  elevation?: Elevation;
  padding?: Padding;
  borderRadius?: number;
  style?: ViewStyle;
  children?: React.ReactNode;
  testID?: string;
}

const elevationMap: Record<Elevation, object> = {
  0: DS.shadows.elevation0,
  1: DS.shadows.elevation1,
  2: DS.shadows.elevation2,
  4: DS.shadows.elevation4,
  8: DS.shadows.elevation8,
};

const paddingMap: Record<Padding, number> = {
  none: 0,
  sm: DS.spacing.md,
  md: DS.spacing.lg,
  lg: DS.spacing.xxl,
};

export function Card({
  elevation = 2,
  padding = "md",
  borderRadius,
  style,
  children,
  testID,
}: CardProps) {
  const colors = useColors();

  return (
    <View
      testID={testID}
      style={[
        styles.card,
        { backgroundColor: colors.card },
        elevationMap[elevation],
        {
          padding: paddingMap[padding],
          borderRadius: borderRadius ?? DS.shape.radius.md,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
  },
});
