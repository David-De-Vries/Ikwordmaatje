/**
 * Dashboard Intake — Careibu FTUX Dashboard (post intake scheduling)
 *
 * Identical layout to dashboard.tsx (FTUX) — same header, wizard, drawer,
 * MatchingStatusCard, MatchCard, DiaryCard, InfoModulesCard.
 *
 * Only difference: TASK_ITEMS "Introductiegesprek inplannen" is marked done
 * and its sublabel shows the date/time the user scheduled.
 */
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, Card, Typography } from "@/components/ui";
import { DS } from "@/constants/design-system";
import { useOnboarding } from "@/context/OnboardingContext";
import { useColors } from "@/hooks/useColors";

export const DashboardModeContext = React.createContext({ allTasksDone: false });

// ─────────────────────────────────────────────────────────────────────────────
// Dutch date helpers
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// Wizard step data
// ─────────────────────────────────────────────────────────────────────────────

const WIZARD_STEPS = [
  {
    step: 1,
    icon: "users" as const,
    iconColor: DS.palette.warning.main,
    iconBg: "#FFF0D9",
    title: "Je koppelstatus",
    body: "Hier zie je waar we staan in het vinden van jouw match. We laten je weten zodra er een introductie is gepland.",
  },
  {
    step: 2,
    icon: "book-open" as const,
    iconColor: DS.palette.primary.main,
    iconBg: "#FAE0EC",
    title: "Jouw dagboek",
    body: "Schrijf na elk bezoek een korte notitie. Zo hou je bij hoe het gaat en kun je terugkijken op jullie mooie momenten.",
  },
  {
    step: 3,
    icon: "layers" as const,
    iconColor: DS.palette.info.main,
    iconBg: DS.palette.info.bg,
    title: "Informatie & tips",
    body: "Hier vind je handige artikelen en tips, speciaal geselecteerd voor jouw project bij Careibu.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// WizardSection — dims/lifts each section during wizard
// ─────────────────────────────────────────────────────────────────────────────

function WizardSection({
  sectionIndex,
  wizardStep,
  onLayout,
  children,
}: {
  sectionIndex: number;
  wizardStep: number;
  onLayout?: (e: LayoutChangeEvent) => void;
  children: React.ReactNode;
}) {
  const isWizardActive = wizardStep >= 1 && wizardStep <= 3;
  const isHighlighted = wizardStep === sectionIndex;

  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const borderOpacity = useSharedValue(0);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    if (isWizardActive) {
      if (isHighlighted) {
        opacity.value = withTiming(1, { duration: 300 });
        scale.value = withSpring(1.02, { damping: 12, stiffness: 120 });
        borderOpacity.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 650 }),
            withTiming(0.3, { duration: 650 })
          ),
          -1,
          true
        );
        glowOpacity.value = withTiming(1, { duration: 350 });
      } else {
        opacity.value = withTiming(0.12, { duration: 300 });
        scale.value = withSpring(0.97, { damping: 14 });
        borderOpacity.value = withTiming(0, { duration: 250 });
        glowOpacity.value = withTiming(0, { duration: 250 });
      }
    } else {
      opacity.value = withTiming(1, { duration: 350 });
      scale.value = withSpring(1, { damping: 14 });
      borderOpacity.value = withTiming(0, { duration: 250 });
      glowOpacity.value = withTiming(0, { duration: 250 });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wizardStep]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const borderStyle = useAnimatedStyle(() => ({
    opacity: borderOpacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <Animated.View style={containerStyle} onLayout={onLayout}>
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          styles.highlightGlow,
          glowStyle,
          { pointerEvents: "none" },
        ]}
      />
      {children}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          styles.highlightBorder,
          borderStyle,
          { pointerEvents: "none" },
        ]}
      />
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Task items — same as dashboard.tsx except "intro" is done with scheduled date
// ─────────────────────────────────────────────────────────────────────────────

