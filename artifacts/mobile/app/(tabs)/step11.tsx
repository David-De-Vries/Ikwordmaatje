import { useRouter } from "expo-router";
import React from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Banner, Button, Card, Chip, Typography } from "@/components/ui";
import { DS } from "@/constants/design-system";
import { useOnboarding } from "@/context/OnboardingContext";
import { useColors } from "@/hooks/useColors";

const PROJECT_NAMES: Record<string, string> = {
  maatje: "Maatje",
  huisvriend: "Huisvriend",
  taalmaatje: "Taalmaatje",
  studie: "Studie",
  computer: "Digitaal",
  tuinieren: "Tuinieren",
  sport: "Sport",
  vrij: "Vrij project",
};

const ACTIVITY_NAMES: Record<string, string> = {
  buiten: "Wandelen & buiten",
  kletsen: "Gezellig kletsen",
  muziek: "Muziek & cultuur",
  lezen: "Lezen & verhalen",
  sport: "Sport & bewegen",
  eten: "Samen eten",
  digitaal: "Digitale hulp",
  creatief: "Creatief bezig",
};

export default function Step11Screen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { data, reset } = useOnboarding();

  const topPad = Platform.OS === "web"
    ? Math.max(insets.top, 67)
    : insets.top;

  const handleSave = () => {
    reset();
    router.replace("/signup");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ height: topPad + DS.spacing.xl }} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.heroArea}>
          <View
            style={[
              styles.checkCircle,
              { backgroundColor: DS.palette.success.main },
            ]}
          >
            <Typography variant="h2" style={{ color: "#FFFFFF" }}>
              ✓
            </Typography>
          </View>
          <Typography variant="h2" style={{ color: "#FFFFFF" }} align="center">
            Welkom bij Careibu!
          </Typography>
          <Typography
            variant="body1"
            style={{ color: "#FFFFFF", opacity: 0.9 }}
            align="center"
          >
            Je profiel is aangemaakt en je eerste match staat klaar.
          </Typography>
        </View>

        <Card elevation={4} padding="lg" style={styles.card}>
          <View style={styles.section}>
            <Typography variant="h4">Jouw profiel</Typography>
            <View style={styles.profileRow}>
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: colors.secondary },
                ]}
              >
                <Typography variant="h3" style={{ color: "#FFFFFF" }}>
                  {data.firstName ? data.firstName[0].toUpperCase() : "?"}
                </Typography>
              </View>
              <View style={{ flex: 1 }}>
                <Typography variant="h5">
                  {[data.firstName, data.lastName].filter(Boolean).join(" ") || "Jouw naam"}
                </Typography>
                {data.selectedProject ? (
                  <Typography variant="body2" color="textSecondary">
                    Project: {PROJECT_NAMES[data.selectedProject] ?? data.selectedProject}
                  </Typography>
                ) : null}
              </View>
            </View>
          </View>

          {data.selectedActivities.length > 0 && (
            <>
              <View style={styles.divider} />
              <View style={styles.section}>
                <Typography variant="h6">Activiteiten</Typography>
                <View style={styles.chipRow}>
                  {data.selectedActivities.map((id) => (
                    <Chip
                      key={id}
                      label={ACTIVITY_NAMES[id] ?? id}
                      color="secondary"
                      selected
                    />
                  ))}
                </View>
              </View>
            </>
          )}

          <View style={styles.divider} />

          <View style={styles.section}>
            <Typography variant="h6">Na je eerste bezoek</Typography>
            {[
              "Geef feedback over hoe het ging",
              "Plan je volgende bezoek in",
              "Pas je beschikbaarheid aan als nodig",
            ].map((item, i) => (
              <View key={i} style={styles.listItem}>
                <View
                  style={[
                    styles.bullet,
                    { backgroundColor: colors.secondary },
                  ]}
                />
                <Typography variant="body2" color="textSecondary">
                  {item}
                </Typography>
              </View>
            ))}
          </View>

          <Banner
            variant="info"
            title="Je staat er niet alleen voor"
            message="Onze begeleiders zijn altijd bereikbaar als je vragen hebt of ondersteuning nodig hebt."
          />

          <Button
            variant="contained"
            color="primary"
            size="lg"
            fullWidth
            onPress={handleSave}
          >
            Ga naar het dashboard
          </Button>
        </Card>

        <View style={{ height: insets.bottom + DS.spacing.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: DS.spacing.lg,
    gap: DS.spacing.xl,
  },
  heroArea: {
    alignItems: "center",
    gap: DS.spacing.lg,
    paddingVertical: DS.spacing.xl,
  },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    gap: DS.spacing.xl,
  },
  section: {
    gap: DS.spacing.md,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  divider: {
    height: 1,
    backgroundColor: DS.palette.border,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: DS.spacing.sm,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: DS.spacing.md,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
    flexShrink: 0,
  },
});
