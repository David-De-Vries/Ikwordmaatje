/**
 * Chip — Small tag/badge element
 *
 * Figma: Components / Chip
 *   Properties:
 *     variant: filled | outlined
 *     color: primary | secondary | default
 *
 * Usage:
 *   <Chip label="Interactieve activiteiten" color="primary" />
 *   <Chip label="Wandelen" onPress={toggle} selected />
 */
import React from "react";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";

import { DS } from "@/constants/design-system";
import { useColors } from "@/hooks/useColors";

import { Typography } from "./Typography";

type Variant = "filled" | "outlined";
type Color = "primary" | "secondary" | "default";

interface ChipProps {
  label: string;
  variant?: Variant;
  color?: Color;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export function Chip({
  label,
  variant = "outlined",
  color = "primary",
  selected = false,
  onPress,
  style,
}: ChipProps) {
  const colors = useColors();

  const colorMap = {
    primary: { main: colors.primary, light: colors.accent },
    secondary: { main: colors.secondary, light: colors.accent },
    default: { main: DS.palette.text.secondary, light: DS.palette.background.input },
  };

  const { main, light } = colorMap[color];

  const containerStyle: ViewStyle = {
    backgroundColor: selected ? light : "transparent",
    borderColor: selected ? main : DS.palette.border,
  };

  const content = (
    <View style={[styles.chip, containerStyle, style]}>
      <Typography
        variant="caption"
        style={{
          color: selected ? main : DS.palette.text.secondary,
          fontFamily: DS.typography.fontFamily.medium,
        }}
      >
        {label}
      </Typography>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    borderRadius: DS.shape.radius.full,
    paddingHorizontal: DS.spacing.md,
    paddingVertical: DS.spacing.xs + 1,
    alignSelf: "flex-start",
  },
});
