/**
 * SliderInput — Touch-based range slider
 *
 * Figma: Components / SliderInput
 *
 * Usage:
 *   <SliderInput value={5} min={1} max={10} onChange={setComfort} />
 */
import React, { useCallback, useState } from "react";
import {
  GestureResponderEvent,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import { DS } from "@/constants/design-system";

import { Typography } from "./ui/Typography";

interface Label {
  value: number;
  label: string;
}

interface SliderInputProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  labels?: Label[];
  style?: ViewStyle;
}

const THUMB = 22;

export function SliderInput({
  value,
  min = 0,
  max = 10,
  onChange,
  labels,
  style,
}: SliderInputProps) {
  const [trackWidth, setTrackWidth] = useState(1);
  const percent = (value - min) / (max - min);
  const thumbLeft = Math.max(0, Math.min(1, percent)) * (trackWidth - THUMB);

  const handleTouch = useCallback(
    (e: GestureResponderEvent) => {
      const x = e.nativeEvent.locationX;
      const pct = Math.max(0, Math.min(1, x / trackWidth));
      onChange(Math.round(min + pct * (max - min)));
    },
    [trackWidth, min, max, onChange],
  );

  return (
    <View style={[styles.root, style]}>
      <View
        style={styles.trackContainer}
        onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={handleTouch}
        onResponderMove={handleTouch}
      >
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${percent * 100}%` }]} />
        </View>
        {trackWidth > 1 && (
          <View
            style={[
              styles.thumb,
              {
                left: thumbLeft,
                top: (40 - THUMB) / 2,
              },
            ]}
          />
        )}
      </View>

      {labels && labels.length > 0 ? (
        <View style={styles.labelsRow}>
          {labels.map((l, i) => (
            <Typography key={i} variant="caption" color="textDisabled" style={styles.labelText}>
              {l.label}
            </Typography>
          ))}
        </View>
      ) : null}

      <View style={styles.valueBox}>
        <Typography variant="h3">{value}</Typography>
        <Typography variant="body2" color="textSecondary">
          {" "}/ {max}
        </Typography>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: DS.spacing.sm,
  },
  trackContainer: {
    height: 40,
    justifyContent: "center",
    position: "relative",
  },
  track: {
    height: 4,
    backgroundColor: DS.palette.border,
    borderRadius: 2,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: DS.palette.text.primary,
    borderRadius: 2,
  },
  thumb: {
    position: "absolute",
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    backgroundColor: DS.palette.text.primary,
    ...DS.shadows.elevation2,
  },
  labelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  labelText: {
    flex: 1,
    textAlign: "center",
  },
  valueBox: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    backgroundColor: DS.palette.background.input,
    borderRadius: DS.shape.radius.sm,
    paddingHorizontal: DS.spacing.xl,
    paddingVertical: DS.spacing.sm,
    alignSelf: "center",
  },
});
