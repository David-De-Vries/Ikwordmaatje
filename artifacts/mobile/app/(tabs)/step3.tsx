import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { ProgressHeader } from "@/components/ProgressHeader";
import { Button, Card, IconBadge, Typography } from "@/components/ui";
import { DS, DSIconBadgeColor } from "@/constants/design-system";
import { useColors } from "@/hooks/useColors";

const CONTEXT_ITEMS: Array<{
  iconName: "calendar" | "users" | "heart" | "shield";
  color: DSIconBadgeColor;
  title: string;
  description: string;
}> = [
  {
    iconName: "calendar",
    color: "teal",
    title: "Flexibele tijden",
    description:
      "Je bepaalt zelf wanneer je beschikbaar bent. We proberen matches te vinden die bij jouw schema passen.",
  },
  {
    iconName: "users",
    color: "navy",
    title: "Persoonlijke koppeling",
    description:
      "We kijken naar jouw interesses en die van de senior om tot een goede match te komen.",
  },
  {
    iconName: "heart",
    color: "crimson",
    title: "Op je eigen tempo",
    description:
      "Een eerste bezoek duurt gemiddeld een tot twee uur. Jij en de senior bepalen samen hoe het verdergaat.",
  },
  {
    iconName: "shield",
    color: "green",
    title: "Altijd ondersteuning",
    description:
      "Onze begeleiders zijn er als je vragen hebt of ondersteuning nodig hebt tijdens je vrijwilligerswerk.",
  },
];

export default function Step3Screen() {
  const router = useRouter();
  const colors = useColors();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ProgressHeader step={3} totalSteps={10} sectionName="Context" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
      >
        <Card elevation={2} padding="md" style={styles.card}>
          <View style={styles.header}>
            <Typography variant="h3">Wat kun je verwachten?</Typography>
            <Typography variant="body2" color="textSecondary">
              Lees even door hoe het vrijwilligerswerk bij Careibu eruitziet.
            </Typography>
          </View>

          <View style={styles.items}>
            {CONTEXT_ITEMS.map((item, i) => (
              <View key={i} style={styles.contextItem}>
                <IconBadge iconName={item.iconName} color={item.color} size="lg" />
                <View style={styles.contextText}>
                  <Typography variant="h6">{item.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {item.description}
                  </Typography>
                </View>
              </View>
            ))}
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
              onPress={() => router.push("/step4")}
              style={styles.nextBtn}
            >
              Aan de slag!
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
  header: {
    gap: DS.spacing.sm,
  },
  items: {
    gap: DS.spacing.xl,
  },
  contextItem: {
    flexDirection: "row",
    gap: DS.spacing.lg,
    alignItems: "flex-start",
  },
  contextText: {
    flex: 1,
    gap: DS.spacing.xs,
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
