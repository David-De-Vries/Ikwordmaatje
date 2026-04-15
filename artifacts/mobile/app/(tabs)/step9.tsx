import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { ProgressHeader } from "@/components/ProgressHeader";
import { Banner, Button, Card, Typography } from "@/components/ui";
import { DS } from "@/constants/design-system";
import { useColors } from "@/hooks/useColors";

const MATCHES = [
  {
    id: "1",
    name: "Mevrouw De Vries",
    age: 78,
    city: "Amsterdam",
    interests: ["Lezen", "Muziek"],
    avatar: "D",
    avatarColor: "#7BB5AD",
  },
  {
    id: "2",
    name: "Dhr. Bakker",
    age: 82,
    city: "Amsterdam",
    interests: ["Wandelen", "Tuinieren"],
    avatar: "B",
    avatarColor: "#E0A060",
  },
  {
    id: "3",
    name: "Mevrouw Smits",
    age: 75,
    city: "Amsterdam-Noord",
    interests: ["Koken", "Cultuur"],
    avatar: "S",
    avatarColor: "#5B8DC9",
  },
];

export default function Step9Screen() {
  const router = useRouter();
  const colors = useColors();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ProgressHeader step={8} totalSteps={10} sectionName="Matches" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
      >
        <Card elevation={2} padding="md" style={styles.card}>
          <Banner
            variant="info"
            title="Eerste blik op je mogelijke matches"
            message="Dit zijn senioren die goed bij jou lijken te passen. Je kiest nog niets — we bespreken dit samen tijdens een persoonlijk gesprek."
          />

          <View style={styles.header}>
            <Typography variant="h3">Mogelijke matches</Typography>
            <Typography variant="body2" color="textSecondary">
              Ter kennismaking alvast een voorproefje. De uiteindelijke koppeling wordt in overleg met jou bepaald.
            </Typography>
          </View>

          <View style={styles.matchList}>
            {MATCHES.map((match) => (
              <View key={match.id} style={styles.matchCard}>
                <View
                  style={[
                    styles.avatar,
                    { backgroundColor: match.avatarColor },
                  ]}
                >
                  <Typography
                    variant="h4"
                    style={{ color: "#FFFFFF" }}
                  >
                    {match.avatar}
                  </Typography>
                </View>
                <View style={styles.matchInfo}>
                  <Typography variant="h6">{match.name}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {match.age} jaar · {match.city}
                  </Typography>
                  <View style={styles.interestRow}>
                    {match.interests.map((interest) => (
                      <View
                        key={interest}
                        style={[
                          styles.tag,
                          { backgroundColor: colors.accent },
                        ]}
                      >
                        <Typography
                          variant="caption"
                          style={{ color: colors.secondary }}
                        >
                          {interest}
                        </Typography>
                      </View>
                    ))}
                  </View>
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
              onPress={() => router.push("/step10")}
              style={styles.nextBtn}
            >
              Volgende
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
  matchList: {
    gap: DS.spacing.md,
  },
  matchCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.md,
    borderWidth: 1,
    borderColor: DS.palette.border,
    borderRadius: DS.shape.radius.sm,
    padding: DS.spacing.md,
    backgroundColor: DS.palette.background.input,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  matchInfo: {
    flex: 1,
    gap: DS.spacing.xxs,
  },
  interestRow: {
    flexDirection: "row",
    gap: DS.spacing.xs,
    flexWrap: "wrap",
    marginTop: DS.spacing.xxs,
  },
  tag: {
    paddingHorizontal: DS.spacing.sm,
    paddingVertical: 2,
    borderRadius: DS.shape.radius.full,
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
