import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import { ProgressHeader } from "@/components/ProgressHeader";
import { SelectCard } from "@/components/SelectCard";
import { SliderInput } from "@/components/SliderInput";
import { Button, Card, IconBadge, Typography } from "@/components/ui";
import { DS } from "@/constants/design-system";
import { useOnboarding } from "@/context/OnboardingContext";
import { useColors } from "@/hooks/useColors";

import type { Feather } from "@expo/vector-icons";

const ACTIVITIES: Array<{
  id: string;
  title: string;
  description: string;
  iconName: React.ComponentProps<typeof Feather>["name"];
}> = [
  { id: "buiten", title: "Wandelen en buiten", description: "Samen wandelen of tuinieren", iconName: "wind" },
  { id: "kletsen", title: "Gezellig kletsen", description: "Conversatie en gezelschap", iconName: "message-circle" },
  { id: "muziek", title: "Muziek en cultuur", description: "Muziek, musea en kunst", iconName: "music" },
  { id: "lezen", title: "Lezen of verhalen", description: "Voorlezen en verhalen vertellen", iconName: "book-open" },
  { id: "sport", title: "Sport en bewegen", description: "Lichte sport en bewegen", iconName: "activity" },
  { id: "eten", title: "Samen eten", description: "Koken en samen eten", iconName: "coffee" },
  { id: "digitaal", title: "Digitale hulp", description: "Computer en smartphone hulp", iconName: "monitor" },
  { id: "creatief", title: "Creatief bezig", description: "Knutselen en handwerken", iconName: "scissors" },
];

const DEMENTIA_OPTIONS = [
  { id: "geen", label: "Geen ervaring", description: "Ik heb nog geen ervaring met dementie" },
  { id: "beetje", label: "Beetje ervaring", description: "Ik heb wel enige bekendheid met het onderwerp" },
  { id: "veel", label: "Veel ervaring", description: "Ik heb persoonlijk of professioneel ervaring" },
];

const SLIDER_LABELS = [
  { value: 1, label: "1–3\nMoeilijk" },
  { value: 5, label: "4–6\nGemiddeld" },
  { value: 8, label: "7–8\nGemakkelijk" },
  { value: 10, label: "9–10\nGeenprobleem" },
];

export default function Step4Screen() {
  const router = useRouter();
  const colors = useColors();
  const { data, update } = useOnboarding();

  const toggleActivity = (id: string) => {
    const curr = data.selectedActivities;
    if (curr.includes(id)) {
      update({ selectedActivities: curr.filter((a) => a !== id) });
    } else {
      update({ selectedActivities: [...curr, id] });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ProgressHeader step={4} totalSteps={10} sectionName="Voorkeuren" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
      >
        <Card elevation={2} padding="md" style={styles.card}>
          <View style={styles.section}>
            <Typography variant="h3">Jouw activiteiten</Typography>
            <Typography variant="body2" color="textSecondary">
              Kies de activiteiten die jij leuk vindt om te doen met een senior.
            </Typography>

            <View style={styles.grid}>
              {ACTIVITIES.map((act) => (
                <View key={act.id} style={styles.gridItem}>
                  <SelectCard
                    iconName={act.iconName}
                    title={act.title}
                    description={act.description}
                    selected={data.selectedActivities.includes(act.id)}
                    onPress={() => toggleActivity(act.id)}
                    mode="multi"
                  />
                </View>
              ))}
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Typography variant="h5">Ervaring met dementie</Typography>
            <Typography variant="body2" color="textSecondary">
              Heb je eerder met dementie te maken gehad?
            </Typography>
            {DEMENTIA_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                onPress={() => update({ dementiaExperience: opt.id })}
                style={[
                  styles.optionRow,
                  {
                    borderColor:
                      data.dementiaExperience === opt.id
                        ? colors.secondary
                        : DS.palette.border,
                    backgroundColor:
                      data.dementiaExperience === opt.id
                        ? colors.accent
                        : "#FFFFFF",
                  },
                ]}
              >
                <IconBadge
                  iconName="heart"
                  color={data.dementiaExperience === opt.id ? "teal" : "gray"}
                  size="sm"
                />
                <View style={{ flex: 1, gap: 2 }}>
                  <Typography variant="h6">{opt.label}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {opt.description}
                  </Typography>
                </View>
                <View
                  style={[
                    styles.radio,
                    {
                      borderColor:
                        data.dementiaExperience === opt.id
                          ? colors.secondary
                          : DS.palette.border,
                    },
                  ]}
                >
                  {data.dementiaExperience === opt.id && (
                    <View
                      style={[
                        styles.radioDot,
                        { backgroundColor: colors.secondary },
                      ]}
                    />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Typography variant="h5">Hoe gemakkelijk voel jij je?</Typography>
            <Typography variant="body2" color="textSecondary">
              Hoe op je gemak voel jij je in contact met ouderen?
            </Typography>
            <SliderInput
              value={data.comfortLevel}
              min={1}
              max={10}
              onChange={(v) => update({ comfortLevel: v })}
              labels={SLIDER_LABELS}
            />
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
              onPress={() => router.push("/step5")}
              style={styles.nextBtn}
            >
              Verder
            </Button>
          </View>
        </Card>

        <View style={{ height: DS.spacing.xl }} />
      </ScrollView>
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
  section: {
    gap: DS.spacing.lg,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: DS.spacing.md,
  },
  gridItem: {
    width: "47%",
  },
  divider: {
    height: 1,
    backgroundColor: DS.palette.border,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.md,
    borderWidth: 1,
    borderRadius: DS.shape.radius.sm,
    padding: DS.spacing.md,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  navRow: {
    flexDirection: "row",
    gap: DS.spacing.md,
  },
  backBtn: {
    flex: 1,
  },
  nextBtn: {
    flex: 2,
  },
});
