import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ProgressHeader } from "@/components/ProgressHeader";
import { Banner, Button, Card, Typography } from "@/components/ui";
import { DS } from "@/constants/design-system";
import { useOnboarding } from "@/context/OnboardingContext";
import { useColors } from "@/hooks/useColors";

const DUTCH_MONTHS = [
  "Januari", "Februari", "Maart", "April", "Mei", "Juni",
  "Juli", "Augustus", "September", "Oktober", "November", "December",
];
const DUTCH_DAYS_SHORT = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];
const DUTCH_DAYS_LONG = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"];
const TIME_SLOTS = ["09:00", "10:30", "13:00", "14:30", "16:00"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

function formatDateDutch(date: Date) {
  const dow = date.getDay() === 0 ? 6 : date.getDay() - 1;
  return `${DUTCH_DAYS_LONG[dow]} ${date.getDate()} ${DUTCH_MONTHS[date.getMonth()].toLowerCase()}`;
}

function toIsoDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function MockCalendar({
  onConfirm,
}: {
  onConfirm: (date: Date, time: string) => void;
}) {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDow = getFirstDayOfWeek(year, month);

  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const isPast = (day: number) => {
    const d = new Date(year, month, day);
    d.setHours(0, 0, 0, 0);
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return d < t;
  };

  const isSelected = (day: number) =>
    selectedDate !== null &&
    selectedDate.getDate() === day &&
    selectedDate.getMonth() === month &&
    selectedDate.getFullYear() === year;

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const selectDay = (day: number) => {
    if (isPast(day)) return;
    setSelectedDate(new Date(year, month, day));
    setSelectedTime(null);
  };

  const rows: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }
  while (rows[rows.length - 1]?.length < 7) {
    rows[rows.length - 1].push(null);
  }

  return (
    <View style={calStyles.root}>
      {/* Month header */}
      <View style={calStyles.header}>
        <TouchableOpacity onPress={prevMonth} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Feather name="chevron-left" size={20} color={DS.palette.text.primary} />
        </TouchableOpacity>
        <Typography variant="h6" style={{ flex: 1, textAlign: "center" }}>
          {DUTCH_MONTHS[month]} {year}
        </Typography>
        <TouchableOpacity onPress={nextMonth} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Feather name="chevron-right" size={20} color={DS.palette.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Weekday labels */}
      <View style={calStyles.weekRow}>
        {DUTCH_DAYS_SHORT.map((d) => (
          <View key={d} style={calStyles.weekCell}>
            <Typography variant="caption" color="textSecondary" style={{ textAlign: "center" }}>
              {d}
            </Typography>
          </View>
        ))}
      </View>

      {/* Day grid */}
      {rows.map((row, ri) => (
        <View key={ri} style={calStyles.weekRow}>
          {row.map((day, di) => {
            if (!day) return <View key={di} style={calStyles.dayCell} />;
            const past = isPast(day);
            const selected = isSelected(day);
            const todayDay = isToday(day);
            return (
              <TouchableOpacity
                key={di}
                style={calStyles.dayCell}
                onPress={() => selectDay(day)}
                activeOpacity={past ? 1 : 0.7}
                disabled={past}
              >
                <View
                  style={[
                    calStyles.dayInner,
                    selected && calStyles.daySelected,
                    !selected && todayDay && calStyles.dayToday,
                    past && { opacity: 0.3 },
                  ]}
                >
                  <Typography
                    variant="body2"
                    style={[
                      { textAlign: "center", fontSize: 13 },
                      selected && { color: "#FFFFFF", fontFamily: DS.typography.fontFamily.semiBold },
                    ]}
                  >
                    {day}
                  </Typography>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}

      {/* Time slots */}
      {selectedDate && (
        <View style={calStyles.timesSection}>
          <View style={calStyles.timesDivider} />
          <Typography variant="caption" color="textSecondary" style={{ marginBottom: DS.spacing.sm }}>
            Beschikbare tijden op {formatDateDutch(selectedDate)}
          </Typography>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={calStyles.timesRow}>
            {TIME_SLOTS.map((t) => {
              const active = selectedTime === t;
              return (
                <TouchableOpacity
                  key={t}
                  onPress={() => setSelectedTime(t)}
                  style={[
                    calStyles.timeChip,
                    active && calStyles.timeChipActive,
                  ]}
                  activeOpacity={0.75}
                >
                  <Typography
                    variant="caption"
                    style={{
                      color: active ? "#FFFFFF" : DS.palette.text.secondary,
                      fontFamily: DS.typography.fontFamily.medium,
                    }}
                  >
                    {t}
                  </Typography>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Confirm button */}
      {selectedDate && selectedTime && (
        <View style={{ marginTop: DS.spacing.md }}>
          <Button
            variant="contained"
            color="primary"
            size="lg"
            fullWidth
            onPress={() => onConfirm(selectedDate, selectedTime)}
          >
            {`Bevestig afspraak — ${formatDateDutch(selectedDate)} om ${selectedTime}`}
          </Button>
        </View>
      )}
    </View>
  );
}

export default function Step10Screen() {
  const router = useRouter();
  const colors = useColors();
  const { data, update } = useOnboarding();

  const phone = data.phoneNumber?.trim() || null;
  const email = data.email?.trim() || null;

  const handleConfirm = (date: Date, time: string) => {
    update({ intakeDate: toIsoDate(date), intakeTime: time });
    router.push("/dashboard-intake");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ProgressHeader step={9} totalSteps={10} sectionName="Inplannen" />

      <KeyboardAwareScrollViewCompat
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
      >
        <Card elevation={2} padding="md" style={styles.card}>
          <View style={styles.header}>
            <Typography variant="h3">Plan een eerste ontmoeting</Typography>
            <Typography variant="body2" color="textSecondary">
              Gebruik de kalender om een eerste bezoek in te plannen met jouw match.
            </Typography>
          </View>

          <MockCalendar onConfirm={handleConfirm} />

          {/* "of" separator */}
          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Typography variant="caption" color="textSecondary" style={{ paddingHorizontal: DS.spacing.sm }}>
              of
            </Typography>
            <View style={styles.orLine} />
          </View>

          {/* Schedule later checkbox */}
          <TouchableOpacity
            style={[
              styles.checkboxRow,
              data.scheduleIntakeLater && styles.checkboxRowActive,
            ]}
            onPress={() => update({ scheduleIntakeLater: !data.scheduleIntakeLater })}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.checkbox,
                data.scheduleIntakeLater && styles.checkboxChecked,
              ]}
            >
              {data.scheduleIntakeLater && (
                <Feather name="check" size={13} color="#FFFFFF" />
              )}
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Typography variant="subtitle2">
                Plan later een intake gesprek in
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Careibu stuurt je een Calendly-link om een afspraak in te plannen.
              </Typography>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.section}>
            <View style={styles.sectionHead}>
              <Typography variant="h5">Zo nemen we contact met je op</Typography>
              <Typography variant="body2" color="textSecondary">
                We gebruiken de contactgegevens die je eerder hebt ingevuld om je op de hoogte te houden van je koppeling.
              </Typography>
            </View>

            <View style={styles.contactRow}>
              <View style={[styles.contactIcon, { backgroundColor: "#E0F2E1" }]}>
                <Feather name="phone" size={18} color="#2E7D32" />
              </View>
              <View style={{ flex: 1 }}>
                <Typography variant="caption" color="textSecondary">
                  Telefoonnummer
                </Typography>
                <Typography variant="h6" style={{ marginTop: 2 }}>
                  {phone ?? "Niet opgegeven"}
                </Typography>
              </View>
              {phone && (
                <View style={[styles.badge, { backgroundColor: "#E0F2E1" }]}>
                  <Feather name="check" size={12} color="#2E7D32" />
                  <Typography variant="caption" style={{ color: "#2E7D32" }}>
                    Bevestigd
                  </Typography>
                </View>
              )}
            </View>

            <View style={styles.contactRow}>
              <View style={[styles.contactIcon, { backgroundColor: DS.iconBadge.navy.bg }]}>
                <Feather name="mail" size={18} color={DS.iconBadge.navy.icon} />
              </View>
              <View style={{ flex: 1 }}>
                <Typography variant="caption" color="textSecondary">
                  E-mailadres
                </Typography>
                <Typography variant="h6" style={{ marginTop: 2 }}>
                  {email ?? "Niet opgegeven"}
                </Typography>
              </View>
              {email && (
                <View style={[styles.badge, { backgroundColor: DS.iconBadge.navy.bg }]}>
                  <Feather name="check" size={12} color={DS.iconBadge.navy.icon} />
                  <Typography variant="caption" style={{ color: DS.iconBadge.navy.icon }}>
                    Bevestigd
                  </Typography>
                </View>
              )}
            </View>
          </View>

          <Banner
            variant="info"
            title="Privacy"
            message="Je contactgegevens worden alleen gebruikt door Careibu en nooit gedeeld zonder jouw toestemming."
          />

          <Button
            variant="contained"
            color="primary"
            size="lg"
            fullWidth
            onPress={() => router.push("/dashboard")}
          >
            Naar mijn Dashboard
          </Button>
        </Card>

        <View style={{ height: DS.spacing.xl }} />
      </KeyboardAwareScrollViewCompat>
    </View>
  );
}

const calStyles = StyleSheet.create({
  root: {
    borderWidth: 1,
    borderColor: DS.palette.border,
    borderRadius: DS.shape.radius.md,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: DS.spacing.md,
    paddingVertical: DS.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: DS.palette.border,
    gap: DS.spacing.sm,
  },
  weekRow: {
    flexDirection: "row",
  },
  weekCell: {
    flex: 1,
    paddingVertical: DS.spacing.sm,
    alignItems: "center",
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 2,
  },
  dayInner: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  daySelected: {
    backgroundColor: DS.palette.primary.main,
  },
  dayToday: {
    borderWidth: 1.5,
    borderColor: "#3A9490",
  },
  timesSection: {
    paddingHorizontal: DS.spacing.md,
    paddingBottom: DS.spacing.md,
    gap: DS.spacing.xs,
  },
  timesDivider: {
    height: 1,
    backgroundColor: DS.palette.border,
    marginBottom: DS.spacing.sm,
  },
  timesRow: {
    gap: DS.spacing.sm,
    paddingRight: DS.spacing.sm,
  },
  timeChip: {
    borderWidth: 1,
    borderColor: DS.palette.border,
    borderRadius: DS.shape.radius.full,
    paddingHorizontal: DS.spacing.lg,
    paddingVertical: DS.spacing.sm,
  },
  timeChipActive: {
    backgroundColor: DS.palette.primary.main,
    borderColor: DS.palette.primary.main,
  },
});

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
  divider: {
    height: 1,
    backgroundColor: DS.palette.border,
  },
  section: {
    gap: DS.spacing.md,
  },
  sectionHead: {
    gap: DS.spacing.xs,
    marginBottom: DS.spacing.xs,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.md,
    borderWidth: 1,
    borderColor: DS.palette.border,
    borderRadius: DS.shape.radius.sm,
    padding: DS.spacing.md,
    backgroundColor: "#FFFFFF",
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: DS.shape.radius.xs,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: DS.spacing.sm,
    paddingVertical: DS.spacing.xxs,
    borderRadius: DS.shape.radius.full,
  },
  orRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: DS.palette.border,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.md,
    borderWidth: 1.5,
    borderColor: DS.palette.border,
    borderRadius: DS.shape.radius.md,
    padding: DS.spacing.md,
    backgroundColor: "#FFFFFF",
  },
  checkboxRowActive: {
    borderColor: "#3A9490",
    backgroundColor: "#F0F9F8",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#B0C4C3",
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
