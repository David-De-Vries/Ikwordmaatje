import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ProgressHeader } from "@/components/ProgressHeader";
import { Button, Card, TextField, Typography } from "@/components/ui";
import { DS } from "@/constants/design-system";
import { useOnboarding } from "@/context/OnboardingContext";
import { useColors } from "@/hooks/useColors";

const DAYS = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];
const DISTANCES = [2, 5, 10, 15, 20];

export default function Step5Screen() {
  const router = useRouter();
  const { edit } = useLocalSearchParams<{ edit?: string }>();
  const isEditMode = edit === "1";
  const colors = useColors();
  const { data, update } = useOnboarding();

  const updateSlot = (
    index: number,
    field: "day" | "startTime" | "endTime",
    value: string,
  ) => {
    const slots = [...data.availabilitySlots];
    slots[index] = { ...slots[index], [field]: value };
    update({ availabilitySlots: slots });
  };

  const addSlot = () => {
    update({
      availabilitySlots: [
        ...data.availabilitySlots,
        { day: "", startTime: "", endTime: "" },
      ],
    });
  };

  const removeSlot = (index: number) => {
    if (data.availabilitySlots.length <= 1) return;
    const slots = data.availabilitySlots.filter((_, i) => i !== index);
    update({ availabilitySlots: slots });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ProgressHeader step={5} totalSteps={10} sectionName="Beschikbaarheid" />

      <KeyboardAwareScrollViewCompat
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
      >
        <Card elevation={2} padding="md" style={styles.card}>
          <View style={styles.section}>
            <Typography variant="h3">Wanneer ben je beschikbaar?</Typography>
            <Typography variant="body2" color="textSecondary">
              Kies de dagdelen waarop jij beschikbaar bent om een senior te bezoeken.
            </Typography>

            {!data.availabilityUnknown && (
              <View style={styles.slots}>
                {data.availabilitySlots.map((slot, i) => (
                  <View key={i} style={styles.slotRow}>
                    <View style={styles.dayPicker}>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ gap: DS.spacing.xs }}
                      >
                        {DAYS.map((day) => (
                          <TouchableOpacity
                            key={day}
                            onPress={() => updateSlot(i, "day", slot.day === day ? "" : day)}
                            style={[
                              styles.dayChip,
                              {
                                borderColor:
                                  slot.day === day ? colors.secondary : DS.palette.border,
                                backgroundColor:
                                  slot.day === day ? colors.accent : "transparent",
                              },
                            ]}
                          >
                            <Typography
                              variant="caption"
                              style={{
                                color: slot.day === day ? colors.secondary : DS.palette.text.secondary,
                                fontFamily: DS.typography.fontFamily.medium,
                              }}
                            >
                              {day}
                            </Typography>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>

                    <View style={styles.timeRow}>
                      <TextField
                        placeholder="09:00"
                        value={slot.startTime}
                        onChangeText={(v) => updateSlot(i, "startTime", v)}
                        keyboardType="numbers-and-punctuation"
                        style={{ flex: 1 }}
                      />
                      <Typography variant="body2" color="textDisabled">
                        –
                      </Typography>
                      <TextField
                        placeholder="12:00"
                        value={slot.endTime}
                        onChangeText={(v) => updateSlot(i, "endTime", v)}
                        keyboardType="numbers-and-punctuation"
                        style={{ flex: 1 }}
                      />
                      {data.availabilitySlots.length > 1 && (
                        <TouchableOpacity
                          onPress={() => removeSlot(i)}
                          style={styles.removeBtn}
                        >
                          <Feather
                            name="x"
                            size={16}
                            color={DS.palette.text.disabled}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))}

                <TouchableOpacity
                  onPress={addSlot}
                  style={[styles.addBtn, { borderColor: colors.secondary }]}
                >
                  <Feather name="plus" size={16} color={colors.secondary} />
                  <Typography
                    variant="body2"
                    style={{ color: colors.secondary }}
                  >
                    Dag toevoegen
                  </Typography>
                </TouchableOpacity>
              </View>
            )}

            <View
              style={[
                styles.unknownRow,
                {
                  borderColor: data.availabilityUnknown
                    ? colors.secondary
                    : DS.palette.border,
                  backgroundColor: data.availabilityUnknown
                    ? colors.accent
                    : "#FFFFFF",
                },
              ]}
            >
              <View style={{ flex: 1, gap: 2 }}>
                <Typography variant="h6">Ik weet het nog niet</Typography>
                <Typography variant="caption" color="textSecondary">
                  Geen probleem, je kunt dit later invullen.
                </Typography>
              </View>
              <Switch
                value={data.availabilityUnknown}
                onValueChange={(v) => update({ availabilityUnknown: v })}
                trackColor={{ false: DS.palette.border, true: colors.secondary }}
                thumbColor={data.availabilityUnknown ? "#FFFFFF" : "#FFFFFF"}
              />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Typography variant="h5">Jouw locatie</Typography>
            <Typography variant="body2" color="textSecondary">
              We gebruiken dit om matches in de buurt te vinden.
            </Typography>

            <TextField
              label="Adres of postcode"
              placeholder="Bijv. Amsterdam of 1011 AB"
              value={data.address}
              onChangeText={(v) => update({ address: v })}
              rightIconName="map-pin"
            />

            <View>
              <Typography variant="caption" color="textSecondary" style={styles.selectorLabel}>
                Maximale reisafstand
              </Typography>
              <View style={styles.distanceRow}>
                {DISTANCES.map((km) => (
                  <TouchableOpacity
                    key={km}
                    onPress={() => update({ travelDistance: km })}
                    style={[
                      styles.distanceChip,
                      {
                        borderColor:
                          data.travelDistance === km
                            ? colors.secondary
                            : DS.palette.border,
                        backgroundColor:
                          data.travelDistance === km ? colors.accent : "transparent",
                      },
                    ]}
                  >
                    <Typography
                      variant="caption"
                      style={{
                        color:
                          data.travelDistance === km
                            ? colors.secondary
                            : DS.palette.text.secondary,
                        fontFamily: DS.typography.fontFamily.medium,
                      }}
                    >
                      {km} km
                    </Typography>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.mapPlaceholder}>
              <Feather name="map" size={32} color={DS.palette.text.disabled} />
              <Typography variant="caption" color="textDisabled" align="center">
                Kaartweergave beschikbaar{"\n"}nadat je een adres hebt ingevuld
              </Typography>
            </View>
          </View>

          {isEditMode ? (
            <Button
              variant="contained"
              color="primary"
              size="lg"
              fullWidth
              onPress={() => router.replace("/step8")}
            >
              Wijzigingen opslaan
            </Button>
          ) : (
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
                onPress={() => router.push("/step7")}
                style={styles.nextBtn}
              >
                Verder
              </Button>
            </View>
          )}
        </Card>

        <View style={{ height: DS.spacing.xl }} />
      </KeyboardAwareScrollViewCompat>
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
  section: {
    gap: DS.spacing.lg,
  },
  slots: {
    gap: DS.spacing.lg,
  },
  slotRow: {
    gap: DS.spacing.sm,
    borderWidth: 1,
    borderColor: DS.palette.border,
    borderRadius: DS.shape.radius.sm,
    padding: DS.spacing.md,
  },
  dayPicker: {
    height: 32,
  },
  dayChip: {
    borderWidth: 1,
    borderRadius: DS.shape.radius.full,
    paddingHorizontal: DS.spacing.md,
    paddingVertical: DS.spacing.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.sm,
  },
  removeBtn: {
    padding: DS.spacing.xs,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.sm,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: DS.shape.radius.sm,
    padding: DS.spacing.md,
    justifyContent: "center",
  },
  unknownRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.md,
    borderWidth: 1,
    borderRadius: DS.shape.radius.sm,
    padding: DS.spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: DS.palette.border,
  },
  selectorLabel: {
    marginBottom: DS.spacing.sm,
  },
  distanceRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: DS.spacing.sm,
  },
  distanceChip: {
    borderWidth: 1,
    borderRadius: DS.shape.radius.full,
    paddingHorizontal: DS.spacing.lg,
    paddingVertical: DS.spacing.sm,
  },
  mapPlaceholder: {
    height: 120,
    borderRadius: DS.shape.radius.sm,
    backgroundColor: DS.palette.background.input,
    alignItems: "center",
    justifyContent: "center",
    gap: DS.spacing.sm,
  },
  navRow: {
    flexDirection: "row",
    gap: DS.spacing.md,
  },
  backBtn: {
    flex: 1,
  },
  nextBtn: {
    flex: 2,
  },
});
