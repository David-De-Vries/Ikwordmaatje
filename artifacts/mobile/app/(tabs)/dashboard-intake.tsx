import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Banner, Button, Card, Chip, Typography } from "@/components/ui";
import { DS } from "@/constants/design-system";
import { useOnboarding } from "@/context/OnboardingContext";
import { useColors } from "@/hooks/useColors";

const DUTCH_MONTHS = [
  "januari", "februari", "maart", "april", "mei", "juni",
  "juli", "augustus", "september", "oktober", "november", "december",
];
const DUTCH_DAYS_LONG = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"];

function formatIntakeDate(isoDate: string, time: string): string {
  if (!isoDate) return "Woensdag 22 april om 10:30";
  const parts = isoDate.split("-");
  if (parts.length !== 3) return "Woensdag 22 april om 10:30";
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  const dow = d.getDay() === 0 ? 6 : d.getDay() - 1;
  const dayName = DUTCH_DAYS_LONG[dow];
  const dayNum = d.getDate();
  const monthName = DUTCH_MONTHS[d.getMonth()];
  const timeStr = time || "10:30";
  return `${dayName} ${dayNum} ${monthName} om ${timeStr}`;
}

const CHECKLIST_ITEMS = [
  "Lees het profiel van je senior nogmaals door",
  "Zorg voor vervoer naar het adres",
  "Bedenk 3 gespreksonderwerpen",
  "Neem contact op met je coördinator bij vragen",
];

export default function DashboardIntakeScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { data } = useOnboarding();

  const [checked, setChecked] = useState<boolean[]>(CHECKLIST_ITEMS.map(() => false));

  const toggleCheck = (i: number) => {
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  };

  const formattedDate = formatIntakeDate(data.intakeDate, data.intakeTime);

  return (
    <View
      style={[
        styles.root,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + DS.spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── A. Hero card ── */}
        <Card elevation={2} padding="md" style={styles.card}>
          <Typography variant="h4" style={{ color: DS.iconBadge.teal.icon }}>
            Je intake is ingepland!
          </Typography>
          <View style={styles.heroTop}>
            <View style={styles.heroIcon}>
              <Feather name="check-circle" size={28} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1, gap: DS.spacing.xs }}>
              <Typography variant="h4">Eerste ontmoeting ingepland</Typography>
              <View style={styles.metaRow}>
                <Feather name="calendar" size={14} color={DS.iconBadge.teal.icon} />
                <Typography variant="body2" style={{ color: DS.iconBadge.teal.icon }}>
                  {formattedDate}
                </Typography>
              </View>
              <View style={styles.metaRow}>
                <Feather name="map-pin" size={14} color={DS.palette.text.secondary} />
                <Typography variant="caption" color="textSecondary">
                  Thuisbezoek — adres ontvang je per e-mail
                </Typography>
              </View>
            </View>
          </View>

          <Button
            variant="outlined"
            color="primary"
            size="md"
            fullWidth
            onPress={() => {}}
            startIconName="calendar"
          >
            Toevoegen aan agenda
          </Button>
        </Card>

        {/* ── B. Senior card ── */}
        <Card elevation={2} padding="md" style={styles.card}>
          <Typography variant="h5">Je match</Typography>

          <View style={styles.seniorRow}>
            <View style={styles.avatar}>
              <Typography
                variant="h5"
                style={{ color: "#FFFFFF", fontFamily: DS.typography.fontFamily.semiBold }}
              >
                MV
              </Typography>
            </View>
            <View style={{ flex: 1, gap: DS.spacing.xs }}>
              <Typography variant="h5">Mevrouw van der Berg</Typography>
              <Typography variant="caption" color="textSecondary">
                82 jaar — Amsterdam
              </Typography>
              <View style={styles.chipRow}>
                <Chip label="Wandelen" color="secondary" selected />
                <Chip label="Muziek" color="secondary" selected />
              </View>
            </View>
          </View>

          <Typography variant="body2" color="textSecondary">
            Je coördinator neemt vóór de ontmoeting contact met je op om je voor te bereiden.
          </Typography>
        </Card>

        {/* ── C. Checklist card ── */}
        <Card elevation={2} padding="md" style={styles.card}>
          <Typography variant="h5">Ter voorbereiding</Typography>
          <View style={{ gap: DS.spacing.sm }}>
            {CHECKLIST_ITEMS.map((item, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => toggleCheck(i)}
                style={styles.checklistRow}
                activeOpacity={0.75}
              >
                <View
                  style={[
                    styles.checkbox,
                    checked[i] && styles.checkboxChecked,
                  ]}
                >
                  {checked[i] && (
                    <Feather name="check" size={13} color="#FFFFFF" />
                  )}
                </View>
                <Typography
                  variant="body2"
                  style={[
                    { flex: 1 },
                    checked[i] && {
                      color: DS.palette.text.secondary,
                      textDecorationLine: "line-through",
                    },
                  ]}
                >
                  {item}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* ── D. Info banner ── */}
        <Banner
          variant="info"
          title="Wat als ik niet kan?"
          message="Geen probleem! Annuleer via de app of bel je coördinator minimaal 24 uur van tevoren."
        />

        {/* ── E. Bottom navigation ── */}
        <Button
          variant="outlined"
          color="default"
          size="lg"
          fullWidth
          onPress={() => router.push("/dashboard")}
          startIconName="home"
        >
          Terug naar dashboard
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    padding: DS.spacing.lg,
    gap: DS.spacing.lg,
  },
  card: {
    gap: DS.spacing.lg,
  },
  heroTop: {
    flexDirection: "row",
    gap: DS.spacing.md,
    alignItems: "flex-start",
  },
  heroIcon: {
    width: 52,
    height: 52,
    borderRadius: DS.shape.radius.md,
    backgroundColor: DS.iconBadge.teal.icon,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.xs,
  },
  seniorRow: {
    flexDirection: "row",
    gap: DS.spacing.md,
    alignItems: "flex-start",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: DS.iconBadge.teal.icon,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: DS.spacing.xs,
    marginTop: DS.spacing.xs,
  },
  checklistRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.md,
    paddingVertical: DS.spacing.xs,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: DS.palette.border,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: "#3A9490",
    borderColor: "#3A9490",
  },
});
