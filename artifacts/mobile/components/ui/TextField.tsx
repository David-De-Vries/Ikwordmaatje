/**
 * TextField — MUI-inspired text input with label and helper text
 *
 * Figma: Components / TextField
 *   Properties:
 *     state: default | focused | error | disabled
 *     size: sm | md
 *
 * Usage:
 *   <TextField label="First Name" value={name} onChangeText={setName} />
 *   <TextField label="Password" secureTextEntry error helperText="Required" />
 */
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardTypeOptions,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { DS } from "@/constants/design-system";
import { useColors } from "@/hooks/useColors";

import { Typography } from "./Typography";

interface TextFieldProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoComplete?: TextInput["props"]["autoComplete"];
  secureTextEntry?: boolean;
  rightIconName?: React.ComponentProps<typeof Feather>["name"];
  onRightIconPress?: () => void;
  style?: ViewStyle;
  inputStyle?: object;
  testID?: string;
  returnKeyType?: TextInput["props"]["returnKeyType"];
  onSubmitEditing?: () => void;
}

export function TextField({
  label,
  placeholder,
  value,
  onChangeText,
  error = false,
  helperText,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  keyboardType = "default",
  autoCapitalize = "sentences",
  autoComplete,
  secureTextEntry = false,
  rightIconName,
  onRightIconPress,
  style,
  inputStyle,
  testID,
  returnKeyType,
  onSubmitEditing,
}: TextFieldProps) {
  const colors = useColors();
  const [focused, setFocused] = useState(false);
  const [secure, setSecure] = useState(secureTextEntry);

  const borderColor = error
    ? DS.palette.error.main
    : focused
    ? colors.primary
    : colors.border;

  return (
    <View style={[styles.root, style]}>
      {label ? (
        <Typography variant="caption" style={styles.label} color="textSecondary">
          {label}
        </Typography>
      ) : null}
      <View
        style={[
          styles.inputContainer,
          {
            borderColor,
            backgroundColor: disabled
              ? DS.palette.background.input
              : DS.palette.background.paper,
            opacity: disabled ? 0.6 : 1,
          },
        ]}
      >
        <TextInput
          testID={testID}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={DS.palette.text.hint}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : undefined}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          secureTextEntry={secureTextEntry ? secure : false}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[
            styles.input,
            DS.typography.body2,
            { color: DS.palette.text.primary },
            multiline && styles.multilineInput,
            inputStyle,
          ]}
        />
        {secureTextEntry ? (
          <TouchableOpacity
            onPress={() => setSecure(!secure)}
            style={styles.iconButton}
          >
            <Feather
              name={secure ? "eye-off" : "eye"}
              size={18}
              color={DS.palette.text.secondary}
            />
          </TouchableOpacity>
        ) : rightIconName ? (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.iconButton}
          >
            <Feather
              name={rightIconName}
              size={18}
              color={DS.palette.text.secondary}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {helperText ? (
        <Typography
          variant="caption"
          style={styles.helperText}
          color={error ? "error" : "textDisabled"}
        >
          {helperText}
        </Typography>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "column",
    gap: DS.spacing.xs,
  },
  label: {
    marginBottom: 2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: DS.shape.radius.sm,
    paddingHorizontal: DS.spacing.md,
    minHeight: 44,
  },
  input: {
    flex: 1,
    paddingVertical: DS.spacing.sm + 2,
    minHeight: 44,
  },
  multilineInput: {
    height: "auto",
    textAlignVertical: "top",
    paddingTop: DS.spacing.sm + 2,
  },
  iconButton: {
    padding: DS.spacing.xs,
    marginLeft: DS.spacing.sm,
  },
  helperText: {
    marginTop: 2,
  },
});
