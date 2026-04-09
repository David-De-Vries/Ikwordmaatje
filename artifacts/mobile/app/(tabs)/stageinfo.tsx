import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Keyboard,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ProgressHeader } from "@/components/ProgressHeader";
import { Button, Card, TextField, Typography } from "@/components/ui";
import { DS } from "@/constants/design-system";
import { useOnboarding } from "@/context/OnboardingContext";
import { useColors } from "@/hooks/useColors";

const SCHOOLS = [
  "HvA – Hogeschool van Amsterdam",
  "VU – Vrije Universiteit Amsterdam",
  "UvA – Universiteit van Amsterdam",
  "Erasmus Universiteit Rotterdam",
  "TU Delft",
  "TU/e – Technische Universiteit Eindhoven",
  "Radboud Universiteit",
  "Universiteit Utrecht",
  "Rijksuniversiteit Groningen",
  "Tilburg University",
  "Maastricht University",
  "Universiteit Twente",
  "Hogeschool Rotterdam",
  "Fontys Hogescholen",
  "Windesheim",
  "Saxion Hogeschool",
  "Hanze Hogeschool",
  "NHL Stenden",
  "Avans Hogeschool",
  "Inholland",
];

const HOUR_PRESETS = [8, 16, 24, 32, 40];

const MONTH_NAMES_FULL = [
  "Januari", "Februari", "Maart", "April", "Mei", "Juni",
  "Juli", "Augustus", "September", "Oktober", "November", "December",
];

const MONTH_NAMES_SHORT = [
  "jan", "feb", "mrt", "apr", "mei", "jun",
  "jul", "aug", "sep", "okt", "nov", "dec",
];

const DAY_HEADERS = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstWeekdayOffset(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return (day + 6) % 7;
}

function formatDate(date: Date) {
  const d = date.getDate().toString().padStart(2, "0");
  const m = MONTH_NAMES_SHORT[date.getMonth()];
  const y = date.getFullYear();
  return `${d} ${m} ${y}`;
}

interface CalendarModalProps {
  visible: boolean;
  value: Date | null;
  minDate?: Date;
  onConfirm: (date: Date) => void;
  onDismiss: () => void;
}