function makeTaskItems(intakeDateLabel: string) {
  return [
    {
      key: "profile",
      label: "Profiel aanmaken",
      sublabel: "Jouw gegevens en voorkeuren zijn opgeslagen.",
      status: "done",
      buttonLabel: null,
    },
    {
      key: "intro",
      label: "Introductiegesprek inplannen",
      sublabel: `Gepland voor: ${intakeDateLabel}`,
      status: "done",
      buttonLabel: null,
    },
    {
      key: "vog",
      label: "V.O.G. aanvragen",
      sublabel: "Een Verklaring Omtrent Gedrag is verplicht voor vrijwilligerswerk.",
      status: "upcoming",
      buttonLabel: "Aanvragen",
    },
    {
      key: "seniors",
      label: "Bekijk senioren bij jou in de buurt",
      sublabel: "Ontdek wie er in jouw omgeving op zoek is naar een vrijwilliger.",
      status: "upcoming",
      buttonLabel: "Bekijken",
    },
    {
      key: "match",
      label: "Matchen aan senior",
      sublabel: "Onze medewerkers zoeken actief naar de beste match voor jou.",
      status: "pending",
      buttonLabel: null,
      alwaysPending: true,
    },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 1 — Task List
// ─────────────────────────────────────────────────────────────────────────────

function MatchingStatusCard({ intakeDateLabel }: { intakeDateLabel: string }) {
  const { allTasksDone } = useContext(DashboardModeContext);
  const baseItems = makeTaskItems(intakeDateLabel);
  const tasks = allTasksDone
    ? baseItems.map((t) =>
        (t as any).alwaysPending ? t : { ...t, status: "done" as const }
      )
    : baseItems;

  const doneCount = tasks.filter((t) => t.status === "done").length;
  const totalCount = tasks.length;
  const allComplete = doneCount === totalCount;

  return (
    <Card elevation={2} padding="md" style={{ gap: DS.spacing.lg }}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconBadge, { backgroundColor: "#D6ECEA" }]}>
          <Feather name="check-square" size={20} color="#3A9490" />
        </View>
        <View style={{ flex: 1 }}>
          <Typography variant="h5">Taken lijst</Typography>
          <Typography variant="caption" color="textSecondary">
            Alles wat moet gebeuren voor je aan de slag kan
          </Typography>
        </View>
        <View style={[styles.pill, {
          backgroundColor: allComplete ? DS.palette.success.bg : "#FFF0D9",
        }]}>
          <View style={[styles.pillDot, {
            backgroundColor: allComplete ? DS.palette.success.main : DS.palette.warning.main,
          }]} />
          <Typography variant="caption" style={{
            color: allComplete ? DS.palette.success.dark : DS.palette.warning.dark,
          }}>
            {doneCount} / {totalCount}
          </Typography>
        </View>
      </View>

      <View>
        {tasks.map((task, i) => {
          const isDone = task.status === "done";
          const isPending = task.status === "pending";
          return (
            <View key={task.key}>
              <View style={styles.taskRow}>
                <View style={{ flex: 1 }}>
                  <Typography
                    variant="subtitle1"
                    numberOfLines={1}
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: isDone ? DS.palette.text.secondary : DS.palette.text.primary,
                      textDecorationLine: isDone ? "line-through" : "none",
                    }}
                  >
                    {task.label}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    style={{
                      marginTop: 2,
                      marginRight: 30,
                      textDecorationLine: isDone ? "line-through" : "none",
                    }}
                  >
                    {task.sublabel}
                  </Typography>
                </View>

                {isDone ? (
                  <View style={styles.doneCircle}>
                    <Feather name="check" size={14} color={DS.palette.success.dark} />
                  </View>
                ) : isPending ? (
                  <View style={styles.pendingChip}>
                    <Feather name="clock" size={14} color={DS.palette.warning.dark} />
                  </View>
                ) : (
                  <View style={styles.taskBtnRow}>
                    <TouchableOpacity style={styles.taskPill} activeOpacity={0.8} onPress={() => {}}>
                      <Typography style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 13 }}>
                        {task.buttonLabel}
                      </Typography>
                    </TouchableOpacity>
                    <Feather name="chevron-right" size={16} color={DS.palette.text.hint} />
                  </View>
                )}
              </View>
              {i < tasks.length - 1 && <View style={styles.taskDivider} />}
            </View>
          );
        })}
      </View>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 1b — Match Card
// ─────────────────────────────────────────────────────────────────────────────

