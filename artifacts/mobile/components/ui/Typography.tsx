/**
 * Typography — MUI-inspired Text component
 *
 * Figma: Text Styles (H1–H6, Subtitle, Body, Caption, Button, Overline)
 *
 * Usage:
 *   <Typography variant="h3">Title</Typography>
 *   <Typography variant="body2" color="secondary">Subtitle text</Typography>
 */
import React from "react";
import { Text, TextStyle } from "react-native";

import { DS } from "@/constants/design-system";
import { useColors } from "@/hooks/useColors";

type Variant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "subtitle1"
  | "subtitle2"
  | "body1"
  | "body2"
  | "caption"
  | "button"
  | "overline";

type ColorProp =
  | "primary"
  | "secondary"
  | "textPrimary"
  | "textSecondary"
  | "textDisabled"
  | "error"
  | "success"
  | "inherit";

interface TypographyProps {
  variant?: Variant;
  color?: ColorProp;
  align?: "left" | "center" | "right" | "justify";
  numberOfLines?: number;
  style?: TextStyle;
  children?: React.ReactNode;
  testID?: string;
}

export function Typography({
  variant = "body1",
  color = "textPrimary",
  align,
  numberOfLines,
  style,
  children,
  testID,
}: TypographyProps) {
  const colors = useColors();

  const colorMap: Record<ColorProp, string> = {
    primary: colors.primary,
    secondary: colors.secondary,
    textPrimary: DS.palette.text.primary,
    textSecondary: DS.palette.text.secondary,
    textDisabled: DS.palette.text.disabled,
    error: DS.palette.error.main,
    success: DS.palette.success.main,
    inherit: "inherit",
  };

  const variantStyle = DS.typography[variant] as TextStyle;

  return (
    <Text
      testID={testID}
      numberOfLines={numberOfLines}
      style={[
        variantStyle,
        { color: colorMap[color] },
        align ? { textAlign: align } : undefined,
        style,
      ]}
    >
      {children}
    </Text>
  );
}
