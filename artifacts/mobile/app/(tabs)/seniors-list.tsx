import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  Platform,
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
  age: number;
  distanceKm: number;
  activities: ActivityId[];
  availability: string[];
}

const SENIORS: SeniorProfile[] = [
  {
    id: "1",
    name: "Ans de Vries",
    initials: "AV",
    age: 79,
    distanceKm: 0.8,
    activities: ["buiten", "kletsen", "lezen"],
    availability: ["Ma", "Wo", "Vr"],
  },
  {
    id: "2",
    name: "Cor Bakker",
    initials: "CB",
    age: 83,
    distanceKm: 1.2,
    activities: ["muziek", "eten"],
    availability: ["Di", "Do", "Za"],
  },
  {
    id: "3",
    name: "Mien Janssen",
    initials: "MJ",
    age: 76,
    distanceKm: 1.9,
    activities: ["kletsen", "creatief", "digitaal"],
    availability: ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"],
  },
  {
    id: "4",
    name: "Piet Smit",
    initials: "PS",
    age: 81,
    distanceKm: 2.3,
    activities: ["sport", "buiten"],
    availability: ["Wo", "Za", "Zo"],
  },
  {
    id: "5",
    name: "Truus van Dijk",
    initials: "TD",
    age: 87,
    distanceKm: 3.1,
    activities: ["lezen", "muziek", "eten", "kletsen"],
    availability: ["Di", "Vr"],
  },
  {
    id: "6",
    name: "Jan Bosman",
    initials: "JB",
    age: 74,
    distanceKm: 3.7,
    activities: ["digitaal", "kletsen"],
    availability: ["Ma", "Do"],
  },
  {
    id: "7",
    name: "Ria Hendriks",
    initials: "RH",
    age: 80,
    distanceKm: 4.2,
    activities: ["creatief", "lezen"],
    availability: ["Wo", "Vr", "Za"],
  },
  {
    id: "8",
    name: "Gerrit Mulder",
    initials: "GM",
    age: 77,
    distanceKm: 4.8,
    activities: ["buiten", "sport", "eten"],
    availability: ["Di", "Do", "Zo"],
  },
  {
    id: "9",
    name: "Lien Visser",
    initials: "LV",
    age: 82,
    distanceKm: 5.5,
    activities: ["kletsen", "muziek", "digitaal"],
    availability: ["Ma", "Wo"],
  },
  {
    id: "10",
    name: "Kees Postma",
    initials: "KP",
    age: 78,
    distanceKm: 6.0,
    activities: ["lezen", "creatief", "buiten", "sport"],
    availability: ["Do", "Za"],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Profile card
// ─────────────────────────────────────────────────────────────────────────────

const MAX_VISIBLE_ACTIVITIES = 3;

// ── Avatar palette — cycles per card ──────────────────────────────────────────
const AVATAR_PALETTE = [
  DS.iconBadge.teal,
  DS.iconBadge.orange,
  DS.iconBadge.navy,
  DS.iconBadge.green,
  DS.iconBadge.purple,
];

interface ProfileCardProps {
  senior: SeniorProfile;
  index: number;
  bookmarked: boolean;
  onToggleBookmark: () => void;
}

function ProfileCard({ senior, index, bookmarked, onToggleBookmark }: ProfileCardProps) {
  const router = useRouter();
  const avatarColor = AVATAR_PALETTE[index % AVATAR_PALETTE.length];
  const visibleActivities = senior.activities.slice(0, MAX_VISIBLE_ACTIVITIES);
  const overflowCount = senior.activities.length - MAX_VISIBLE_ACTIVITIES;

  return (
    <Card elevation={2} padding="md">
      {/* Top row: avatar · name/meta · bookmark */}
      <View style={styles.cardRow}>
        <View style={[styles.avatar, { backgroundColor: avatarColor.bg }]}>
          <Typography style={[styles.avatarInitials, { color: avatarColor.icon }]}>{senior.initials}</Typography>
        </View>

        <View style={styles.info}>
          <Typography variant="subtitle1" style={styles.name}>
            {senior.name}
          </Typography>
          <View style={styles.metaRow}>
            <Typography variant="caption" color="textSecondary">
              {senior.age} jaar
            </Typography>
            <Typography variant="caption" color="textSecondary" style={styles.metaDot}>·</Typography>
            <Feather name="map-pin" size={11} color={DS.palette.text.secondary} />
            <Typography variant="caption" color="textSecondary">
              {senior.distanceKm.toFixed(1).replace(".", ",")} km
            </Typography>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.bookmarkBtn, bookmarked && styles.bookmarkBtnActive]}
          activeOpacity={0.8}
          onPress={onToggleBookmark}
        >
          <Ionicons
            name={bookmarked ? "bookmark" : "bookmark-outline"}
            size={20}
            color={bookmarked ? "#A01550" : DS.palette.text.hint}
          />
        </TouchableOpacity>
      </View>

      {/* Activity chips */}
      <View style={styles.availRow}>
        <Typography variant="caption" color="textSecondary" style={styles.availLabel}>
          Activiteiten:
        </Typography>
        {visibleActivities.map((actId) => {
          const meta = ACTIVITY_META[actId];
          return (
            <View key={actId} style={styles.activityChip}>
              <Feather name={meta.icon} size={10} color="#3A9490" />
              <Typography style={styles.chipLabel}>{meta.label}</Typography>
            </View>
          );
        })}
        {overflowCount > 0 && (
          <View style={[styles.activityChip, styles.overflowChip]}>
            <Typography style={styles.chipLabel}>+{overflowCount}</Typography>
          </View>
        )}
      </View>

      {/* Availability */}
      <View style={styles.availRow}>
        <Typography variant="caption" color="textSecondary" style={styles.availLabel}>
          Beschikbaar:
        </Typography>
        {senior.availability.map((day) => (
          <View key={day} style={styles.dayChip}>
            <Typography style={styles.dayLabel}>{day}</Typography>
          </View>
        ))}
      </View>

      {/* Divider + CTA */}
      <View style={styles.cardDivider} />
      <TouchableOpacity
        style={styles.ctaRow}
        activeOpacity={0.7}
        onPress={() => router.push(`/senior-profile?id=${senior.id}`)}
      >
        <Typography style={styles.ctaText}>Bekijk profiel</Typography>
        <Feather name="arrow-right" size={13} color="#3A9490" />
      </TouchableOpacity>
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
  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [modalCheckbox, setModalCheckbox] = useState(false);

  const toggleBookmark = (id: string) => {
    const isCurrentlyBookmarked = bookmarked.has(id);
    if (!isCurrentlyBookmarked && !dontShowAgain) {
      setModalCheckbox(false);
      setShowModal(true);
    }
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

  const handleClose = () => {
    if (modalCheckbox) setDontShowAgain(true);
    setShowModal(false);
  };

  return (
    <View style={[styles.root, { backgroundColor: "#F2F3F5" }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad }]}>
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.7}
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="arrow-left" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Typography variant="h5" style={[styles.headerTitle, { color: "#FFFFFF" }]}>
            Senioren bij jou in de buurt
          </Typography>
          <Typography variant="caption" style={{ color: "rgba(255,255,255,0.75)" }}>
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
              color={viewMode === "list" ? "#3A9490" : "rgba(255,255,255,0.85)"}
            />
            <Typography
              style={[
                styles.toggleLabel,
                { color: viewMode === "list" ? "#3A9490" : "rgba(255,255,255,0.85)" },
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
              color={viewMode === "map" ? "#3A9490" : "rgba(255,255,255,0.85)"}
            />
            <Typography
              style={[
                styles.toggleLabel,
                { color: viewMode === "map" ? "#3A9490" : "rgba(255,255,255,0.85)" },
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
          {SENIORS.map((senior, i) => (
            <ProfileCard
              key={senior.id}
              senior={senior}
              index={i}
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

      {/* ── Save confirmation modal ──────────────────────────────────── */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Typography variant="h5" style={styles.modalHeading}>
              Profiel opgeslagen
            </Typography>
            <Typography variant="body2" color="textSecondary" style={styles.modalBody}>
              Dit profiel is opgeslagen aan jouw lijst. Later wordt gekeken of je gematcht kan worden aan deze senior.
            </Typography>
            <TouchableOpacity
              style={styles.checkboxRow}
              activeOpacity={0.7}
              onPress={() => setModalCheckbox((v) => !v)}
            >
              <Ionicons
                name={modalCheckbox ? "checkbox" : "square-outline"}
                size={20}
                color={modalCheckbox ? DS.palette.primary.main : DS.palette.text.hint}
              />
              <Typography variant="body2" style={styles.checkboxLabel}>
                Dit bericht niet meer laten zien.
              </Typography>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalBtn}
              activeOpacity={0.85}
              onPress={handleClose}
            >
              <Typography style={styles.modalBtnLabel}>Sluiten</Typography>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: DS.spacing.lg,
    paddingBottom: DS.spacing.lg,
    backgroundColor: "#8CBFBB",
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
    borderColor: "rgba(255,255,255,0.5)",
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
    backgroundColor: "#FFFFFF",
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
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#D6ECEA",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarInitials: {
    fontSize: 17,
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
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.xs,
  },
  metaDot: {
    marginHorizontal: 1,
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
    backgroundColor: "#EEF7F6",
    borderRadius: DS.shape.radius.full,
    paddingHorizontal: DS.spacing.sm,
    paddingVertical: DS.spacing.xxs,
  },
  overflowChip: {
    backgroundColor: "#EEF7F6",
  },
  chipLabel: {
    fontSize: 11,
    color: "#3A9490",
  },
  availRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: DS.spacing.xs,
    marginTop: DS.spacing.xs,
  },
  availLabel: {
    marginRight: DS.spacing.xxs,
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
  cardDivider: {
    height: 1,
    backgroundColor: DS.palette.border,
    marginTop: DS.spacing.md,
  },
  ctaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: DS.spacing.xs,
    paddingTop: DS.spacing.sm,
  },
  ctaText: {
    color: "#3A9490",
    fontWeight: "600",
    fontSize: 13,
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
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: DS.spacing.xl,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: DS.shape.radius.lg,
    padding: DS.spacing.xl,
    gap: DS.spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 16,
  },
  modalHeading: {
    color: DS.palette.text.primary,
  },
  modalBody: {
    lineHeight: 22,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.sm,
    marginTop: DS.spacing.xs,
  },
  checkboxLabel: {
    flex: 1,
    color: DS.palette.text.secondary,
  },
  modalBtn: {
    backgroundColor: DS.palette.primary.main,
    borderRadius: DS.shape.radius.md,
    paddingVertical: DS.spacing.md,
    alignItems: "center",
    marginTop: DS.spacing.xs,
  },
  modalBtnLabel: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
});
