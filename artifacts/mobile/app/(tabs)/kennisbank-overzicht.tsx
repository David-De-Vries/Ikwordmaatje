import { Feather } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Card, Typography } from "@/components/ui";
import { DS } from "@/constants/design-system";
import { ARTICLES, Article } from "./kennisbank-artikel";

// ─────────────────────────────────────────────────────────────────────────────
// Category sections
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORIES: { label: string; ids: string[] }[] = [
  {
    label: "Eerste stappen",
    ids: ["introductie", "gesprek", "vog"],
  },
  {
    label: "Communicatie & gesprek",
    ids: ["vertrouwen", "grenzen"],
  },
  {
    label: "Moeilijke momenten",
    ids: ["moeilijk", "eenzaamheid"],
  },
  {
    label: "Praktisch plannen",
    ids: ["plannen", "activiteiten"],
  },
  {
    label: "Gezondheid & welzijn",
    ids: ["gezondheid", "welzijn"],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Article row
// ─────────────────────────────────────────────────────────────────────────────

function ArticleRow({
  article,
  onPress,
  isLast,
}: {
  article: Article;
  onPress: () => void;
  isLast: boolean;
}) {
  return (
    <>
      <TouchableOpacity
        style={styles.row}
        activeOpacity={0.75}
        onPress={onPress}
      >
        <View style={[styles.rowIcon, { backgroundColor: article.bg }]}>
          <Feather name={article.icon} size={18} color={article.color} />
        </View>
        <View style={{ flex: 1, gap: DS.spacing.xxs }}>
          <Typography variant="subtitle1" style={{ fontWeight: "600", fontSize: 14 }}>
            {article.title}
          </Typography>
          <Typography variant="caption" color="textSecondary" style={{ lineHeight: 17 }}>
            {article.snippet}
          </Typography>
          <View style={styles.rowMeta}>
            <Feather name="clock" size={11} color={DS.palette.text.hint} />
            <Typography variant="caption" style={{ color: DS.palette.text.hint }}>
              {article.readTime}
            </Typography>
          </View>
        </View>
        <Feather name="chevron-right" size={16} color={DS.palette.text.hint} />
      </TouchableOpacity>
      {!isLast && (
        <View style={styles.rowDivider} />
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen
// ─────────────────────────────────────────────────────────────────────────────

export default function KennisbankOverzichtScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  return (
    <View style={styles.root}>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: topPad }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backBtn}
            activeOpacity={0.7}
            onPress={() => router.back()}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather name="arrow-left" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Typography variant="h4" style={{ color: "#FFFFFF" }}>
              Kennisbank
            </Typography>
            <Typography variant="caption" style={{ color: "rgba(255,255,255,0.75)", marginTop: 2 }}>
              Informatie & tips voor vrijwilligers
            </Typography>
          </View>

          <View style={styles.backBtn} />
        </View>

        {/* Search bar — visual only */}
        <View style={styles.searchBar}>
          <Feather name="search" size={16} color={DS.palette.text.hint} />
          <TextInput
            style={styles.searchInput}
            placeholder="Zoek artikelen..."
            placeholderTextColor={DS.palette.text.hint}
            editable={false}
            pointerEvents="none"
          />
        </View>
      </View>

      {/* ── Scrollable body ─────────────────────────────────────────────── */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.body,
          { paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {CATEGORIES.map((cat) => {
          const articles = cat.ids
            .map((id) => ARTICLES[id])
            .filter(Boolean) as Article[];
          if (articles.length === 0) return null;

          return (
            <View key={cat.label} style={styles.section}>
              <Typography
                variant="caption"
                style={styles.sectionLabel}
              >
                {cat.label.toUpperCase()}
              </Typography>
              <Card elevation={2} padding="none">
                {articles.map((article, i) => (
                  <ArticleRow
                    key={article.id}
                    article={article}
                    onPress={() =>
                      router.push(
                        `/kennisbank-artikel?id=${article.id}` as Href
                      )
                    }
                    isLast={i === articles.length - 1}
                  />
                ))}
              </Card>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F2F3F5",
  },
  header: {
    backgroundColor: "#8CBFBB",
    paddingHorizontal: DS.spacing.lg,
    paddingBottom: DS.spacing.lg,
    gap: DS.spacing.md,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    width: 36,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.sm,
    backgroundColor: "#FFFFFF",
    borderRadius: DS.shape.radius.full,
    paddingHorizontal: DS.spacing.md,
    paddingVertical: DS.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: DS.palette.text.primary,
    padding: 0,
  },
  body: {
    padding: DS.spacing.lg,
    gap: DS.spacing.lg,
  },
  section: {
    gap: DS.spacing.sm,
  },
  sectionLabel: {
    fontWeight: "700",
    color: DS.palette.text.secondary,
    letterSpacing: 0.8,
    fontSize: 11,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.md,
    padding: DS.spacing.md,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: DS.shape.radius.sm,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  rowMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.xxs,
  },
  rowDivider: {
    height: 1,
    backgroundColor: DS.palette.border,
    marginHorizontal: DS.spacing.md,
  },
});
