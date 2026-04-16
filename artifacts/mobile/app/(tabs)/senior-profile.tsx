import { Feather, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
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
// Activity meta (mirrors seniors-list.tsx)
// ─────────────────────────────────────────────────────────────────────────────

type ActivityId =
  | "buiten"
  | "kletsen"
  | "muziek"
  | "lezen"
  | "sport"
  | "eten"
  | "digitaal"
  | "creatief";

const ACTIVITY_META: Record<
  ActivityId,
  { label: string; icon: React.ComponentProps<typeof Feather>["name"] }
> = {
  buiten:   { label: "Wandelen",  icon: "wind" },
  kletsen:  { label: "Kletsen",   icon: "message-circle" },
  muziek:   { label: "Muziek",    icon: "music" },
  lezen:    { label: "Lezen",     icon: "book-open" },
  sport:    { label: "Sport",     icon: "activity" },
  eten:     { label: "Eten",      icon: "coffee" },
  digitaal: { label: "Digitaal",  icon: "monitor" },
  creatief: { label: "Creatief",  icon: "scissors" },
};

// ─────────────────────────────────────────────────────────────────────────────
// Data model
// ─────────────────────────────────────────────────────────────────────────────

interface SeniorDetail {
  id: string;
  name: string;
  initials: string;
  age: number;
  distanceKm: number;
  activities: ActivityId[];
  availability: string[];
  location: string;
  gender: "man" | "vrouw";
  languages: string[];
  bio: string;
  health: {
    mobility: number;
    independence: number;
    socialWellbeing: number;
    mentalWellbeing: number;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Mock data — all 10 seniors
// ─────────────────────────────────────────────────────────────────────────────

const SENIOR_DETAILS: SeniorDetail[] = [
  {
    id: "1",
    name: "Ans de Vries",
    initials: "AV",
    age: 79,
    distanceKm: 0.8,
    activities: ["buiten", "kletsen", "lezen"],
    availability: ["Ma", "Wo", "Vr"],
    location: "Jordaan, Amsterdam",
    gender: "vrouw",
    languages: ["Nederlands"],
    bio: "Ans is een gezellige vrouw die houdt van wandelen in het park en lange gesprekken bij een kop thee. Ze woont al haar hele leven in de Jordaan en kent de buurt op haar duimpje.",
    health: { mobility: 3, independence: 4, socialWellbeing: 5, mentalWellbeing: 4 },
  },
  {
    id: "2",
    name: "Cor Bakker",
    initials: "CB",
    age: 83,
    distanceKm: 1.2,
    activities: ["muziek", "eten"],
    availability: ["Di", "Do", "Za"],
    location: "Centrum, Haarlem",
    gender: "man",
    languages: ["Nederlands"],
    bio: "Cor is een rustige man met een grote liefde voor muziek en koken. Hij vertelt graag over zijn leven en geniet van goed gezelschap aan tafel.",
    health: { mobility: 2, independence: 3, socialWellbeing: 4, mentalWellbeing: 3 },
  },
  {
    id: "3",
    name: "Mien Janssen",
    initials: "MJ",
    age: 76,
    distanceKm: 1.9,
    activities: ["kletsen", "creatief", "digitaal"],
    availability: ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"],
    location: "Bos en Lommer, Amsterdam",
    gender: "vrouw",
    languages: ["Nederlands"],
    bio: "Mien is creatief en vol energie. Ze houdt van knutselen, puzzelen en kletsen met nieuwe mensen. Ze is altijd bereid om iets nieuws te proberen.",
    health: { mobility: 4, independence: 5, socialWellbeing: 5, mentalWellbeing: 5 },
  },
  {
    id: "4",
    name: "Piet Smit",
    initials: "PS",
    age: 81,
    distanceKm: 2.3,
    activities: ["sport", "buiten"],
    availability: ["Wo", "Za", "Zo"],
    location: "Scheveningen, Den Haag",
    gender: "man",
    languages: ["Nederlands"],
    bio: "Piet is een actieve man die graag buiten is. Hij wandelt dagelijks langs de kust en houdt van sport kijken. Een gesprekspartner die altijd enthousiast is.",
    health: { mobility: 5, independence: 5, socialWellbeing: 3, mentalWellbeing: 4 },
  },
  {
    id: "5",
    name: "Truus van Dijk",
    initials: "TD",
    age: 87,
    distanceKm: 3.1,
    activities: ["lezen", "muziek", "eten", "kletsen"],
    availability: ["Di", "Vr"],
    location: "Overveen, Bloemendaal",
    gender: "vrouw",
    languages: ["Nederlands", "Duits"],
    bio: "Truus is een belezenvrouw die van rust houdt. Ze leest veel, luistert naar klassieke muziek en vertelt graag over vroeger. Ze geniet van rustig gezelschap.",
    health: { mobility: 2, independence: 3, socialWellbeing: 3, mentalWellbeing: 4 },
  },
  {
    id: "6",
    name: "Jan Bosman",
    initials: "JB",
    age: 74,
    distanceKm: 3.7,
    activities: ["digitaal", "kletsen"],
    availability: ["Ma", "Do"],
    location: "IJburg, Amsterdam",
    gender: "man",
    languages: ["Nederlands", "Engels"],
    bio: "Jan is een voormalig IT-er die anderen graag helpt met computers en tablets. Hij is handig, geduldig en altijd bereid om nieuwe dingen uit te leggen.",
    health: { mobility: 3, independence: 4, socialWellbeing: 4, mentalWellbeing: 5 },
  },
  {
    id: "7",
    name: "Ria Hendriks",
    initials: "RH",
    age: 80,
    distanceKm: 4.2,
    activities: ["creatief", "lezen"],
    availability: ["Wo", "Vr", "Za"],
    location: "Kralingen, Rotterdam",
    gender: "vrouw",
    languages: ["Nederlands"],
    bio: "Ria is een rustige vrouw met een grote passie voor borduren en lezen. Ze is bescheiden maar geniet oprecht van goed gezelschap en een luisterend oor.",
    health: { mobility: 2, independence: 3, socialWellbeing: 3, mentalWellbeing: 4 },
  },
  {
    id: "8",
    name: "Gerrit Mulder",
    initials: "GM",
    age: 77,
    distanceKm: 4.8,
    activities: ["buiten", "sport", "eten"],
    availability: ["Di", "Do", "Zo"],
    location: "Oost, Utrecht",
    gender: "man",
    languages: ["Nederlands"],
    bio: "Gerrit is energiek en houdt van de natuur. Hij fietst regelmatig en geniet van een goede maaltijd met vrienden. Hij is open, sportief en altijd vriendelijk.",
    health: { mobility: 5, independence: 5, socialWellbeing: 4, mentalWellbeing: 5 },
  },
  {
    id: "9",
    name: "Lien Visser",
    initials: "LV",
    age: 82,
    distanceKm: 5.5,
    activities: ["kletsen", "muziek", "digitaal"],
    availability: ["Ma", "Wo"],
    location: "Centrum, Leiden",
    gender: "vrouw",
    languages: ["Nederlands", "Frans"],
    bio: "Lien praat graag over vroeger en luistert naar muziek. Ze is digitaal actief en vindt het leuk om via video te bellen met familie. Een warme en open persoon.",
    health: { mobility: 3, independence: 4, socialWellbeing: 5, mentalWellbeing: 4 },
  },
  {
    id: "10",
    name: "Kees Postma",
    initials: "KP",
    age: 78,
    distanceKm: 6.0,
    activities: ["lezen", "creatief", "buiten", "sport"],
    availability: ["Do", "Za"],
    location: "Leidse Hout, Leiden",
    gender: "man",
    languages: ["Nederlands"],
    bio: "Kees is een allrounder: hij wandelt, knutselt en leest. Hij is nieuwsgierig, heeft humor en geniet van gesprekken over van alles en nog wat.",
    health: { mobility: 4, independence: 4, socialWellbeing: 4, mentalWellbeing: 4 },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Health dots component
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

export default function SeniorProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const senior = SENIOR_DETAILS.find((s) => s.id === id) ?? SENIOR_DETAILS[0];
  const firstName = senior.name.split(" ")[0];

  const [saved, setSaved] = useState(false);

  const healthRows: { label: string; key: keyof SeniorDetail["health"] }[] = [
    { label: "Mobiliteit",       key: "mobility" },
    { label: "Zelfstandigheid",  key: "independence" },
    { label: "Sociaal welzijn",  key: "socialWellbeing" },
    { label: "Mentaal welzijn",  key: "mentalWellbeing" },
  ];

  const detailRows: {
    icon: React.ComponentProps<typeof Feather>["name"];
    label: string;
    value: string;
  }[] = [
    { icon: "calendar",       label: "Leeftijd",  value: `${senior.age} jaar` },
    { icon: "map-pin",        label: "Afstand",   value: `${senior.distanceKm.toFixed(1).replace(".", ",")} km van jou` },
    { icon: "map",            label: "Buurt",     value: senior.location },
    { icon: "user",            label: "Geslacht",  value: senior.gender },
    { icon: "message-circle", label: "Talen",     value: senior.languages.join(", ") },
  ];

  return (
    <View style={[styles.root, { backgroundColor: "#F2F3F5" }]}>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: topPad }]}>
        {/* Back */}
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.7}
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="arrow-left" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Avatar + name */}
        <View style={styles.headerCenter}>
          <View style={styles.avatar}>
            <Typography style={styles.avatarInitials}>{senior.initials}</Typography>
          </View>
          <Typography variant="h4" style={{ color: "#FFFFFF", marginTop: DS.spacing.xs }}>
            {senior.name}
          </Typography>
          <Typography variant="caption" style={{ color: "rgba(255,255,255,0.75)", marginTop: 2 }}>
            {senior.age} jaar · {senior.location}
          </Typography>
        </View>

        {/* Bookmark */}
        <TouchableOpacity
          style={[styles.bookmarkBtn, saved && styles.bookmarkBtnActive]}
          activeOpacity={0.8}
          onPress={() => setSaved((v) => !v)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={saved ? "bookmark" : "bookmark-outline"}
            size={22}
            color={saved ? "#A01550" : "#FFFFFF"}
          />
        </TouchableOpacity>
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
          <Typography variant="h5">Over {firstName}</Typography>
          <Typography variant="body2" color="textSecondary" style={{ lineHeight: 22 }}>
            {senior.bio}
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
            {senior.availability.map((day) => (
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
            {senior.activities.map((actId) => {
              const meta = ACTIVITY_META[actId];
              return (
                <View key={actId} style={styles.activityChip}>
                  <Feather name={meta.icon} size={11} color="#3A9490" />
                  <Typography style={styles.chipLabel}>{meta.label}</Typography>
                </View>
              );
            })}
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
              <HealthDots score={senior.health[row.key]} />
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
        <TouchableOpacity
          style={[styles.saveBtn, saved && styles.saveBtnActive]}
          activeOpacity={0.85}
          onPress={() => setSaved((v) => !v)}
        >
          <Ionicons
            name={saved ? "bookmark" : "bookmark-outline"}
            size={18}
            color={saved ? "#FFFFFF" : "#3A9490"}
          />
          <Typography style={[styles.saveBtnLabel, saved && { color: "#FFFFFF" }]}>
            {saved ? "Opgeslagen ✓" : "Senior opslaan"}
          </Typography>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1 },

  // Header
  header: {
    backgroundColor: "#8CBFBB",
    paddingHorizontal: DS.spacing.lg,
    paddingBottom: DS.spacing.md,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginTop: DS.spacing.xs,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    paddingTop: DS.spacing.xs,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#D6ECEA",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
  },
  avatarInitials: {
    fontSize: 17,
    fontWeight: "700",
    color: "#3A9490",
  },
  bookmarkBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: DS.spacing.xs,
  },
  bookmarkBtnActive: {
    backgroundColor: "#FAE0EC",
  },

  // Body
  body: {
    padding: DS.spacing.md,
    gap: DS.spacing.md,
  },

  // Detail rows
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.sm,
    paddingVertical: DS.spacing.xs,
  },
  detailIconWrap: {
    width: 28,
    height: 28,
    borderRadius: DS.shape.radius.sm,
    backgroundColor: "#EEF7F6",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  detailLabel: {
    width: 100,
    flexShrink: 0,
  },
  detailValue: {
    flex: 1,
    fontWeight: "500",
  },

  // Activity chips
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: DS.spacing.xs,
  },
  activityChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(160, 21, 80, 0.3)",
    borderRadius: DS.shape.radius.full,
    paddingHorizontal: DS.spacing.sm,
    paddingVertical: DS.spacing.xxs + 1,
  },
  chipLabel: {
    fontSize: 12,
    color: "#3A9490",
    fontWeight: "500",
  },

  // Health
  healthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: DS.spacing.xs,
  },
  healthLabel: {
    flex: 1,
    color: DS.palette.text.primary,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  // Availability
  availRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: DS.spacing.xs,
  },
  dayChip: {
    backgroundColor: "#EEF7F6",
    borderRadius: DS.shape.radius.full,
    paddingHorizontal: DS.spacing.sm,
    paddingVertical: DS.spacing.xxs,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3A9490",
  },

  // Bottom bar
  bottomBar: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: DS.spacing.lg,
    paddingTop: DS.spacing.md,
    borderTopWidth: 1,
    borderTopColor: DS.palette.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 8,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: DS.spacing.sm,
    borderWidth: 1.5,
    borderColor: "#3A9490",
    borderRadius: DS.shape.radius.md,
    paddingVertical: DS.spacing.md,
  },
  saveBtnActive: {
    backgroundColor: "#3A9490",
    borderColor: "#3A9490",
  },
  saveBtnLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#3A9490",
  },
});