function CalendarModal({ visible, value, minDate, onConfirm, onDismiss }: CalendarModalProps) {
  const colors = useColors();
  const today = new Date();
  const init = value ?? new Date(2026, 8, 1);

  const [viewYear, setViewYear] = useState(init.getFullYear());
  const [viewMonth, setViewMonth] = useState(init.getMonth());
  const [selected, setSelected] = useState<Date | null>(value);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const offset = getFirstWeekdayOffset(viewYear, viewMonth);

  const cells: (number | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const isSameDay = (d: Date, day: number) =>
    d.getFullYear() === viewYear && d.getMonth() === viewMonth && d.getDate() === day;

  const isDisabled = (day: number) => {
    if (!minDate) return false;
    const d = new Date(viewYear, viewMonth, day);
    return d < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
  };

  const handleConfirm = () => {
    if (selected) onConfirm(selected);
    else onDismiss();
  };

  const handleReset = () => {
    setSelected(null);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onDismiss}>
      <TouchableOpacity style={cal.overlay} activeOpacity={1} onPress={onDismiss}>
        <TouchableOpacity style={cal.container} activeOpacity={1} onPress={() => {}}>
          <View style={cal.handle} />

          <View style={cal.header}>
            <TouchableOpacity onPress={prevMonth} style={cal.arrow}>
              <Feather name="chevron-left" size={20} color={DS.palette.text.primary} />
            </TouchableOpacity>
            <Typography variant="h5" style={cal.monthTitle}>
              {MONTH_NAMES_FULL[viewMonth]} {viewYear}
            </Typography>
            <TouchableOpacity onPress={nextMonth} style={cal.arrow}>
              <Feather name="chevron-right" size={20} color={DS.palette.text.primary} />
            </TouchableOpacity>
          </View>

          <View style={cal.dayHeaders}>
            {DAY_HEADERS.map(d => (
              <View key={d} style={cal.dayHeaderCell}>
                <Typography variant="caption" color="textSecondary" style={{ fontFamily: "Inter_600SemiBold" }}>
                  {d}
                </Typography>
              </View>
            ))}
          </View>

          <View style={cal.grid}>
            {cells.map((day, idx) => {
              if (!day) return <View key={`e-${idx}`} style={cal.cell} />;
              const sel = selected && isSameDay(selected, day);
              const disabled = isDisabled(day);
              return (
                <TouchableOpacity
                  key={`d-${idx}`}
                  style={cal.cell}
                  onPress={() => !disabled && setSelected(new Date(viewYear, viewMonth, day))}
                  disabled={disabled}
                >
                  <View style={[cal.dayBubble, sel && { backgroundColor: colors.secondary }]}>
                    <Typography
                      variant="body2"
                      style={{
                        color: sel ? "#FFFFFF" : disabled ? DS.palette.text.disabled : DS.palette.text.primary,
                        fontFamily: sel ? "Inter_600SemiBold" : "Inter_400Regular",
                      }}
                    >
                      {day}
                    </Typography>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {selected && (
            <Typography variant="caption" color="textSecondary" style={cal.selectedInfo}>
              Geselecteerd: {formatDate(selected)}
            </Typography>
          )}

          <TouchableOpacity
            onPress={handleConfirm}
            style={[cal.doneBtn, { backgroundColor: colors.secondary }]}
          >
            <Typography variant="h6" style={{ color: "#FFFFFF" }}>
              Bevestigen
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleReset} style={cal.resetBtn}>
            <Typography variant="body2" style={{ color: colors.secondary }}>
              Wissen
            </Typography>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const cal = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: DS.spacing.lg,
    paddingBottom: DS.spacing.xl + 8,
    paddingTop: DS.spacing.md,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: DS.palette.border,
    alignSelf: "center",
    marginBottom: DS.spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: DS.spacing.md,
  },
  arrow: {
    padding: DS.spacing.sm,
  },
  monthTitle: {
    flex: 1,
    textAlign: "center",
  },
  dayHeaders: {
    flexDirection: "row",
    marginBottom: DS.spacing.xs,
  },
  dayHeaderCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 4,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dayBubble: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedInfo: {
    textAlign: "center",
    marginTop: DS.spacing.sm,
    marginBottom: DS.spacing.md,
  },
  doneBtn: {
    borderRadius: 100,
    paddingVertical: DS.spacing.md,
    alignItems: "center",
    marginTop: DS.spacing.md,
  },
  resetBtn: {
    alignItems: "center",
    paddingVertical: DS.spacing.sm,
    marginTop: DS.spacing.xs,
  },
});

export default function StageInfoScreen() {
  const router = useRouter();
  const colors = useColors();
  const { data, update } = useOnboarding();

  const parseDate = (s: string): Date | null => {
    if (!s) return null;
    const parts = s.split("-");
    if (parts.length === 2) {
      const mIdx = MONTH_NAMES_SHORT.indexOf(parts[0].toLowerCase());
      const y = parseInt(parts[1]);
      if (mIdx >= 0 && !isNaN(y)) return new Date(y, mIdx, 1);
    }
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  };

  const [course, setCourse] = useState(data.internshipCourse);
  const [schoolQuery, setSchoolQuery] = useState(data.internshipSchool);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(parseDate(data.internshipStart));
  const [endDate, setEndDate] = useState<Date | null>(parseDate(data.internshipEnd));
  const [calTarget, setCalTarget] = useState<"start" | "end" | null>(null);
  const [hours, setHours] = useState(
    data.internshipHoursPerWeek ? String(data.internshipHoursPerWeek) : ""
  );

  const suggestions = SCHOOLS.filter(
    (s) => schoolQuery.length > 0 && s.toLowerCase().includes(schoolQuery.toLowerCase())
  ).slice(0, 5);

  const handleNext = () => {
    const fmtDate = (d: Date | null) =>
      d ? `${MONTH_NAMES_SHORT[d.getMonth()]}-${d.getFullYear()}` : "";
    update({
      internshipCourse: course,
      internshipSchool: schoolQuery,
      internshipStart: fmtDate(startDate),
      internshipEnd: fmtDate(endDate),
      internshipHoursPerWeek: parseInt(hours) || 0,
    });
    router.push("/step2");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ProgressHeader step={2} totalSteps={11} sectionName="Stage" />

      <KeyboardAwareScrollViewCompat
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Card elevation={2} padding="lg" style={styles.card}>
          <View style={styles.header}>
            <View style={styles.iconRow}>
              <View style={[styles.icon, { backgroundColor: "#FFF0F5", borderColor: colors.secondary }]}>
                <Typography style={{ fontSize: 20 }}>🎓</Typography>
              </View>
              <View style={{ flex: 1 }}>
                <Typography variant="h3">Jouw stage bij Careibu</Typography>
                <Typography variant="body2" color="textSecondary">
                  Vertel ons iets over je stageplek.
                </Typography>
              </View>
            </View>
          </View>

          <View style={styles.fields}>
            <TextField
              label="Welke opleiding volg je?"
              placeholder="Bijv. Social Work, Verpleegkunde, Psychologie…"
              value={course}
              onChangeText={setCourse}
              returnKeyType="next"
            />

            <View>
              <Typography variant="caption" color="textSecondary" style={styles.fieldLabel}>
                Aan welke school?
              </Typography>
              <View style={styles.schoolInputWrap}>
                <TextInput
                  value={schoolQuery}
                  onChangeText={(v) => {
                    setSchoolQuery(v);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  placeholder="Zoek op naam, bijv. HvA, VU…"
                  placeholderTextColor={DS.palette.text.disabled}
                  style={[
                    styles.schoolInput,
                    { borderColor: DS.palette.border, color: DS.palette.text.primary },
                  ]}
                />
                {showSuggestions && suggestions.length > 0 && (
                  <View style={[styles.suggestions, { borderColor: DS.palette.border }]}>
                    {suggestions.map((s) => (
                      <TouchableOpacity
                        key={s}
                        onPress={() => {
                          setSchoolQuery(s);
                          setShowSuggestions(false);
                          Keyboard.dismiss();
                        }}
                        style={styles.suggestionItem}
                      >
                        <Typography variant="body2">{s}</Typography>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>

            <View>
              <Typography variant="caption" color="textSecondary" style={styles.fieldLabel}>
                Gewenste stageperiode
              </Typography>
              <View style={styles.periodRow}>
                <TouchableOpacity
                  style={[
                    styles.dateTrigger,
                    {
                      borderColor: startDate ? colors.secondary : DS.palette.border,
                      backgroundColor: "#FFFFFF",
                    },
                  ]}
                  onPress={() => setCalTarget("start")}
                >
                  <Feather name="calendar" size={14} color={startDate ? colors.secondary : DS.palette.text.disabled} />
                  <Typography
                    variant="caption"
                    style={{
                      color: startDate ? colors.secondary : DS.palette.text.disabled,
                      fontFamily: startDate ? "Inter_600SemiBold" : "Inter_400Regular",
                    }}
                  >
                    {startDate ? formatDate(startDate) : "Van"}
                  </Typography>
                </TouchableOpacity>

                <View style={styles.periodArrow}>
                  <Feather name="arrow-right" size={14} color={DS.palette.text.disabled} />
                </View>

                <TouchableOpacity
                  style={[
                    styles.dateTrigger,
                    {
                      borderColor: endDate ? colors.secondary : DS.palette.border,
                      backgroundColor: "#FFFFFF",
                    },
                  ]}
                  onPress={() => setCalTarget("end")}
                >
                  <Feather name="calendar" size={14} color={endDate ? colors.secondary : DS.palette.text.disabled} />
                  <Typography
                    variant="caption"
                    style={{
                      color: endDate ? colors.secondary : DS.palette.text.disabled,
                      fontFamily: endDate ? "Inter_600SemiBold" : "Inter_400Regular",
                    }}
                  >
                    {endDate ? formatDate(endDate) : "Tot"}
                  </Typography>
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Typography variant="caption" color="textSecondary" style={styles.fieldLabel}>
                Aantal uren per week
              </Typography>
              <View style={styles.hoursRow}>
                <TextInput
                  value={hours}
                  onChangeText={setHours}
                  keyboardType="number-pad"
                  placeholder="Bijv. 24"
                  placeholderTextColor={DS.palette.text.disabled}
                  style={[
                    styles.hoursInput,
                    { borderColor: DS.palette.border, color: DS.palette.text.primary },
                  ]}
                />
                <Typography variant="body2" color="textSecondary"> uur / week</Typography>
              </View>
              <View style={[styles.chipRow, { marginTop: DS.spacing.sm }]}>
                {HOUR_PRESETS.map((h) => (
                  <TouchableOpacity
                    key={h}
                    onPress={() => setHours(String(h))}
                    style={[
                      styles.chip,
                      {
                        borderColor: hours === String(h) ? colors.secondary : DS.palette.border,
                        backgroundColor: hours === String(h) ? "#FFF0F5" : "transparent",
                      },
                    ]}
                  >
                    <Typography
                      variant="caption"
                      style={{
                        color: hours === String(h) ? colors.secondary : DS.palette.text.secondary,
                        fontFamily: "Inter_500Medium",
                      }}
                    >
                      {h} uur
                    </Typography>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={[styles.infoBox, { backgroundColor: "#FFFFFF", borderColor: "#F5C6D6" }]}>
            <Typography variant="caption" style={{ color: colors.secondary }}>
              ✨ Jouw stagegegevens worden doorgestuurd naar ons stagebegeleiders-team. Je hoort snel van ons!
            </Typography>
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
              onPress={handleNext}
              style={styles.nextBtn}
            >
              Verder
            </Button>
          </View>
        </Card>

        <View style={{ height: DS.spacing.xl }} />
      </KeyboardAwareScrollViewCompat>

      <CalendarModal
        visible={calTarget === "start"}
        value={startDate}
        onConfirm={(d) => { setStartDate(d); setCalTarget(null); }}
        onDismiss={() => setCalTarget(null)}
      />
      <CalendarModal
        visible={calTarget === "end"}
        value={endDate}
        minDate={startDate ?? undefined}
        onConfirm={(d) => { setEndDate(d); setCalTarget(null); }}
        onDismiss={() => setCalTarget(null)}
      />
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
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.md,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  fields: {
    gap: DS.spacing.lg,
  },
  fieldLabel: {
    marginBottom: DS.spacing.sm,
  },
  schoolInputWrap: {
    position: "relative",
  },
  schoolInput: {
    borderWidth: 1,
    borderRadius: DS.shape.radius.md,
    paddingHorizontal: DS.spacing.md,
    paddingVertical: DS.spacing.sm + 2,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  suggestions: {
    borderWidth: 1,
    borderRadius: DS.shape.radius.md,
    backgroundColor: "#FFFFFF",
    marginTop: 4,
    overflow: "hidden",
    zIndex: 100,
  },
  suggestionItem: {
    paddingHorizontal: DS.spacing.md,
    paddingVertical: DS.spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  periodRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.sm,
  },
  dateTrigger: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.xs,
    borderWidth: 1,
    borderRadius: DS.shape.radius.md,
    paddingHorizontal: DS.spacing.md,
    paddingVertical: DS.spacing.sm + 4,
  },
  periodArrow: {
    paddingHorizontal: 2,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: DS.spacing.xs,
  },
  chip: {
    borderWidth: 1,
    borderRadius: DS.shape.radius.full,
    paddingHorizontal: DS.spacing.sm + 2,
    paddingVertical: DS.spacing.xs,
  },
  hoursRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.sm,
  },
  hoursInput: {
    borderWidth: 1,
    borderRadius: DS.shape.radius.md,
    paddingHorizontal: DS.spacing.md,
    paddingVertical: DS.spacing.sm + 2,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    width: 80,
    textAlign: "center",
  },
  infoBox: {
    borderWidth: 1,
    borderRadius: DS.shape.radius.lg,
    padding: DS.spacing.md,
  },
  navRow: {
    flexDirection: "row",
    gap: DS.spacing.md,
    marginTop: DS.spacing.xs,
  },
  backBtn: {
    flex: 1,
  },
  nextBtn: {
    flex: 2,
  },
});
