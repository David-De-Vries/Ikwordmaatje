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

import { Card, Typography } from "@/components/ui";
import { DS } from "@/constants/design-system";
import { useColors } from "@/hooks/useColors";

// ─────────────────────────────────────────────────────────────────────────────
// Activity meta — mirrors step4.tsx
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
// Mock senior profiles
// ─────────────────────────────────────────────────────────────────────────────

interface SeniorProfile {
  id: string;
  name: string;
  initials: string;
  distanceKm: number;
  activities: ActivityId[];
  availability: string[];
}

const SENIORS: SeniorProfile[] = [
  {
    id: "1",
    name: "Ans de Vries",
    initials: "AV",
    distanceKm: 0.8,
    activities: ["buiten", "kletsen", "lezen"],
    availability: ["Ma", "Wo", "Vr"],
  },
  {
    id: "2",
    name: "Cor Bakker",
    initials: "CB",
    distanceKm: 1.2,
    activities: ["muziek", "eten"],
    availability: ["Di", "Do", "Za"],
  },
  {
    id: "3",
    name: "Mien Janssen",
    initials: "MJ",
    distanceKm: 1.9,
    activities: ["kletsen", "creatief", "digitaal"],
    availability: ["Ma", "Di", "Wo", "Do"],
  },
  {
    id: "4",
    name: "Piet Smit",
    initials: "PS",
    distanceKm: 2.3,
    activities: ["sport", "buiten"],
    availability: ["Wo", "Za", "Zo"],
  },
  {
    id: "5",
    name: "Truus van Dijk",
    initials: "TD",
    distanceKm: 3.1,
    activities: ["lezen", "muziek", "eten", "kletsen"],
    availability: ["Di", "Vr"],
  },
  {
    id: "6",
    name: "Jan Bosman",
    initials: "JB",
    distanceKm: 3.7,
    activities: ["digitaal", "kletsen"],
    availability: ["Ma", "Do"],
  },
  {
    id: "7",
    name: "Ria Hendriks",
    initials: "RH",
    distanceKm: 4.2,
    activities: ["creatief", "lezen"],
    availability: ["Wo", "Vr", "Za"],
  },
  {
    id: "8",
    name: "Gerrit Mulder",
    initials: "GM",
    distanceKm: 4.8,
    activities: ["buiten", "sport", "eten"],
    availability: ["Di", "Do", "Zo"],
  },
  {
    id: "9",
    name: "Lien Visser",
    initials: "LV",
    distanceKm: 5.5,
    activities: ["kletsen", "muziek", "digitaal"],
    availability: ["Ma", "Wo"],
  },
  {
    id: "10",
    name: "Kees Postma",
    initials: "KP",
    distanceKm: 6.0,
    activities: ["lezen", "creatief", "buiten", "sport"],
    availability: ["Do", "Za"],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Profile card
// ─────────────────────────────────────────────────────────────────────────────

const MAX_VISIBLE_ACTIVITIES = 3;

interface ProfileCardProps {
  senior: SeniorProfile;
  bookmarked: boolean;
  onToggleBookmark: () => void;
}

function ProfileCard({ senior, bookmarked, onToggleBookmark }: ProfileCardProps) {
  const visibleActivities = senior.activities.slice(0, MAX_VISIBLE_ACTIVITIES);
  const overflowCount = senior.activities.length - MAX_VISIBLE_ACTIVITIES;

  return (
    <Card elevation={2} padding="md">
      <View style={styles.cardRow}>
        {/* Avatar */}
        <View style={styles.avatar}>
          <Typography style={styles.avatarInitials}>{senior.initials}</Typography>
        </View>

        {/* Info */}
        <View style={styles.info}>
          {/* Name */}
          <Typography variant="subtitle1" style={styles.name}>
            {senior.name}
          </Typography>

          {/* Distance */}
          <View style={styles.distanceRow}>
            <Feather name="map-pin" size={12} color={DS.palette.text.secondary} />
            <Typography variant="caption" color="textSecondary">
              {senior.distanceKm.toFixed(1).replace(".", ",")} km van jou
            </Typography>
          </View>

          {/* Activities */}
          <View style={styles.chipsRow}>
            {visibleActivities.map((actId) => {
              const meta = ACTIVITY_META[actId];
              return (
                <View key={actId} style={styles.activityChip}>
                  <Feather name={meta.icon} size={10} color={DS.palette.text.secondary} />
                  <Typography style={styles.chipLabel}>{meta.label}</Typography>
                </View>
              );
            })}
            {overflowCount > 0 && (
              <View style={[styles.activityChip, styles.overflowChip]}>
                <Typography style={[styles.chipLabel, { color: DS.palette.text.secondary }]}>
                  +{overflowCount}
                </Typography>
              </View>
            )}
          </View>

          {/* Availability */}
          <View style={styles.chipsRow}>
            {senior.availability.map((day) => (
              <View key={day} style={styles.dayChip}>
                <Typography style={styles.dayLabel}>{day}</Typography>
              </View>
            ))}
          </View>
        </View>

        {/* Bookmark */}
        <TouchableOpacity
          style={[styles.bookmarkBtn, bookmarked && styles.bookmarkBtnActive]}
          activeOpacity={0.8}
          onPress={onToggleBookmark}
        >
          <Feather
            name="bookmark"
            size={20}
            color={bookmarked ? "#A01550" : DS.palette.text.hint}
          />
        </TouchableOpacity>
      </View>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen
// ─────────────────────────────────────────────────────────────────────────────

type ViewMode = "list" | "map";

export default function SeniorsListScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + DS.spacing.sm }]}>
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.7}
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="arrow-left" size={22} color={DS.palette.text.primary} />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Typography variant="h5" style={styles.headerTitle}>
            Senioren bij jou in de buurt
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {SENIORS.length} beschikbare senioren
          </Typography>
        </View>

        {/* List / Map toggle */}
        <View style={styles.toggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === "list" && styles.toggleBtnActive]}
            activeOpacity={0.8}
            onPress={() => setViewMode("list")}
          >
            <Feather
              name="list"
              size={14}
              color={viewMode === "list" ? "#FFFFFF" : DS.palette.text.secondary}
            />
            <Typography
              style={[
                styles.toggleLabel,
                { color: viewMode === "list" ? "#FFFFFF" : DS.palette.text.secondary },
              ]}
            >
              Lijst
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === "map" && styles.toggleBtnActive]}
            activeOpacity={0.8}
            onPress={() => setViewMode("map")}
          >
            <Feather
              name="map"
              size={14}
              color={viewMode === "map" ? "#FFFFFF" : DS.palette.text.secondary}
            />
            <Typography
              style={[
                styles.toggleLabel,
                { color: viewMode === "map" ? "#FFFFFF" : DS.palette.text.secondary },
              ]}
            >
              Kaart
            </Typography>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {viewMode === "list" ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + DS.spacing.xxxl },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {SENIORS.map((senior) => (
            <ProfileCard
              key={senior.id}
              senior={senior}
              bookmarked={bookmarked.has(senior.id)}
              onToggleBookmark={() => toggleBookmark(senior.id)}
            />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.mapPlaceholder}>
          <View style={styles.mapIcon}>
            <Feather name="map" size={36} color="#3A9490" />
          </View>
          <Typography variant="subtitle1" align="center">
            Kaartweergave komt binnenkort
          </Typography>
          <Typography variant="body2" color="textSecondary" align="center" style={{ maxWidth: 260 }}>
            We werken aan een interactieve kaart zodat je senioren in de buurt kunt zien.
          </Typography>
        </View>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.md,
    paddingHorizontal: DS.spacing.md,
    paddingBottom: DS.spacing.md,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: DS.palette.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  // Toggle
  toggle: {
    flexDirection: "row",
    borderRadius: DS.shape.radius.full,
    borderWidth: 1,
    borderColor: DS.palette.border,
    overflow: "hidden",
  },
  toggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.xs,
    paddingHorizontal: DS.spacing.md,
    paddingVertical: DS.spacing.xs,
  },
  toggleBtnActive: {
    backgroundColor: "#3A9490",
  },
  toggleLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  // List
  listContent: {
    padding: DS.spacing.md,
    gap: DS.spacing.md,
  },
  // Profile card
  cardRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: DS.spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#D6ECEA",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarInitials: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3A9490",
  },
  info: {
    flex: 1,
    gap: DS.spacing.xs,
  },
  name: {
    fontWeight: "700",
    fontSize: 15,
  },
  distanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: DS.spacing.xs,
  },
  activityChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#F0F0F0",
    borderRadius: DS.shape.radius.full,
    paddingHorizontal: DS.spacing.sm,
    paddingVertical: DS.spacing.xxs,
  },
  overflowChip: {
    backgroundColor: "#E8E8E8",
  },
  chipLabel: {
    fontSize: 11,
    color: DS.palette.text.secondary,
  },
  dayChip: {
    backgroundColor: "#EEF7F6",
    borderRadius: DS.shape.radius.full,
    paddingHorizontal: DS.spacing.sm,
    paddingVertical: DS.spacing.xxs,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#3A9490",
  },
  // Bookmark
  bookmarkBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  bookmarkBtnActive: {
    backgroundColor: "#FAE0EC",
  },
  // Map placeholder
  mapPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: DS.spacing.md,
    paddingHorizontal: DS.spacing.xl,
  },
  mapIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#D6ECEA",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: DS.spacing.sm,
  },
});
