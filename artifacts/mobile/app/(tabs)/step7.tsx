import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { ProgressHeader } from "@/components/ProgressHeader";
import { Button, Card, IconBadge, Typography } from "@/components/ui";
import { DS, DSIconBadgeColor } from "@/constants/design-system";
import { useOnboarding } from "@/context/OnboardingContext";
import { useColors } from "@/hooks/useColors";

import type { Feather } from "@expo/vector-icons";

const EXPECTATIONS: Array<{
  iconName: React.ComponentProps<typeof Feather>["name"];
  color: DSIconBadgeColor;
  title: string;
  description: string;
}> = [
  {
    iconName: "clock",
    color: "teal",
    title: "Regelmaat en betrouwbaarheid",
    description:
      "Probeer minimaal één keer per maand een bezoek te plannen. Consistentie is erg fijn voor de senior.",
  },
  {
    iconName: "message-circle",
    color: "navy",
    title: "Open communicatie",
    description:
      "Laat het ons weten als je een bezoek moet annuleren of als er iets verandert in jouw beschikbaarheid.",
  },
  {
    iconName: "alert-circle",
    color: "orange",
    title: "Grenzen respecteren",
    description:
      "Houd rekening met de grenzen en behoeften van de senior. Vraag altijd toestemming voordat je iets nieuws probeert.",
  },
  {
    iconName: "users",
    color: "crimson",
    title: "Samenwerking met familie",
    description:
      "In sommige gevallen heb je ook contact met de familie van de senior. Behandel alle informatie vertrouwelijk.",
  },
];

export default function Step7Screen() {
  const router = useRouter();
  const colors = useColors();
  const { update } = useOnboarding();

  const handleAccept = () => {
    update({ expectationsAccepted: true });
    router.push("/step8");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ProgressHeader step={6} totalSteps={10} sectionName="Verwachtingen" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
      >
        <Card elevation={2} padding="lg" style={styles.card}>
          <View style={styles.header}>
            <Typography variant="h3">Onze verwachtingen</Typography>
            <Typography variant="body2" color="textSecondary">
              Lees deze verwachtingen door zodat we samen een fijne samenwerking kunnen opbouwen.
            </Typography>
          </View>

          <View style={styles.items}>
            {EXPECTATIONS.map((item, i) => (
              <View key={i} style={styles.item}>
                <IconBadge iconName={item.iconName} color={item.color} size="lg" />
                <View style={styles.itemText}>
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
              onPress={handleAccept}
              style={styles.nextBtn}
            >
              Begrepen &amp; verder
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
  item: {
    flexDirection: "row",
    gap: DS.spacing.lg,
    alignItems: "flex-start",
  },
  itemText: {
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
