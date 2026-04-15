import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ProgressHeader } from "@/components/ProgressHeader";
import { Button, Card, TextField, Typography } from "@/components/ui";
import { DS } from "@/constants/design-system";
import type { LanguageEntry } from "@/context/OnboardingContext";
import { useOnboarding } from "@/context/OnboardingContext";
import { useColors } from "@/hooks/useColors";

const COMMON_LANGUAGES = ["Nederlands", "Engels", "Arabisch", "Turks", "Frans"];
const PRONOUNS = ["Hij/hem", "Zij/haar", "Die/diens", "Geen voorkeur"];
const EDUCATION_LEVELS = ["MBO", "HBO", "WO", "Geen"];

const LEVELS: Array<{ key: LanguageEntry["level"]; label: string }> = [
  { key: "native", label: "Moedertaal" },
  { key: "fluent", label: "Vloeiend" },
  { key: "basic", label: "Beetje" },
];

export default function Step1Screen() {
  const router = useRouter();
  const colors = useColors();
  const { data, update } = useOnboarding();

  const [addingCustom, setAddingCustom] = useState(false);
  const [customText, setCustomText] = useState("");

  const addLanguage = (name: string) => {
    const current = data.languages ?? [];
    if (current.find((e) => e.name === name)) return;
    update({ languages: [...current, { name, level: "fluent" }] });
  };

  const removeLanguage = (name: string) => {
    update({ languages: (data.languages ?? []).filter((e) => e.name !== name) });
  };

  const setLevel = (name: string, level: LanguageEntry["level"]) => {
    update({
      languages: (data.languages ?? []).map((e) =>
        e.name === name ? { ...e, level } : e
      ),
    });
  };

  const confirmCustomLanguage = () => {
    const trimmed = customText.trim();
    if (trimmed) addLanguage(trimmed);
    setCustomText("");
    setAddingCustom(false);
  };

  const availableCommon = COMMON_LANGUAGES.filter(
    (l) => !(data.languages ?? []).find((e) => e.name === l)
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ProgressHeader step={1} totalSteps={10} sectionName="Account" />

      <KeyboardAwareScrollViewCompat
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
      >
        <Card elevation={2} padding="md" style={styles.card}>
          <View style={styles.header}>
            <Typography variant="h3">Over jou</Typography>
            <Typography variant="body2" color="textSecondary">
              Vertel ons een beetje over jezelf. Je kunt dit later altijd aanpassen.
            </Typography>
          </View>

          <View style={styles.fields}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <TextField
                  label="Voornaam"
                  placeholder="Bijv. Anna"
                  value={data.firstName}
                  onChangeText={(v) => update({ firstName: v })}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </View>
              <View style={{ flex: 1 }}>
                <TextField
                  label="Achternaam"
                  placeholder="Bijv. Jansen"
                  value={data.lastName}
                  onChangeText={(v) => update({ lastName: v })}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </View>
            </View>

            <TextField
              label="Geboortedatum"
              placeholder="DD-MM-JJJJ"
              value={data.dateOfBirth}
              onChangeText={(v) => update({ dateOfBirth: v })}
              keyboardType="numbers-and-punctuation"
              returnKeyType="next"
            />

            <View>
              <Typography variant="caption" color="textSecondary" style={styles.selectorLabel}>
                Voornaamwoorden (optioneel)
              </Typography>
              <View style={styles.chipRow}>
                {PRONOUNS.map((p) => (
                  <SelectChip
                    key={p}
                    label={p}
                    selected={data.pronouns === p}
                    onPress={() => update({ pronouns: data.pronouns === p ? "" : p })}
                    activeColor={colors.secondary}
                    activeBg={colors.accent}
                  />
                ))}
              </View>
            </View>

            <TextField
              label="Telefoonnummer"
              placeholder="06 12 34 56 78"
              value={data.phoneNumber}
              onChangeText={(v) => update({ phoneNumber: v })}
              keyboardType="phone-pad"
              returnKeyType="next"
            />

            {/* ── Talenkennis ── */}
            <View style={styles.langSection}>
              <Typography variant="caption" color="textSecondary" style={styles.selectorLabel}>
                Talenkennis
              </Typography>

              {/* Added languages */}
              {(data.languages ?? []).length === 0 ? (
                <View style={styles.emptyHint}>
                  <Feather name="globe" size={16} color={DS.palette.text.secondary} />
                  <Typography variant="caption" color="textSecondary">
                    Voeg je eerste taal toe
                  </Typography>
                </View>
              ) : (
                <View style={styles.langList}>
                  {(data.languages ?? []).map((entry, idx) => (
                    <LanguageRow
                      key={entry.name}
                      entry={entry}
                      isLast={idx === (data.languages ?? []).length - 1}
                      onRemove={() => removeLanguage(entry.name)}
                      onSetLevel={(lvl) => setLevel(entry.name, lvl)}
                      activeColor={colors.secondary}
                    />
                  ))}
                </View>
              )}

              {/* Quick-add chips */}
              <View style={styles.addSection}>
                <Typography variant="caption" color="textSecondary">
                  Voeg een taal toe
                </Typography>
                <View style={styles.chipRow}>
                  {availableCommon.map((l) => (
                    <TouchableOpacity
                      key={l}
                      onPress={() => addLanguage(l)}
                      style={[styles.chip, { borderColor: colors.secondary }]}
                    >
                      <Typography
                        variant="caption"
                        style={{ color: colors.secondary, fontFamily: DS.typography.fontFamily.medium }}
                      >
                        + {l}
                      </Typography>
                    </TouchableOpacity>
                  ))}

                  {addingCustom ? (
                    <View style={styles.customInputRow}>
                      <TextInput
                        autoFocus
                        value={customText}
                        onChangeText={setCustomText}
                        onSubmitEditing={confirmCustomLanguage}
                        onBlur={() => { setCustomText(""); setAddingCustom(false); }}
                        placeholder="Taal..."
                        placeholderTextColor={DS.palette.text.secondary}
                        style={[
                          styles.customInput,
                          { borderColor: colors.secondary, color: DS.palette.text.primary },
                        ]}
                        returnKeyType="done"
                      />
                      <TouchableOpacity
                        onPressIn={confirmCustomLanguage}
                        style={[styles.confirmBtn, { backgroundColor: colors.secondary }]}
                      >
                        <Feather name="check" size={12} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => setAddingCustom(true)}
                      style={[styles.chip, styles.addIconChip, { borderColor: DS.palette.border }]}
                    >
                      <Feather name="plus" size={13} color={DS.palette.text.secondary} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>

            {/* ── Opleidingsniveau ── */}
            <View>
              <Typography variant="caption" color="textSecondary" style={styles.selectorLabel}>
                Opleidingsniveau
              </Typography>
              <View style={styles.educationRow}>
                {EDUCATION_LEVELS.map((level) => (
                  <TouchableOpacity
                    key={level}
                    onPress={() => {
                      update({
                        education: level,
                        wantsInternship: level === "Geen" ? false : data.wantsInternship,
                      });
                    }}
                    style={[
                      styles.educationBtn,
                      {
                        borderColor: data.education === level ? colors.secondary : DS.palette.border,
                        backgroundColor: data.education === level ? colors.accent : "transparent",
                      },
                    ]}
                  >
                    <Typography
                      variant="caption"
                      style={{
                        color: data.education === level ? colors.secondary : DS.palette.text.secondary,
                        fontFamily: DS.typography.fontFamily.medium,
                        textAlign: "center",
                      }}
                    >
                      {level}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </View>

              {data.education && data.education !== "Geen" && (
                <TouchableOpacity
                  onPress={() => update({ wantsInternship: !data.wantsInternship })}
                  style={styles.checkboxRow}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.checkbox,
                      {
                        borderColor: data.wantsInternship ? colors.secondary : DS.palette.border,
                        backgroundColor: data.wantsInternship ? colors.secondary : "transparent",
                      },
                    ]}
                  >
                    {data.wantsInternship && (
                      <Typography style={styles.checkmark}>✓</Typography>
                    )}
                  </View>
                  <Typography variant="caption" color="textSecondary" style={styles.checkboxLabel}>
                    Ik wil me aanmelden voor een stageplek.
                  </Typography>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.navRow}>
            <Button
              variant="outlined"
              color="default"
              size="md"
              onPress={() => router.back()}
              startIconName="arrow-left"
              style={styles.backBtn}
            >
              Terug
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="md"
              onPress={() => router.push(data.wantsInternship ? "/stageinfo" : "/step2")}
              style={styles.nextBtn}
            >
              Verder
            </Button>
          </View>
        </Card>

        <View style={{ height: DS.spacing.xl }} />
      </KeyboardAwareScrollViewCompat>
    </View>
  );
}

function LanguageRow({
  entry,
  isLast,
  onRemove,
  onSetLevel,
  activeColor,
}: {
  entry: LanguageEntry;
  isLast: boolean;
  onRemove: () => void;
  onSetLevel: (level: LanguageEntry["level"]) => void;
  activeColor: string;
}) {
  return (
    <View
      style={[
        styles.langRow,
        !isLast && { borderBottomWidth: 1, borderBottomColor: DS.palette.border },
      ]}
    >
      <Typography
        variant="body2"
        style={{ flex: 1, color: DS.palette.text.primary, fontFamily: DS.typography.fontFamily.medium }}
      >
        {entry.name}
      </Typography>

      <View style={styles.levelPills}>
        {LEVELS.map((l) => {
          const isSelected = entry.level === l.key;
          return (
            <TouchableOpacity
              key={l.key}
              onPress={() => onSetLevel(l.key)}
              style={[
                styles.levelPill,
                {
                  borderColor: isSelected ? activeColor : DS.palette.border,
                  backgroundColor: isSelected ? activeColor : "transparent",
                },
              ]}
            >
              <Typography
                variant="caption"
                style={{
                  color: isSelected ? "#FFFFFF" : DS.palette.text.secondary,
                  fontFamily: DS.typography.fontFamily.medium,
                  fontSize: 10,
                }}
              >
                {l.label}
              </Typography>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity onPress={onRemove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Feather name="x" size={14} color={DS.palette.text.secondary} />
      </TouchableOpacity>
    </View>
  );
}

function SelectChip({
  label,
  selected,
  onPress,
  activeColor,
  activeBg,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  activeColor: string;
  activeBg: string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        {
          borderColor: selected ? activeColor : DS.palette.border,
          backgroundColor: selected ? activeBg : "transparent",
        },
      ]}
    >
      <Typography
        variant="caption"
        style={{
          color: selected ? activeColor : DS.palette.text.secondary,
          fontFamily: DS.typography.fontFamily.medium,
        }}
      >
        {label}
      </Typography>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: DS.spacing.lg,
    gap: DS.spacing.lg,
  },
  card: {
    gap: DS.spacing.xl,
  },
  header: {
    gap: DS.spacing.sm,
  },
  fields: {
    gap: DS.spacing.lg,
  },
  row: {
    flexDirection: "row",
    gap: DS.spacing.md,
  },
  selectorLabel: {
    marginBottom: DS.spacing.sm,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: DS.spacing.sm,
    alignItems: "center",
  },
  chip: {
    borderWidth: 1,
    borderRadius: DS.shape.radius.full,
    paddingHorizontal: DS.spacing.md,
    paddingVertical: DS.spacing.xs + 1,
  },
  addIconChip: {
    paddingHorizontal: DS.spacing.sm + 2,
    alignItems: "center",
    justifyContent: "center",
  },
  customInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.xs,
  },
  customInput: {
    borderWidth: 1,
    borderRadius: DS.shape.radius.full,
    paddingHorizontal: DS.spacing.md,
    paddingVertical: DS.spacing.xs + 1,
    fontSize: 12,
    minWidth: 90,
    maxWidth: 140,
  },
  confirmBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  langSection: {
    gap: DS.spacing.md,
  },
  emptyHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.sm,
    borderWidth: 1,
    borderColor: DS.palette.border,
    borderRadius: DS.shape.radius.sm,
    padding: DS.spacing.md,
    backgroundColor: DS.palette.background.input,
  },
  langList: {
    borderWidth: 1,
    borderColor: DS.palette.border,
    borderRadius: DS.shape.radius.sm,
    overflow: "hidden",
  },
  langRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.sm,
    paddingHorizontal: DS.spacing.md,
    paddingVertical: DS.spacing.sm + 2,
  },
  levelPills: {
    flexDirection: "row",
    gap: DS.spacing.xs,
  },
  levelPill: {
    borderWidth: 1,
    borderRadius: DS.shape.radius.full,
    paddingHorizontal: DS.spacing.sm,
    paddingVertical: 3,
  },
  addSection: {
    gap: DS.spacing.sm,
  },
  educationRow: {
    flexDirection: "row",
    gap: DS.spacing.sm,
  },
  educationBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: DS.shape.radius.md,
    paddingVertical: DS.spacing.sm + 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.sm,
    marginTop: DS.spacing.md,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  checkmark: {
    fontSize: 11,
    color: "#FFFFFF",
    lineHeight: 14,
  },
  checkboxLabel: {
    flex: 1,
  },
  navRow: {
    flexDirection: "row",
    gap: DS.spacing.md,
    marginTop: DS.spacing.xs,
  },
  backBtn: {
    flex: 1,
  },
  nextBtn: {
    flex: 2,
  },
});
