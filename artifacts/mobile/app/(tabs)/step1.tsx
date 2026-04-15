import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ProgressHeader } from "@/components/ProgressHeader";
import { Button, Card, TextField, Typography } from "@/components/ui";
import { DS } from "@/constants/design-system";
import { useOnboarding } from "@/context/OnboardingContext";
import { useColors } from "@/hooks/useColors";

const PRESET_LANGUAGES = ["Nederlands", "Engels", "Arabisch", "Turks", "Duits", "Frans"];
const PRONOUNS = ["Hij/hem", "Zij/haar", "Die/diens", "Geen voorkeur"];
const EDUCATION_LEVELS = ["MBO", "HBO", "WO", "Geen"];

export default function Step1Screen() {
  const router = useRouter();
  const colors = useColors();
  const { data, update } = useOnboarding();

  const [addingCustom, setAddingCustom] = useState(false);
  const [customText, setCustomText] = useState("");

  const toggleLanguage = (lang: string) => {
    const current = data.languages ?? [];
    const isSelected = current.includes(lang);
    update({
      languages: isSelected
        ? current.filter((x) => x !== lang)
        : [...current, lang],
    });
  };

  const confirmCustomLanguage = () => {
    const trimmed = customText.trim();
    if (trimmed) {
      const current = data.languages ?? [];
      if (!current.includes(trimmed)) {
        update({ languages: [...current, trimmed] });
      }
    }
    setCustomText("");
    setAddingCustom(false);
  };

  const allLanguages = [
    ...PRESET_LANGUAGES,
    ...(data.languages ?? []).filter((l) => !PRESET_LANGUAGES.includes(l)),
  ];

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
                  <PronounChip
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

            <View>
              <Typography variant="caption" color="textSecondary" style={styles.selectorLabel}>
                Voorkeurstaal
              </Typography>
              <View style={styles.chipRow}>
                {allLanguages.map((l) => (
                  <PronounChip
                    key={l}
                    label={l}
                    selected={(data.languages ?? []).includes(l)}
                    onPress={() => toggleLanguage(l)}
                    activeColor={colors.secondary}
                    activeBg={colors.accent}
                  />
                ))}

                {addingCustom ? (
                  <View style={styles.customInputRow}>
                    <TextInput
                      autoFocus
                      value={customText}
                      onChangeText={setCustomText}
                      onSubmitEditing={confirmCustomLanguage}
                      onBlur={() => { setAddingCustom(false); setCustomText(""); }}
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
                    style={[
                      styles.chip,
                      styles.addChip,
                      { borderColor: colors.secondary },
                    ]}
                  >
                    <Feather name="plus" size={13} color={colors.secondary} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

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

function PronounChip({
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
  addChip: {
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
