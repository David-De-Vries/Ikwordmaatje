import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Keyboard,
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

const MONTHS = [
  "Jan", "Feb", "Mrt", "Apr", "Mei", "Jun",
  "Jul", "Aug", "Sep", "Okt", "Nov", "Dec",
];

const YEARS = ["2026", "2027"];

const HOUR_PRESETS = [8, 16, 24, 32, 40];

export default function StageInfoScreen() {
  const router = useRouter();
  const colors = useColors();
  const { data, update } = useOnboarding();

  const [course, setCourse] = useState(data.internshipCourse);
  const [schoolQuery, setSchoolQuery] = useState(data.internshipSchool);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [startMonth, setStartMonth] = useState(data.internshipStart.split("-")[0] || "");
  const [startYear, setStartYear] = useState(data.internshipStart.split("-")[1] || "");
  const [endMonth, setEndMonth] = useState(data.internshipEnd.split("-")[0] || "");
  const [endYear, setEndYear] = useState(data.internshipEnd.split("-")[1] || "");
  const [hours, setHours] = useState(
    data.internshipHoursPerWeek ? String(data.internshipHoursPerWeek) : ""
  );

  const suggestions = SCHOOLS.filter(
    (s) =>
      schoolQuery.length > 0 &&
      s.toLowerCase().includes(schoolQuery.toLowerCase())
  ).slice(0, 5);

  const handleNext = () => {
    update({
      internshipCourse: course,
      internshipSchool: schoolQuery,
      internshipStart: startMonth && startYear ? `${startMonth}-${startYear}` : "",
      internshipEnd: endMonth && endYear ? `${endMonth}-${endYear}` : "",
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
                <View style={styles.periodCol}>
                  <Typography variant="caption" color="textSecondary" style={{ marginBottom: 4 }}>Van</Typography>
                  <View style={styles.chipRow}>
                    {MONTHS.map((m) => (
                      <PeriodChip
                        key={`start-${m}`}
                        label={m}
                        selected={startMonth === m}
                        onPress={() => setStartMonth(startMonth === m ? "" : m)}
                        colors={colors}
                      />
                    ))}
                  </View>
                  <View style={[styles.chipRow, { marginTop: DS.spacing.xs }]}>
                    {YEARS.map((y) => (
                      <PeriodChip
                        key={`start-${y}`}
                        label={y}
                        selected={startYear === y}
                        onPress={() => setStartYear(startYear === y ? "" : y)}
                        colors={colors}
                      />
                    ))}
                  </View>
                </View>
                <View style={styles.periodDivider} />
                <View style={styles.periodCol}>
                  <Typography variant="caption" color="textSecondary" style={{ marginBottom: 4 }}>Tot</Typography>
                  <View style={styles.chipRow}>
                    {MONTHS.map((m) => (
                      <PeriodChip
                        key={`end-${m}`}
                        label={m}
                        selected={endMonth === m}
                        onPress={() => setEndMonth(endMonth === m ? "" : m)}
                        colors={colors}
                      />
                    ))}
                  </View>
                  <View style={[styles.chipRow, { marginTop: DS.spacing.xs }]}>
                    {YEARS.map((y) => (
                      <PeriodChip
                        key={`end-${y}`}
                        label={y}
                        selected={endYear === y}
                        onPress={() => setEndYear(endYear === y ? "" : y)}
                        colors={colors}
                      />
                    ))}
                  </View>
                </View>
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
                  <PeriodChip
                    key={h}
                    label={`${h} uur`}
                    selected={hours === String(h)}
                    onPress={() => setHours(String(h))}
                    colors={colors}
                  />
                ))}
              </View>
            </View>
          </View>

          <View style={[styles.infoBox, { backgroundColor: "#FFF5F8", borderColor: "#F5C6D6" }]}>
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
    </View>
  );
}

function PeriodChip({
  label,
  selected,
  onPress,
  colors,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        {
          borderColor: selected ? colors.secondary : DS.palette.border,
          backgroundColor: selected ? colors.accent : "transparent",
        },
      ]}
    >
      <Typography
        variant="caption"
        style={{
          color: selected ? colors.secondary : DS.palette.text.secondary,
          fontFamily: DS.typography.fontFamily.medium,
        }}
      >
        {label}
      </Typography>
    </TouchableOpacity>
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
    fontFamily: DS.typography.body2.fontFamily,
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
    gap: DS.spacing.md,
  },
  periodCol: {
    flex: 1,
  },
  periodDivider: {
    width: 1,
    backgroundColor: DS.palette.border,
    marginVertical: DS.spacing.xs,
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
    fontFamily: DS.typography.body2.fontFamily,
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