function MatchCard() {
  const router = useRouter();
  const { allTasksDone } = useContext(DashboardModeContext);
  return (
    <Card elevation={2} padding="md" style={{ gap: DS.spacing.lg }}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconBadge, { backgroundColor: "#D6ECEA" }]}>
          <Feather name="user-plus" size={20} color="#3A9490" />
        </View>
        <View style={{ flex: 1 }}>
          <Typography variant="h5">Jouw match</Typography>
          <Typography variant="caption" color="textSecondary">
            {allTasksDone ? "Klaar om te matchen" : "Nog geen koppeling"}
          </Typography>
        </View>
      </View>

      <View style={styles.emptyState}>
        <View style={[styles.emptyIconCircle, { backgroundColor: "#D6ECEA" }]}>
          <Feather name={allTasksDone ? "users" : "user-plus"} size={30} color="#8CBFBB" />
        </View>
        <Typography variant="subtitle1" align="center">
          {allTasksDone ? "Bekijk senioren bij jou in de buurt" : "Zoek senioren bij jou in de buurt"}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          style={{ maxWidth: 200 }}
        >
          {"Zodra we een passende senior voor jou hebben gevonden, zie je hier alle informatie over jouw match."}
        </Typography>
      </View>

      <TouchableOpacity style={styles.viewSeniorsBtn} activeOpacity={0.85} onPress={() => router.push("/seniors-list")}>
        <Typography style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 14, textAlign: "center" }}>
          Bekijk senioren bij jou in de buurt
        </Typography>
      </TouchableOpacity>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 2 — Diary
// ─────────────────────────────────────────────────────────────────────────────

function DiaryCard() {
  return (
    <Card elevation={2} padding="md" style={{ gap: DS.spacing.lg }}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconBadge, { backgroundColor: "#FAE0EC" }]}>
          <Feather name="book-open" size={20} color={DS.palette.primary.main} />
        </View>
        <View>
          <Typography variant="h5">Logboeken</Typography>
          <Typography variant="caption" color="textSecondary">
            0 notities
          </Typography>
        </View>
      </View>

      <View style={styles.emptyState}>
        <View style={[styles.emptyIconCircle, { backgroundColor: "#FAE0EC" }]}>
          <Feather name="feather" size={30} color={DS.palette.primary.light} />
        </View>
        <Typography variant="subtitle1" align="center">
          Hier komen je logboeken te staan
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          style={{ maxWidth: 260 }}
        >
          Na je eerste bezoek kun je hier bijhouden hoe het ging. Notities zijn
          alleen voor jouzelf.
        </Typography>
        <Button variant="outlined" color="primary" size="md" disabled>
          Notitie schrijven
        </Button>
      </View>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 3 — Information Modules
// ─────────────────────────────────────────────────────────────────────────────

const INFO_MODULES = [
  {
    id: "gesprek",
    icon: "message-circle" as const,
    color: DS.palette.secondary.dark,
    bg: "#E8F4F3",
    title: "Tips voor je eerste gesprek",
    snippet: "Maak je eerste ontmoeting onvergetelijk.",
    readTime: "3 min",
  },
  {
    id: "moeilijk",
    icon: "heart" as const,
    color: DS.palette.primary.main,
    bg: "#FAE0EC",
    title: "Omgaan met moeilijke momenten",
    snippet: "Soms gaat het minder goed. Dit helpt.",
    readTime: "5 min",
  },
  {
    id: "plannen",
    icon: "calendar" as const,
    color: DS.palette.info.main,
    bg: DS.palette.info.bg,
    title: "Je bezoek plannen",
    snippet: "Handige tips voor soepele afspraken.",
    readTime: "2 min",
  },
];

