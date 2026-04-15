import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import { ProgressHeader } from "@/components/ProgressHeader";
import { SliderInput } from "@/components/SliderInput";
import { Button, Card, IconBadge, Typography } from "@/components/ui";
import { DS } from "@/constants/design-system";
import { useOnboarding } from "@/context/OnboardingContext";
import { useColors } from "@/hooks/useColors";

type FeatherIconName = React.ComponentProps<typeof Feather>["name"];

const ACTIVITIES: Array<{
  id: string;
  title: string;
  description: string;
  iconName: FeatherIconName;
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
  {
    id: "geen",
    label: "Geen ervaring",
    description: "Ik heb nog geen ervaring met dementie",
    feedback: {
      title: "Geen probleem, wij zijn er om te helpen!",
      body: "We verwachten niet dat je alles gelijk kan. Tijdens jouw traject bij Careibu zullen onze coördinatoren je coachen en begeleiden zodat je nuttige skills leert die je verder helpen met je ontwikkeling.",
    },
  },
  {
    id: "beetje",
    label: "Beetje ervaring",
    description: "Ik heb wel enige bekendheid met het onderwerp",
    feedback: {
      title: "Fijn dat je al wat ervaring hebt!",
      body: "Je ervaring is waardevol en zal helpen om een verbinding aan te gaan met een senior. We zullen je ondersteunen en kijken waar nog ruimte ligt om je verder op weg te helpen.",
    },
  },
  {
    id: "veel",
    label: "Veel ervaring",
    description: "Ik heb persoonlijk of professioneel ervaring",
    feedback: {
      title: "Je ervaring is enorm waardevol!",
      body: "Super dat je je ervaring meeneemt en inzet voor een senior. We helpen je met het toepassen van je ervaring, en wie weet leer je nog wat nieuws van je coördinator of senior.",
    },
  },
];

const SLIDER_LABELS = [
  { value: 1, label: "1–3\nMoeilijk" },
  { value: 5, label: "4–6\nGemiddeld" },
  { value: 8, label: "7–8\nGemakkelijk" },
  { value: 10, label: "9–10\nGeenprobleem" },
];

export default function Step4Screen() {
  const router = useRouter();
  const { edit } = useLocalSearchParams<{ edit?: string }>();
  const isEditMode = edit === "1";
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
              {ACTIVITIES.map((act) => {
                const selected = data.selectedActivities.includes(act.id);
                return (
                  <ActivityTile
                    key={act.id}
                    title={act.title}
                    description={act.description}
                    iconName={act.iconName}
                    selected={selected}
                    onPress={() => toggleActivity(act.id)}
                  />
                );
              })}
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Typography variant="h5">Ervaring met dementie</Typography>
            <Typography variant="body2" color="textSecondary">
              Heb je eerder met dementie te maken gehad?
            </Typography>
            {DEMENTIA_OPTIONS.map((opt) => {
              const isSelected = data.dementiaExperience === opt.id;
              return (
                <View key={opt.id} style={styles.dementiaGroup}>
                  <TouchableOpacity
                    onPress={() => update({ dementiaExperience: opt.id })}
                    style={[
                      styles.optionRow,
                      {
                        borderColor: isSelected ? colors.secondary : DS.palette.border,
                        backgroundColor: isSelected ? colors.accent : "#FFFFFF",
                      },
                    ]}
                  >
                    <IconBadge
                      iconName="heart"
                      color={isSelected ? "teal" : "gray"}
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
                        { borderColor: isSelected ? colors.secondary : DS.palette.border },
                      ]}
                    >
                      {isSelected && (
                        <View style={[styles.radioDot, { backgroundColor: colors.secondary }]} />
                      )}
                    </View>
                  </TouchableOpacity>

                  {isSelected && (
                    <FeedbackCard title={opt.feedback.title} body={opt.feedback.body} />
                  )}
                </View>
              );
            })}
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

          {isEditMode ? (
            <Button
              variant="contained"
              color="primary"
              size="lg"
              fullWidth
              onPress={() => router.replace("/step8")}
            >
              Wijzigingen opslaan
            </Button>
          ) : (
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
          )}
        </Card>

        <View style={{ height: DS.spacing.xl }} />
      </ScrollView>
    </View>
  );
}

function FeedbackCard({ title, body }: { title: string; body: string }) {
  return (
    <View style={styles.feedbackCard}>
      <Feather name="heart" size={18} color="#2D4499" style={{ marginTop: 2 }} />
      <View style={{ flex: 1, gap: 4 }}>
        <Typography variant="h6" style={{ color: "#2D4499" }}>
          {title}
        </Typography>
        <Typography variant="body2" style={{ color: "#2D4499", opacity: 0.85 }}>
          {body}
        </Typography>
      </View>
    </View>
  );
}

function ActivityTile({
  title,
  description,
  iconName,
  selected,
  onPress,
}: {
  title: string;
  description: string;
  iconName: FeatherIconName;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        styles.tile,
        selected && styles.tileSelected,
      ]}
    >
      {selected && (
        <View style={styles.tileCheck}>
          <Feather name="check" size={11} color="#FFFFFF" />
        </View>
      )}
      <View
        style={[
          styles.tileIconWrap,
          selected && styles.tileIconWrapSelected,
        ]}
      >
        <Feather
          name={iconName}
          size={22}
          color={selected ? "#FFFFFF" : DS.iconBadge.teal.icon}
        />
      </View>
      <Typography
        variant="body2"
        style={[
          styles.tileTitle,
          selected && { color: DS.palette.text.primary },
        ]}
        numberOfLines={2}
      >
        {title}
      </Typography>
      <Typography
        variant="caption"
        color="textSecondary"
        style={styles.tileDesc}
        numberOfLines={2}
      >
        {description}
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
  section: {
    gap: DS.spacing.lg,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: DS.spacing.md,
  },
  tile: {
    width: "47%",
    borderWidth: 1,
    borderColor: DS.palette.border,
    borderRadius: DS.shape.radius.md,
    padding: DS.spacing.md,
    gap: DS.spacing.sm,
    backgroundColor: "#FFFFFF",
    position: "relative",
  },
  tileSelected: {
    borderColor: DS.iconBadge.teal.icon,
    backgroundColor: DS.iconBadge.teal.bg,
  },
  tileCheck: {
    position: "absolute",
    top: DS.spacing.sm,
    right: DS.spacing.sm,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: DS.iconBadge.teal.icon,
    alignItems: "center",
    justifyContent: "center",
  },
  tileIconWrap: {
    width: 44,
    height: 44,
    borderRadius: DS.shape.radius.sm,
    backgroundColor: DS.iconBadge.teal.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  tileIconWrapSelected: {
    backgroundColor: DS.iconBadge.teal.icon,
  },
  tileTitle: {
    fontFamily: DS.typography.fontFamily.semiBold,
    fontSize: 13,
    color: DS.palette.text.primary,
    lineHeight: 18,
  },
  tileDesc: {
    fontSize: 11,
    lineHeight: 15,
  },
  divider: {
    height: 1,
    backgroundColor: DS.palette.border,
  },
  dementiaGroup: {
    gap: DS.spacing.sm,
  },
  feedbackCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: DS.spacing.md,
    backgroundColor: "#EEF2FB",
    borderWidth: 1,
    borderColor: "#C5D0EE",
    borderRadius: DS.shape.radius.md,
    padding: DS.spacing.md,
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
