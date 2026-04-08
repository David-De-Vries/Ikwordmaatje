import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ProgressHeader } from "@/components/ProgressHeader";
import { Button, Card, TextField, Typography } from "@/components/ui";
import { DS } from "@/constants/design-system";
import { useOnboarding } from "@/context/OnboardingContext";
import { useColors } from "@/hooks/useColors";

const LANGUAGES = ["Nederlands", "Engels", "Arabisch", "Turks", "Duits", "Frans"];
const PRONOUNS = ["Hij/hem", "Zij/haar", "Die/diens", "Geen voorkeur"];

export default function Step1Screen() {
  const router = useRouter();
  const colors = useColors();
  const { data, update } = useOnboarding();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ProgressHeader step={1} totalSteps={10} sectionName="Account" />

      <KeyboardAwareScrollViewCompat
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
      >
        <Card elevation={2} padding="lg" style={styles.card}>
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
                {LANGUAGES.map((l) => (
                  <PronounChip
                    key={l}
                    label={l}
                    selected={data.language === l}
                    onPress={() => update({ language: l })}
                    activeColor={colors.secondary}
                    activeBg={colors.accent}
                  />
                ))}
              </View>
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
              onPress={() => router.push("/step2")}
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
    <View
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
        onPress={onPress}
      >
        {label}
      </Typography>
    </View>
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
  },
  chip: {
    borderWidth: 1,
    borderRadius: DS.shape.radius.full,
    paddingHorizontal: DS.spacing.md,
    paddingVertical: DS.spacing.xs + 1,
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
