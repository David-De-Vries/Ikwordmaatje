import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Card, Typography } from "@/components/ui";
import { DS } from "@/constants/design-system";

// ─────────────────────────────────────────────────────────────────────────────
// Maria van den Berg — hardcoded profile data
// ─────────────────────────────────────────────────────────────────────────────

const MARIA = {
  initials: "MV",
  name: "Maria van den Berg",
  age: 78,
  address: "Keizersgracht 482",
  city: "Amsterdam",
  neighbourhood: "Grachtengordel, Amsterdam",
  distance: "1,4 km",
  gender: "Vrouw",
  languages: ["Nederlands"],
  days: ["Ma", "Wo", "Vr"],
  activities: [
    { icon: "coffee" as const, label: "Koffiedrinken" },
    { icon: "book" as const, label: "Lezen" },
    { icon: "music" as const, label: "Muziek" },
  ],
  bio:
    "Maria is een warme en sociale vrouw die houdt van gezellig samenzijn. Ze woont al meer dan veertig jaar in de Grachtengordel en kent de buurt door en door. Ze geniet van een goed gesprek bij een kop koffie, leest graag romans en luistert elke dag naar muziek. Ze zoekt iemand om mee op te trekken en kleine dingen samen te doen.",
  health: {
    mobility: 3,
    independence: 3,
    socialWellbeing: 5,
    mentalWellbeing: 4,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Health dots
// ─────────────────────────────────────────────────────────────────────────────

function HealthDots({ score, max = 5 }: { score: number; max?: number }) {
  return (
    <View style={styles.dotsRow}>
      {Array.from({ length: max }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            { backgroundColor: i < score ? "#3A9490" : "#E0E0E0" },
          ]}
        />
      ))}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen
// ─────────────────────────────────────────────────────────────────────────────

export default function MatchProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const detailRows: {
    icon: React.ComponentProps<typeof Feather>["name"];
    label: string;
    value: string;
  }[] = [
    { icon: "calendar",       label: "Leeftijd",  value: `${MARIA.age} jaar` },
    { icon: "map-pin",        label: "Adres",     value: `${MARIA.address}, ${MARIA.city}` },
    { icon: "navigation",     label: "Afstand",   value: `${MARIA.distance} van jou` },
    { icon: "map",            label: "Buurt",     value: MARIA.neighbourhood },
    { icon: "user",           label: "Geslacht",  value: MARIA.gender },
    { icon: "message-circle", label: "Talen",     value: MARIA.languages.join(", ") },
  ];

  const healthRows: { label: string; key: keyof typeof MARIA.health }[] = [
    { label: "Mobiliteit",      key: "mobility" },
    { label: "Zelfstandigheid", key: "independence" },
    { label: "Sociaal welzijn", key: "socialWellbeing" },
    { label: "Mentaal welzijn", key: "mentalWellbeing" },
  ];

  return (
    <View style={styles.root}>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: topPad }]}>
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.7}
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="arrow-left" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={styles.avatar}>
            <Typography style={styles.avatarInitials}>{MARIA.initials}</Typography>
          </View>
          <View style={styles.matchPill}>
            <View style={[styles.pillDot, { backgroundColor: DS.palette.success.main }]} />
            <Typography style={styles.matchPillLabel}>Actief gekoppeld</Typography>
          </View>
          <Typography variant="h4" style={{ color: "#FFFFFF", marginTop: DS.spacing.xs }}>
            {MARIA.name}
          </Typography>
          <Typography variant="caption" style={{ color: "rgba(255,255,255,0.75)", marginTop: 2 }}>
            {MARIA.age} jaar · {MARIA.neighbourhood}
          </Typography>
        </View>

        {/* Spacer to keep back btn visually balanced */}
        <View style={styles.backBtn} />
      </View>

      {/* ── Scrollable body ─────────────────────────────────────────────── */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.body,
          { paddingBottom: insets.bottom + 96 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Card 1 — Bio */}
        <Card elevation={2} padding="md" style={{ gap: DS.spacing.sm }}>
          <Typography variant="h5">Over Maria</Typography>
          <Typography variant="body2" color="textSecondary" style={{ lineHeight: 22 }}>
            {MARIA.bio}
          </Typography>
        </Card>

        {/* Card 2 — Persoonlijke gegevens */}
        <Card elevation={2} padding="md" style={{ gap: DS.spacing.sm }}>
          <Typography variant="h5">Persoonlijke gegevens</Typography>
          {detailRows.map((row) => (
            <View key={row.label} style={styles.detailRow}>
              <View style={styles.detailIconWrap}>
                <Feather name={row.icon} size={15} color="#3A9490" />
              </View>
              <Typography variant="caption" color="textSecondary" style={styles.detailLabel}>
                {row.label}
              </Typography>
              <Typography variant="body2" style={styles.detailValue}>
                {row.value}
              </Typography>
            </View>
          ))}
        </Card>

        {/* Card 3 — Beschikbaarheid */}
        <Card elevation={2} padding="md" style={{ gap: DS.spacing.sm }}>
          <Typography variant="h5">Beschikbaarheid</Typography>
          <View style={styles.availRow}>
            <Typography variant="caption" color="textSecondary" style={{ marginRight: DS.spacing.xxs }}>
              Beschikbaar:
            </Typography>
            {MARIA.days.map((day) => (
              <View key={day} style={styles.dayChip}>
                <Typography style={styles.dayLabel}>{day}</Typography>
              </View>
            ))}
          </View>
        </Card>

        {/* Card 4 — Interesses */}
        <Card elevation={2} padding="md" style={{ gap: DS.spacing.sm }}>
          <Typography variant="h5">Interesses</Typography>
          <View style={styles.chipsWrap}>
            {MARIA.activities.map((a) => (
              <View key={a.label} style={styles.activityChip}>
                <Feather name={a.icon} size={11} color="#3A9490" />
                <Typography style={styles.chipLabel}>{a.label}</Typography>
              </View>
            ))}
          </View>
        </Card>

        {/* Card 5 — Welzijnsindicatoren */}
        <Card elevation={2} padding="md" style={{ gap: DS.spacing.sm }}>
          <View>
            <Typography variant="h5">Welzijnsindicatoren</Typography>
            <Typography variant="caption" color="textSecondary">
              Gebaseerd op eigen opgave
            </Typography>
          </View>
          {healthRows.map((row) => (
            <View key={row.key} style={styles.healthRow}>
              <Typography variant="body2" style={styles.healthLabel}>
                {row.label}
              </Typography>
              <HealthDots score={MARIA.health[row.key]} />
            </View>
          ))}
        </Card>
      </ScrollView>

      {/* ── Sticky bottom bar ────────────────────────────────────────────── */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, DS.spacing.md) + DS.spacing.sm },
        ]}
      >
        <TouchableOpacity style={styles.planBtn} activeOpacity={0.85}>
          <Feather name="calendar" size={17} color="#FFFFFF" />
          <Typography style={styles.planBtnLabel}>Bezoek plannen</Typography>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const HEADER_COLOR = "#8CBFBB";

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F2F3F5",
  },
  header: {
    backgroundColor: HEADER_COLOR,
    paddingHorizontal: DS.spacing.lg,
    paddingBottom: DS.spacing.xl,
    alignItems: "center",
    flexDirection: "row",
  },
  backBtn: {
    width: 36,
    alignItems: "flex-start",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: DS.palette.primary.main,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: DS.spacing.xs,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.35)",
  },
  avatarInitials: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  matchPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    paddingHorizontal: DS.spacing.sm,
    paddingVertical: 3,
    gap: 5,
    marginBottom: DS.spacing.xxs,
  },
  pillDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  matchPillLabel: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
  body: {
    padding: DS.spacing.lg,
    gap: DS.spacing.md,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.sm,
  },
  detailIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#EEF7F6",
    alignItems: "center",
    justifyContent: "center",
  },
  detailLabel: {
    width: 90,
  },
  detailValue: {
    flex: 1,
    fontWeight: "500",
  },
  availRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: DS.spacing.xs,
  },
  dayChip: {
    paddingHorizontal: DS.spacing.sm,
    paddingVertical: DS.spacing.xxs,
    borderRadius: 20,
    backgroundColor: "#EEF7F6",
    borderWidth: 1,
    borderColor: "#C5E0DE",
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3A9490",
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: DS.spacing.xs,
  },
  activityChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#EEF7F6",
    borderRadius: 20,
    paddingHorizontal: DS.spacing.sm,
    paddingVertical: DS.spacing.xxs,
  },
  chipLabel: {
    fontSize: 12,
    color: "#3A9490",
  },
  healthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: DS.spacing.xxs,
  },
  healthLabel: {
    flex: 1,
    fontSize: 13,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 5,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  bottomBar: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: DS.spacing.lg,
    paddingTop: DS.spacing.md,
    borderTopWidth: 1,
    borderTopColor: DS.palette.border,
  },
  planBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: DS.spacing.xs,
    backgroundColor: "#3A9490",
    borderRadius: DS.shape.radius.md,
    paddingVertical: DS.spacing.md,
  },
  planBtnLabel: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
});