function InfoModulesCard() {
  return (
    <Card elevation={2} padding="md" style={{ gap: DS.spacing.lg }}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconBadge, { backgroundColor: DS.palette.info.bg }]}>
          <Feather name="layers" size={20} color={DS.palette.info.main} />
        </View>
        <View style={{ flex: 1 }}>
          <Typography variant="h5">Informatie & tips</Typography>
          <Typography variant="caption" color="textSecondary">
            Voor jouw Maatje-project
          </Typography>
        </View>
        <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Typography
            variant="caption"
            style={{ color: DS.palette.primary.main }}
          >
            Alle artikelen
          </Typography>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginHorizontal: -DS.spacing.lg }}
        contentContainerStyle={{
          paddingHorizontal: DS.spacing.lg,
          gap: DS.spacing.md,
        }}
      >
        {INFO_MODULES.map((mod) => (
          <TouchableOpacity
            key={mod.id}
            activeOpacity={0.82}
            style={[styles.moduleCard, { backgroundColor: mod.bg }]}
          >
            <View style={[styles.moduleIconBox, { backgroundColor: "#FFFFFFBB" }]}>
              <Feather name={mod.icon} size={18} color={mod.color} />
            </View>
            <Typography
              variant="subtitle2"
              style={{ color: mod.color, flexShrink: 1 }}
            >
              {mod.title}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {mod.snippet}
            </Typography>
            <View style={styles.readTimeRow}>
              <Feather name="clock" size={10} color={DS.palette.text.hint} />
              <Typography
                variant="caption"
                style={{ color: DS.palette.text.hint }}
              >
                {mod.readTime}
              </Typography>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Wizard Bottom Sheet — steps 1, 2, 3
// ─────────────────────────────────────────────────────────────────────────────

function WizardBottomSheet({
  wizardStep,
  onNext,
  onSkip,
  insetBottom,
}: {
  wizardStep: number;
  onNext: () => void;
  onSkip: () => void;
  insetBottom: number;
}) {
  const visible = wizardStep >= 1 && wizardStep <= 3;
  const safeIndex = Math.min(Math.max(0, wizardStep - 1), WIZARD_STEPS.length - 1);
  const stepData = WIZARD_STEPS[safeIndex];

  const slideY = useSharedValue(300);
  const iconBounce = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      slideY.value = withSpring(0, { damping: 22, stiffness: 180 });
      iconBounce.value = 0;
      iconBounce.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 900 }),
          withTiming(0, { duration: 900 })
        ),
        -1,
        true
      );
    } else {
      slideY.value = withTiming(300, { duration: 220 });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, wizardStep]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: slideY.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(iconBounce.value, [0, 1], [1, 1.14]) }],
  }));

  if (!stepData) return null;

  return (
    <Animated.View
      style={[
        styles.bottomSheet,
        sheetStyle,
        { paddingBottom: Math.max(insetBottom, DS.spacing.lg) + DS.spacing.lg },
      ]}
    >
      <View style={styles.sheetHandle} />

      <View style={{ gap: DS.spacing.xl }}>
        <View style={{ flexDirection: "row", gap: DS.spacing.md, alignItems: "flex-start" }}>
          <Animated.View
            style={[
              styles.wizardIconBadge,
              { backgroundColor: stepData.iconBg },
              iconStyle,
            ]}
          >
            <Feather name={stepData.icon} size={26} color={stepData.iconColor} />
          </Animated.View>
          <View style={{ flex: 1, gap: DS.spacing.xs }}>
            <Typography variant="h4">{stepData.title}</Typography>
            <Typography variant="body2" color="textSecondary">
              {stepData.body}
            </Typography>
          </View>
        </View>

        <View style={styles.dotsRow}>
          {[1, 2, 3].map((i) => (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                i === wizardStep
                  ? {
                      backgroundColor: DS.palette.primary.main,
                      width: 22,
                      borderRadius: 4,
                    }
                  : {
                      backgroundColor: DS.palette.border,
                    },
              ]}
            />
          ))}
        </View>

        <View style={{ gap: DS.spacing.sm }}>
          <Button
            variant="contained"
            color="primary"
            size="lg"
            fullWidth
            onPress={onNext}
          >
            {wizardStep < 3 ? "Volgende →" : "Klaar!"}
          </Button>
          <Button
            variant="text"
            color="default"
            size="md"
            fullWidth
            onPress={onSkip}
          >
            Rondleiding overslaan
          </Button>
        </View>
      </View>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Wizard Welcome Overlay — step 0
// ─────────────────────────────────────────────────────────────────────────────

