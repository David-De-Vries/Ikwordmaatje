/**
 * SelectCard — Selectable card for lists and grids
 *
 * Figma: Components / SelectCard
 *   Properties:
 *     mode: single | multi
 *     selected: boolean
 *     size: sm | md
 *
 * Usage (activity grid):
 *   <SelectCard
 *     iconName="wind"
 *     title="Wandelen en buiten"
 *     description="Samen wandelen"
 *     selected={selected}
 *     onPress={toggle}
 *     mode="multi"
 *   />
 *
 * Usage (project grid):
 *   <SelectCard
 *     title="Maatje"
 *     accentColor="#7BB5AD"
 *     selected={selected}
 *     onPress={select}
 *     mode="single"
 *   />
 */
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";

import { DS } from "@/constants/design-system";
import { useColors } from "@/hooks/useColors";

import { Typography } from "./ui/Typography";

type Mode = "single" | "multi";

interface SelectCardProps {
  title: string;
  description?: string;
  iconName?: React.ComponentProps<typeof Feather>["name"];
  accentColor?: string;
  selected?: boolean;
  onPress?: () => void;
  mode?: Mode;
  style?: ViewStyle;
  testID?: string;
}

export function SelectCard({
  title,
  description,
  iconName,
  accentColor,
  selected = false,
  onPress,
  mode = "multi",
  style,
  testID,
}: SelectCardProps) {
  const colors = useColors();

  const borderColor = selected ? colors.secondary : DS.palette.border;
  const bgColor = selected ? colors.accent : "#FFFFFF";

  return (
    <TouchableOpacity
      testID={testID}
      activeOpacity={0.75}
      onPress={onPress}
      style={[
        styles.card,
        {
          borderColor,
          backgroundColor: bgColor,
        },
        style,
      ]}
    >
      <View style={styles.top}>
        {iconName ? (
          <View
            style={[
              styles.iconWrap,
              {
                backgroundColor: selected
                  ? colors.secondary + "22"
                  : DS.palette.background.input,
              },
            ]}
          >
            <Feather
              name={iconName}
              size={18}
              color={selected ? colors.secondary : DS.palette.text.secondary}
            />
          </View>
        ) : accentColor ? (
          <View style={[styles.colorBlock, { backgroundColor: accentColor }]} />
        ) : null}

        {mode === "multi" ? (
          <View
            style={[
              styles.checkbox,
              {
                borderColor: selected ? colors.secondary : DS.palette.border,
                backgroundColor: selected ? colors.secondary : "transparent",
              },
            ]}
          >
            {selected ? (
              <Feather name="check" size={10} color="#FFFFFF" />
            ) : null}
          </View>
        ) : (
          selected && (
            <View
              style={[
                styles.checkCircle,
                { backgroundColor: colors.secondary },
              ]}
            >
              <Feather name="check" size={10} color="#FFFFFF" />
            </View>
          )
        )}
      </View>

      <View style={styles.textBlock}>
        <Typography variant="h6" style={{ color: DS.palette.text.primary }}>
          {title}
        </Typography>
        {description ? (
          <Typography variant="caption" color="textSecondary">
            {description}
          </Typography>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderWidth: 1,
    borderRadius: DS.shape.radius.sm,
    padding: DS.spacing.md,
    gap: DS.spacing.sm,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: DS.shape.radius.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  colorBlock: {
    flex: 1,
    height: 80,
    borderRadius: DS.shape.radius.xs,
    marginBottom: DS.spacing.xs,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 3,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  checkCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  textBlock: {
    gap: 2,
  },
});
