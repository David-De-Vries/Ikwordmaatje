import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

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

const LEVELS: Array<{ key: LanguageEntry["level"]; label: string; description: string }> = [
  { key: "native", label: "Moedertaal", description: "Ik ben hiermee opgegroeid" },
  { key: "fluent", label: "Vloeiend", description: "Ik spreek het goed" },
  { key: "basic", label: "Beetje", description: "Ik versta de basis" },
];

type Row = { id: string; name: string; level: LanguageEntry["level"] | "" };

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function initRows(entries: LanguageEntry[]): Row[] {
  if (entries.length === 0) return [{ id: uid(), name: "", level: "" }];
  return entries.map((e) => ({ id: uid(), name: e.name, level: e.level }));
}

export default function Step1Screen() {
  const router = useRouter();
  const colors = useColors();
  const { data, update } = useOnboarding();

  const [rows, setRows] = useState<Row[]>(() => initRows(data.languages ?? []));
  const [langPickerRow, setLangPickerRow] = useState<string | null>(null);
  const [levelPickerRow, setLevelPickerRow] = useState<string | null>(null);
  const [customLangText, setCustomLangText] = useState("");

  useEffect(() => {
    const committed = rows
      .filter((r) => r.name.trim() !== "")
      .map((r) => ({
        name: r.name.trim(),
        level: (r.level || "fluent") as LanguageEntry["level"],
      }));
    update({ languages: committed });
  }, [rows]);

  const addRow = () => {
    setRows((prev) => [...prev, { id: uid(), name: "", level: "" }]);
  };

  const removeRow = (id: string) => {
    setRows((prev) => {
      const next = prev.filter((r) => r.id !== id);
      return next.length === 0 ? [{ id: uid(), name: "", level: "" }] : next;
    });
  };

  const updateRowName = (id: string, name: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, name } : r)));
  };

  const updateRowLevel = (id: string, level: LanguageEntry["level"]) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, level } : r)));
  };

  const pickLanguage = (name: string) => {
    if (langPickerRow) updateRowName(langPickerRow, name);
    setLangPickerRow(null);
    setCustomLangText("");
  };

  const pickLevel = (level: LanguageEntry["level"]) => {
    if (levelPickerRow) updateRowLevel(levelPickerRow, level);
    setLevelPickerRow(null);
  };

  const confirmCustomLang = () => {
    const trimmed = customLangText.trim();
    if (trimmed) pickLanguage(trimmed);
    else { setCustomLangText(""); }
  };

  const currentLangPickerRow = rows.find((r) => r.id === langPickerRow);
  const currentLevelPickerRow = rows.find((r) => r.id === levelPickerRow);

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
            <View style={styles.nameRow}>
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
              <Typography variant="caption" color="textSecondary" style={styles.fieldLabel}>
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
              <View style={styles.langHeaderRow}>
                <Typography variant="caption" color="textSecondary" style={{ flex: 1 }}>
                  Taal
                </Typography>
                <Typography variant="caption" color="textSecondary" style={styles.niveauLabel}>
                  Niveau
                </Typography>
              </View>

              {rows.map((row) => (
                <View key={row.id} style={styles.langRow}>
                  {/* Language selector */}
                  <TouchableOpacity
                    style={[styles.selectorField, { flex: 11 }]}
                    onPress={() => setLangPickerRow(row.id)}
                    activeOpacity={0.7}
                  >
                    <Typography
                      variant="body2"
                      style={[
                        styles.selectorText,
                        !row.name && { color: DS.palette.text.secondary },
                      ]}
                      numberOfLines={1}
                    >
                      {row.name || "Selecteer taal"}
                    </Typography>
                    <Feather name="chevron-down" size={14} color={DS.palette.text.secondary} />
                  </TouchableOpacity>

                  {/* Level selector */}
                  <TouchableOpacity
                    style={[styles.selectorField, { flex: 8 }]}
                    onPress={() => setLevelPickerRow(row.id)}
                    activeOpacity={0.7}
                  >
                    <Typography
                      variant="body2"
                      style={[
                        styles.selectorText,
                        !row.level && { color: DS.palette.text.secondary },
                      ]}
                      numberOfLines={1}
                    >
                      {row.level
                        ? LEVELS.find((l) => l.key === row.level)?.label ?? "—"
                        : "Selecteer niveau"}
                    </Typography>
                    <Feather name="chevron-down" size={14} color={DS.palette.text.secondary} />
                  </TouchableOpacity>

                  {/* Remove */}
                  <TouchableOpacity
                    onPress={() => removeRow(row.id)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={styles.removeBtn}
                  >
                    <Feather name="x" size={15} color={DS.palette.text.secondary} />
                  </TouchableOpacity>
                </View>
              ))}

              {/* Add button */}
              <TouchableOpacity onPress={addRow} style={styles.addBtn} activeOpacity={0.7}>
                <Feather name="plus" size={14} color={DS.palette.text.secondary} />
                <Typography
                  variant="caption"
                  style={{ color: DS.palette.text.secondary }}
                >
                  Taal toevoegen
                </Typography>
              </TouchableOpacity>
            </View>

            {/* ── Opleidingsniveau ── */}
            <View>
              <Typography variant="caption" color="textSecondary" style={styles.fieldLabel}>
                Opleidingsniveau
              </Typography>
              <View style={styles.educationRow}>
                {EDUCATION_LEVELS.map((level) => (
                  <TouchableOpacity
                    key={level}
                    onPress={() =>
                      update({
                        education: level,
                        wantsInternship: level === "Geen" ? false : data.wantsInternship,
                      })
                    }
                    style={[
                      styles.educationBtn,
                      {
                        borderColor:
                          data.education === level ? colors.secondary : DS.palette.border,
                        backgroundColor:
                          data.education === level ? colors.accent : "transparent",
                      },
                    ]}
                  >
                    <Typography
                      variant="caption"
                      style={{
                        color:
                          data.education === level
                            ? colors.secondary
                            : DS.palette.text.secondary,
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
                        borderColor: data.wantsInternship
                          ? colors.secondary
                          : DS.palette.border,
                        backgroundColor: data.wantsInternship
                          ? colors.secondary
                          : "transparent",
                      },
                    ]}
                  >
                    {data.wantsInternship && (
                      <Typography style={styles.checkmark}>✓</Typography>
                    )}
                  </View>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    style={styles.checkboxLabel}
                  >
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
              onPress={() =>
                router.push(data.wantsInternship ? "/stageinfo" : "/step2")
              }
              style={styles.nextBtn}
            >
              Verder
            </Button>
          </View>
        </Card>

        <View style={{ height: DS.spacing.xl }} />
      </KeyboardAwareScrollViewCompat>

      {/* ── Language Picker Modal ── */}
      <Modal
        visible={langPickerRow !== null}
        transparent
        animationType="slide"
        onRequestClose={() => { setLangPickerRow(null); setCustomLangText(""); }}
      >
        <TouchableWithoutFeedback onPress={() => { setLangPickerRow(null); setCustomLangText(""); }}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <Typography variant="h4">Taal selecteren</Typography>
            <TouchableOpacity
              onPress={() => { setLangPickerRow(null); setCustomLangText(""); }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Feather name="x" size={18} color={DS.palette.text.secondary} />
            </TouchableOpacity>
          </View>

          <ScrollView keyboardShouldPersistTaps="handled">
            {COMMON_LANGUAGES.map((lang, idx) => {
              const isSelected = currentLangPickerRow?.name === lang;
              return (
                <TouchableOpacity
                  key={lang}
                  onPress={() => pickLanguage(lang)}
                  style={[
                    styles.sheetOption,
                    idx < COMMON_LANGUAGES.length - 1 && styles.sheetOptionBorder,
                  ]}
                >
                  <Typography
                    variant="body1"
                    style={{ color: isSelected ? colors.secondary : DS.palette.text.primary }}
                  >
                    {lang}
                  </Typography>
                  {isSelected && (
                    <Feather name="check" size={16} color={colors.secondary} />
                  )}
                </TouchableOpacity>
              );
            })}

            <View style={styles.sheetDivider} />

            <View style={styles.customLangRow}>
              <TextInput
                value={customLangText}
                onChangeText={setCustomLangText}
                placeholder="Andere taal..."
                placeholderTextColor={DS.palette.text.secondary}
                style={[styles.customLangInput, { color: DS.palette.text.primary }]}
                returnKeyType="done"
                onSubmitEditing={confirmCustomLang}
              />
              {customLangText.trim().length > 0 && (
                <TouchableOpacity
                  onPress={confirmCustomLang}
                  style={[styles.customConfirmBtn, { backgroundColor: colors.secondary }]}
                >
                  <Feather name="check" size={14} color="#FFFFFF" />
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* ── Level Picker Modal ── */}
      <Modal
        visible={levelPickerRow !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setLevelPickerRow(null)}
      >
        <TouchableWithoutFeedback onPress={() => setLevelPickerRow(null)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <Typography variant="h4">Niveau</Typography>
            <TouchableOpacity
              onPress={() => setLevelPickerRow(null)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Feather name="x" size={18} color={DS.palette.text.secondary} />
            </TouchableOpacity>
          </View>

          {LEVELS.map((lvl, idx) => {
            const isSelected = currentLevelPickerRow?.level === lvl.key;
            return (
              <TouchableOpacity
                key={lvl.key}
                onPress={() => pickLevel(lvl.key)}
                style={[
                  styles.sheetOption,
                  idx < LEVELS.length - 1 && styles.sheetOptionBorder,
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Typography
                    variant="body1"
                    style={{
                      color: isSelected ? colors.secondary : DS.palette.text.primary,
                      fontFamily: DS.typography.fontFamily.medium,
                    }}
                  >
                    {lvl.label}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {lvl.description}
                  </Typography>
                </View>
                {isSelected && (
                  <Feather name="check" size={16} color={colors.secondary} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </Modal>
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
  nameRow: {
    flexDirection: "row",
    gap: DS.spacing.md,
  },
  fieldLabel: {
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

  // ── Language section ──
  langSection: {
    gap: DS.spacing.sm,
  },
  langHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 28,
  },
  niveauLabel: {
    width: "42%",
  },
  langRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.sm,
  },
  selectorField: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: DS.palette.border,
    borderRadius: DS.shape.radius.sm,
    paddingHorizontal: DS.spacing.md,
    paddingVertical: DS.spacing.sm + 2,
    backgroundColor: DS.palette.background.input,
  },
  selectorText: {
    flex: 1,
    fontSize: 13,
    color: DS.palette.text.primary,
    marginRight: DS.spacing.xs,
  },
  removeBtn: {
    width: 20,
    alignItems: "center",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.xs,
    paddingVertical: DS.spacing.sm,
    alignSelf: "flex-start",
  },

  // ── Education ──
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
  backBtn: { flex: 1 },
  nextBtn: { flex: 2 },

  // ── Modals ──
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: DS.spacing.lg,
    paddingBottom: 40,
    paddingTop: DS.spacing.sm,
    maxHeight: "75%",
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: DS.palette.border,
    alignSelf: "center",
    marginBottom: DS.spacing.md,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: DS.spacing.md,
  },
  sheetOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: DS.spacing.md,
  },
  sheetOptionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: DS.palette.border,
  },
  sheetDivider: {
    height: 1,
    backgroundColor: DS.palette.border,
    marginVertical: DS.spacing.sm,
  },
  customLangRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.sm,
    paddingVertical: DS.spacing.sm,
  },
  customLangInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: DS.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: DS.palette.border,
  },
  customConfirmBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});