function WizardWelcomeOverlay({
  visible,
  onStart,
  onSkip,
  firstName,
}: {
  visible: boolean;
  onStart: () => void;
  onSkip: () => void;
  firstName: string;
}) {
  const opacity = useSharedValue(0);
  const cardSlide = useSharedValue(60);
  const heroPulse = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 320 });
      cardSlide.value = withSpring(0, { damping: 20, stiffness: 160 });
      heroPulse.value = withRepeat(
        withSequence(
          withSpring(1.1, { damping: 6, stiffness: 80 }),
          withSpring(1, { damping: 6, stiffness: 80 })
        ),
        -1,
        true
      );
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      cardSlide.value = withTiming(60, { duration: 200 });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cardSlide.value }],
  }));
  const heroStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heroPulse.value }],
  }));

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        styles.overlayBg,
        overlayStyle,
        { pointerEvents: visible ? "auto" : "none" },
      ]}
    >
      <Animated.View style={[styles.overlayCard, cardStyle]}>
        <View style={styles.welcomeHero}>
          <Animated.View style={[styles.heroBubble, heroStyle]}>
            <Feather name="home" size={38} color={DS.palette.primary.main} />
          </Animated.View>
          <View style={styles.heroDecoRow}>
            {["#FAE0EC", "#A01550", "#D4396E", "#FAE0EC", "#A01550"].map(
              (c, i) => (
                <View
                  key={i}
                  style={[styles.heroDot, { backgroundColor: c, opacity: 0.25 + i * 0.1 }]}
                />
              )
            )}
          </View>
        </View>

        <View style={{ gap: DS.spacing.md, paddingHorizontal: DS.spacing.xl }}>
          <Typography variant="h2" align="center">
            Welkom{firstName ? `, ${firstName}` : ""}! 👋
          </Typography>
          <Typography variant="body1" color="textSecondary" align="center">
            Dit is je persoonlijke dashboard bij Careibu. We laten je snel zien
            wat er allemaal te vinden is.
          </Typography>
        </View>

        <View style={styles.featurePillRow}>
          {["Koppelstatus", "Dagboek", "Informatie"].map((label) => (
            <View
              key={label}
              style={[styles.featurePill, { backgroundColor: "#FAE0EC" }]}
            >
              <Typography
                variant="caption"
                style={{ color: DS.palette.primary.main }}
              >
                {label}
              </Typography>
            </View>
          ))}
        </View>

        <View
          style={{
            gap: DS.spacing.sm,
            paddingHorizontal: DS.spacing.xl,
            paddingBottom: DS.spacing.xxxl,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="lg"
            fullWidth
            onPress={onStart}
          >
            Start rondleiding
          </Button>
          <Button
            variant="text"
            color="default"
            size="md"
            fullWidth
            onPress={onSkip}
          >
            Overslaan
          </Button>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Wizard Done Overlay — step 4
// ─────────────────────────────────────────────────────────────────────────────

function Particle({ index }: { index: number }) {
  const angle = (index / 6) * Math.PI * 2;
  const dist = 60 + (index % 3) * 20;
  const anim = useSharedValue(0);
  const colors = ["#A01550", "#D4396E", "#FAE0EC", "#7BB5AD", "#FFC107", "#A01550"];

  useEffect(() => {
    anim.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1, { duration: 900 + index * 120 }),
        withTiming(0, { duration: 400 })
      ),
      -1,
      false
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: interpolate(anim.value, [0, 0.4, 1], [0, 1, 0]),
    transform: [
      { translateX: Math.cos(angle) * dist * anim.value },
      { translateY: Math.sin(angle) * dist * anim.value },
      { scale: interpolate(anim.value, [0, 0.5, 1], [0.5, 1, 0.3]) },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: colors[index % colors.length],
        },
        style,
      ]}
    />
  );
}

