/**
 * Banner — Inline contextual feedback message
 *
 * Figma: Components / Banner
 *   Properties:
 *     variant: success | info | warning | error
 *
 * Usage:
 *   <Banner variant="success" title="Gelukt!" message="Je profiel is opgeslagen." />
 *   <Banner variant="info" title="Helemaal oké" message="We plannen samen momenten." />
 */
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { DS } from "@/constants/design-system";

import { Typography } from "./Typography";

type Variant = "success" | "info" | "warning" | "error";

interface BannerProps {
  variant?: Variant;
  title?: string;
  message?: string;
  style?: ViewStyle;
}

const variantMap: Record<
  Variant,
  { bg: string; border: string; icon: string; iconName: React.ComponentProps<typeof Feather>["name"] }
> = {
  success: {
    bg: DS.palette.success.bg,
    border: DS.palette.success.light,
    icon: DS.palette.success.main,
    iconName: "check-circle",
  },
  info: {
    bg: DS.palette.info.bg,
    border: DS.palette.info.light,
    icon: DS.palette.info.main,
    iconName: "info",
  },
  warning: {
    bg: "#FFF8E1",
    border: DS.palette.warning.light,
    icon: DS.palette.warning.main,
    iconName: "alert-circle",
  },
  error: {
    bg: "#FDECEA",
    border: DS.palette.error.light,
    icon: DS.palette.error.main,
    iconName: "alert-circle",
  },
};

export function Banner({ variant = "info", title, message, style }: BannerProps) {
  const { bg, border, icon, iconName } = variantMap[variant];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: bg, borderColor: border },
        style,
      ]}
    >
      <View style={styles.iconWrap}>
        <Feather name={iconName} size={16} color={icon} />
      </View>
      <View style={styles.content}>
        {title ? (
          <Typography variant="h6" style={{ color: icon }}>
            {title}
          </Typography>
        ) : null}
        {message ? (
          <Typography variant="body2" style={{ color: icon }}>
            {message}
          </Typography>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: DS.spacing.sm,
    padding: DS.spacing.md,
    borderRadius: DS.shape.radius.sm,
    borderWidth: 1,
  },
  iconWrap: {
    paddingTop: 1,
  },
  content: {
    flex: 1,
    gap: DS.spacing.xxs,
  },
});
