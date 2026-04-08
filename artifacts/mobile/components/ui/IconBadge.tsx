/**
 * IconBadge — Colored rounded-square icon container
 *
 * Figma: Components / IconBadge
 *   Properties:
 *     color: teal | orange | crimson | navy | green | purple | gray
 *     size: sm | md | lg
 *
 * Usage:
 *   <IconBadge color="teal" iconName="calendar" />
 *   <IconBadge color="orange" iconName="map-pin" size="lg" />
 */
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { DS, DSIconBadgeColor } from "@/constants/design-system";

type Size = "sm" | "md" | "lg";

interface IconBadgeProps {
  color?: DSIconBadgeColor;
  iconName: React.ComponentProps<typeof Feather>["name"];
  size?: Size;
  style?: ViewStyle;
}

const sizeMap: Record<Size, { container: number; icon: number; radius: number }> = {
  sm: { container: 28, icon: 14, radius: 6 },
  md: { container: 36, icon: 18, radius: 8 },
  lg: { container: 44, icon: 22, radius: 10 },
};

export function IconBadge({ color = "teal", iconName, size = "md", style }: IconBadgeProps) {
  const { bg, icon: iconColor } = DS.iconBadge[color];
  const { container, icon: iconSize, radius } = sizeMap[size];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: bg,
          width: container,
          height: container,
          borderRadius: radius,
        },
        style,
      ]}
    >
      <Feather name={iconName} size={iconSize} color={iconColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
});