function WizardDoneOverlay({
  visible,
  onFinish,
}: {
  visible: boolean;
  onFinish: () => void;
}) {
  const opacity = useSharedValue(0);
  const cardSlide = useSharedValue(60);
  const checkScale = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 320 });
      cardSlide.value = withSpring(0, { damping: 20, stiffness: 160 });
      checkScale.value = withSpring(1, { damping: 10, stiffness: 120 });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      cardSlide.value = withTiming(60, { duration: 200 });
      checkScale.value = withTiming(0, { duration: 150 });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cardSlide.value }],
  }));
  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        styles.overlayBg,
        overlayStyle,
        { pointerEvents: visible ? "auto" : "none" },
      ]}
    >
      <Animated.View style={[styles.overlayCard, cardStyle]}>
        <View style={styles.doneHero}>
          <View style={styles.particleContainer}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Particle key={i} index={i} />
            ))}
          </View>
          <Animated.View
            style={[
              styles.doneCheckCircle,
              { backgroundColor: DS.palette.success.main },
              checkStyle,
            ]}
          >
            <Feather name="check" size={36} color="#FFFFFF" />
          </Animated.View>
        </View>

        <View style={{ gap: DS.spacing.md, paddingHorizontal: DS.spacing.xl }}>
          <Typography variant="h2" align="center">
            Je bent er klaar voor! 🎉
          </Typography>
          <Typography variant="body1" color="textSecondary" align="center">
            Je weet nu waar alles te vinden is. Veel plezier bij Careibu!
          </Typography>
        </View>

        <View
          style={{
            paddingHorizontal: DS.spacing.xl,
            paddingBottom: DS.spacing.xxxl,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="lg"
            fullWidth
            onPress={onFinish}
          >
            Aan de slag
          </Button>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard Intake Screen
// ─────────────────────────────────────────────────────────────────────────────

export default function DashboardIntakeScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { data } = useOnboarding();

  const intakeDateLabel = formatIntakeDate(data.intakeDate, data.intakeTime);

  const scrollRef = useRef<ScrollView>(null);
  const sectionOffsets = useRef<Record<number, number>>({});
  const [wizardStep, setWizardStep] = useState(-1);

  const topPad =
    Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const captureLayout = useCallback(
    (idx: number) => (e: LayoutChangeEvent) => {
      sectionOffsets.current[idx] = e.nativeEvent.layout.y;
    },
    []
  );

  const scrollToSection = useCallback((idx: number) => {
    const y = sectionOffsets.current[idx];
    if (y !== undefined) {
      const scrollY = idx === 3 ? Math.max(0, y - 8) : Math.max(0, y - 24);
      scrollRef.current?.scrollTo({ y: scrollY, animated: true });
    }
  }, []);

  const handleNext = useCallback(() => {
    if (wizardStep === 0) {
      setWizardStep(1);
      setTimeout(() => scrollToSection(1), 350);
    } else if (wizardStep >= 1 && wizardStep < 3) {
      const next = wizardStep + 1;
      setWizardStep(next);
      setTimeout(() => scrollToSection(next), 350);
    } else if (wizardStep === 3) {
      setWizardStep(4);
      setTimeout(() => scrollRef.current?.scrollTo({ y: 0, animated: true }), 100);
    }
  }, [wizardStep, scrollToSection]);

  const handleSkip = useCallback(() => {
    setWizardStep(-1);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  const handleFinish = useCallback(() => {
    setWizardStep(-1);
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuProgress = useSharedValue(0);
  const drawerX = useSharedValue(-280);

  const toggleMenu = useCallback(() => {
    const opening = !menuOpen;
    setMenuOpen(opening);
    menuProgress.value = withTiming(opening ? 1 : 0, { duration: 180 });
    drawerX.value = withTiming(opening ? 0 : -280, { duration: 200 });
  }, [menuOpen, menuProgress, drawerX]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuProgress.value = withTiming(0, { duration: 180 });
    drawerX.value = withTiming(-280, { duration: 200 });
  }, [menuProgress, drawerX]);

  const barsOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(menuProgress.value, [0, 0.4, 1], [1, 0, 0]),
  }));
  const xOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(menuProgress.value, [0.4, 1], [0, 1]),
  }));
  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: drawerX.value }],
  }));
  const overlayOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(menuProgress.value, [0, 1], [0, 0.45]),
  }));

  const bgDim = useSharedValue(0);
  useEffect(() => {
    bgDim.value = withTiming(
      wizardStep >= 1 && wizardStep <= 3 ? 1 : 0,
      { duration: 350 }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wizardStep]);

  const rootBgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      bgDim.value,
      [0, 1],
      ["#F2F3F5", "#1E3432"]
    ),
  }));

  return (
    <DashboardModeContext.Provider value={{ allTasksDone: false }}>
      <Animated.View style={[{ flex: 1 }, rootBgStyle]}>
        <View style={{ backgroundColor: "#8CBFBB", paddingTop: topPad }}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={toggleMenu}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.hamburgerBtn}
            >
              <Animated.View style={[StyleSheet.absoluteFill, styles.hamburgerBars, barsOpacity]}>
                <View style={styles.hamburgerBar} />
                <View style={styles.hamburgerBar} />
                <View style={styles.hamburgerBar} />
              </Animated.View>
              <Animated.View style={[StyleSheet.absoluteFill, styles.xIcon, xOpacity]}>
                <Feather name="x" size={20} color="#FFFFFF" />
              </Animated.View>
            </TouchableOpacity>

            <View style={{ flex: 1, marginLeft: DS.spacing.md }}>
              <Typography
                variant="overline"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                Goedemorgen
              </Typography>
              <Typography variant="h4" style={{ color: "#FFFFFF" }}>
                {data.firstName || "Vrijwilliger"}
              </Typography>
            </View>

            <View style={[styles.avatarCircle, { backgroundColor: "rgba(255,255,255,0.25)" }]}>
              <Typography variant="h4" style={{ color: "#FFFFFF" }}>
                {(data.firstName?.[0] ?? "V").toUpperCase()}
              </Typography>
            </View>
          </View>
        </View>

        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + DS.spacing.xxxxl },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <WizardSection
            sectionIndex={1}
            wizardStep={wizardStep}
            onLayout={captureLayout(1)}
          >
            <MatchingStatusCard intakeDateLabel={intakeDateLabel} />
          </WizardSection>

          <MatchCard />

          <WizardSection
            sectionIndex={2}
            wizardStep={wizardStep}
            onLayout={captureLayout(2)}
          >
            <DiaryCard />
          </WizardSection>

          <WizardSection
            sectionIndex={3}
            wizardStep={wizardStep}
            onLayout={captureLayout(3)}
          >
            <InfoModulesCard />
          </WizardSection>
        </ScrollView>

        <WizardBottomSheet
          wizardStep={wizardStep}
          onNext={handleNext}
          onSkip={handleSkip}
          insetBottom={insets.bottom}
        />

        <WizardWelcomeOverlay
          visible={wizardStep === 0}
          onStart={handleNext}
          onSkip={handleSkip}
          firstName={data.firstName}
        />

        <WizardDoneOverlay visible={wizardStep === 4} onFinish={handleFinish} />

        {menuOpen && (
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={closeMenu}
          >
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: "#000" },
                overlayOpacity,
              ]}
            />
          </TouchableOpacity>
        )}

        <Animated.View style={[styles.drawer, drawerStyle]}>
          <View style={styles.drawerHeader}>
            <View style={styles.drawerAvatar}>
              <Typography variant="h4" style={{ color: "#FFFFFF" }}>
                {(data.firstName?.[0] ?? "V").toUpperCase()}
              </Typography>
            </View>
            <View>
              <Typography variant="h5" style={{ color: "#FFFFFF" }}>
                {data.firstName || "Vrijwilliger"}
              </Typography>
              <Typography variant="caption" style={{ color: "rgba(255,255,255,0.7)" }}>
                Vrijwilliger
              </Typography>
            </View>
          </View>

          {[
            { icon: "home" as const,      label: "Dashboard" },
            { icon: "heart" as const,     label: "Matches" },
            { icon: "book-open" as const, label: "Logboeken" },
            { icon: "settings" as const,  label: "Instellingen" },
          ].map(({ icon, label }) => (
            <TouchableOpacity
              key={label}
              style={styles.drawerItem}
              onPress={closeMenu}
            >
              <View style={styles.drawerIconWrap}>
                <Feather name={icon} size={18} color="#8CBFBB" />
              </View>
              <Typography variant="body1" style={{ color: DS.palette.text.primary }}>
                {label}
              </Typography>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </Animated.View>
    </DashboardModeContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles — identical to dashboard.tsx
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: DS.spacing.lg,
    paddingVertical: DS.spacing.md,
    marginBottom: DS.spacing.xs,
  },
  hamburgerBtn: {
    width: 32,
    height: 32,
  },
  hamburgerBars: {
    justifyContent: "center",
    gap: 5,
    paddingVertical: 5,
  },
  hamburgerBar: {
    height: 2.5,
    width: 22,
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
  },
  xIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: 280,
    backgroundColor: "#FFFFFF",
    zIndex: 200,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 16,
  },
  drawerHeader: {
    backgroundColor: "#8CBFBB",
    paddingHorizontal: DS.spacing.xl,
    paddingTop: 64,
    paddingBottom: DS.spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.md,
  },
  drawerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.md,
    paddingHorizontal: DS.spacing.xl,
    paddingVertical: DS.spacing.md,
  },
  drawerIconWrap: {
    width: 36,
    height: 36,
    borderRadius: DS.shape.radius.md,
    backgroundColor: "#EAF5F3",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingVertical: DS.spacing.lg,
    paddingHorizontal: DS.spacing.sm,
    gap: DS.spacing.xl,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.md,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: DS.shape.radius.md,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.xs,
    paddingHorizontal: DS.spacing.sm,
    paddingVertical: DS.spacing.xs,
    borderRadius: DS.shape.radius.full,
  },
  pillDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.md,
    paddingVertical: DS.spacing.lg,
  },
  taskDivider: {
    height: 1,
    backgroundColor: DS.palette.border,
  },
  taskPill: {
    backgroundColor: "#3A9490",
    borderRadius: DS.shape.radius.full,
    paddingHorizontal: DS.spacing.md,
    paddingVertical: DS.spacing.sm,
    flexShrink: 0,
    minWidth: 88,
    alignItems: "center",
  },
  taskBtnRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.xs,
    flexShrink: 0,
  },
  doneCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: DS.palette.success.bg,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  pendingChip: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FFF0D9",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  viewSeniorsBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3A9490",
    borderRadius: DS.shape.radius.md,
    paddingVertical: DS.spacing.md,
    paddingHorizontal: DS.spacing.lg,
  },
  emptyState: {
    alignItems: "center",
    gap: DS.spacing.md,
    paddingVertical: DS.spacing.md,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  moduleCard: {
    width: 160,
    borderRadius: DS.shape.radius.lg,
    padding: DS.spacing.md,
    gap: DS.spacing.sm,
  },
  moduleIconBox: {
    width: 36,
    height: 36,
    borderRadius: DS.shape.radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  readTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.xxs,
    marginTop: DS.spacing.xs,
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: DS.shape.radius.xl,
    borderTopRightRadius: DS.shape.radius.xl,
    paddingTop: DS.spacing.md,
    paddingHorizontal: DS.spacing.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 20,
    zIndex: 100,
  },
  sheetHandle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: DS.palette.border,
    marginBottom: DS.spacing.lg,
  },
  wizardIconBadge: {
    width: 52,
    height: 52,
    borderRadius: DS.shape.radius.md,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  dotsRow: {
    flexDirection: "row",
    gap: DS.spacing.sm,
    justifyContent: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  overlayBg: {
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
    zIndex: 300,
  },
  overlayCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: DS.shape.radius.xl,
    borderTopRightRadius: DS.shape.radius.xl,
    paddingTop: DS.spacing.xxxl,
    gap: DS.spacing.xl,
    overflow: "hidden",
  },
  welcomeHero: {
    alignItems: "center",
    gap: DS.spacing.md,
    paddingHorizontal: DS.spacing.xl,
  },
  heroBubble: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#FAE0EC",
    alignItems: "center",
    justifyContent: "center",
  },
  heroDecoRow: {
    flexDirection: "row",
    gap: DS.spacing.sm,
  },
  heroDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  featurePillRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: DS.spacing.sm,
    flexWrap: "wrap",
    paddingHorizontal: DS.spacing.xl,
  },
  featurePill: {
    paddingHorizontal: DS.spacing.md,
    paddingVertical: DS.spacing.xs,
    borderRadius: DS.shape.radius.full,
  },
  doneHero: {
    alignItems: "center",
    justifyContent: "center",
    height: 140,
  },
  particleContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  doneCheckCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  highlightGlow: {
    borderRadius: DS.shape.radius.lg,
    backgroundColor: "rgba(140,191,187,0.18)",
    margin: -6,
  },
  highlightBorder: {
    borderRadius: DS.shape.radius.lg,
    borderWidth: 2,
    borderColor: "#8CBFBB",
    margin: -1,
  },
});
