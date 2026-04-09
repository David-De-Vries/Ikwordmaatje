/**
 * Button — MUI-inspired TouchableOpacity button
 *
 * Figma: Components / Button
 *   Properties:
 *     variant: contained | outlined | text
 *     color: primary | secondary | default | error
 *     size: sm | md | lg
 *     fullWidth: boolean
 *     disabled: boolean
 *
 * Usage:
 *   <Button variant="contained" onPress={...}>Verder</Button>
 *   <Button variant="outlined" size="sm" onPress={...}>Terug</Button>
 */
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { DS } from "@/constants/design-system";
import { useColors } from "@/hooks/useColors";

import { Typography } from "./Typography";

type Variant = "contained" | "outlined" | "text";
type Color = "primary" | "secondary" | "default" | "error";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: Variant;
  color?: Color;
  size?: Size;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  children?: React.ReactNode;
  startIconName?: React.ComponentProps<typeof Feather>["name"];
  endIconName?: React.ComponentProps<typeof Feather>["name"];
  style?: ViewStyle;
  testID?: string;
}

export function Button({
  variant = "contained",
  color = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  onPress,
  children,
  startIconName,
  endIconName,
  style,
  testID,
}: ButtonProps) {
  const colors = useColors();

  const colorMap = {
    primary: { main: colors.primary, contrast: colors.primaryForeground, border: colors.primary },
    secondary: { main: colors.secondary, contrast: colors.secondaryForeground, border: colors.secondary },
    default: { main: DS.palette.background.input, contrast: DS.palette.text.primary, border: DS.palette.border },
    error: { main: DS.palette.error.main, contrast: DS.palette.error.contrast, border: DS.palette.error.main },
  };

  const sizeMap = {
    sm: { paddingVertical: DS.spacing.sm, paddingHorizontal: DS.spacing.lg, iconSize: 14 },
    md: { paddingVertical: DS.spacing.md, paddingHorizontal: DS.spacing.xxl, iconSize: 16 },
    lg: { paddingVertical: 14, paddingHorizontal: DS.spacing.xxl, iconSize: 18 },
  };

  const { main, contrast, border } = colorMap[color];
  const { paddingVertical, paddingHorizontal, iconSize } = sizeMap[size];

  const containerStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: DS.shape.radius.sm,
    paddingVertical,
    paddingHorizontal,
    gap: DS.spacing.sm,
    ...(fullWidth && { alignSelf: "stretch" }),
    ...(variant === "contained" && {
      backgroundColor: disabled ? DS.palette.text.disabled : main,
    }),
    ...(variant === "outlined" && {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: disabled ? DS.palette.text.disabled : border,
    }),
    ...(variant === "text" && {
      backgroundColor: "transparent",
      paddingHorizontal: DS.spacing.sm,
    }),
  };

  const textColor =
    variant === "contained"
      ? disabled
        ? "#fff"
        : contrast
      : disabled
      ? DS.palette.text.disabled
      : color === "default"
      ? contrast
      : main;

  return (
    <TouchableOpacity
      testID={testID}
      activeOpacity={0.75}
      disabled={disabled || loading}
      onPress={onPress}
      style={[styles.root, containerStyle, style]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <>
          {startIconName && (
            <Feather name={startIconName} size={iconSize} color={textColor} />
          )}
          <Typography
            variant="button"
            style={{ color: textColor, textTransform: undefined }}
          >
            {children}
          </Typography>
          {endIconName && (
            <Feather name={endIconName} size={iconSize} color={textColor} />
          )}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    minHeight: 44,
  },
});
