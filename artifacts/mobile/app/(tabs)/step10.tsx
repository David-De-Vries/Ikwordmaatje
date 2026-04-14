import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ProgressHeader } from "@/components/ProgressHeader";
import { Banner, Button, Card, Typography } from "@/components/ui";
import { DS } from "@/constants/design-system";
import { useOnboarding } from "@/context/OnboardingContext";
import { useColors } from "@/hooks/useColors";

export default function Step10Screen() {
  const router = useRouter();
  const colors = useColors();
  const { data, update } = useOnboarding();

  const phone = data.phoneNumber?.trim() || null;
  const email = data.email?.trim() || null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ProgressHeader step={9} totalSteps={10} sectionName="Inplannen" />

      <KeyboardAwareScrollViewCompat
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
      >
        <Card elevation={2} padding="lg" style={styles.card}>
          <View style={styles.header}>
            <Typography variant="h3">Plan een eerste ontmoeting</Typography>
            <Typography variant="body2" color="textSecondary">
              Gebruik de kalender om een eerste bezoek in te plannen met jouw match.
            </Typography>
          </View>

          <View style={styles.calendarPlaceholder}>
            <Feather name="calendar" size={40} color={DS.palette.text.disabled} />
            <Typography variant="h6" color="textDisabled" align="center">
              Calendly-integratie
            </Typography>
            <Typography variant="caption" color="textDisabled" align="center">
              Selecteer een datum en tijd die voor beide partijen werkt.
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              size="md"
              onPress={() => {}}
              startIconName="external-link"
            >
              Open kalender
            </Button>
          </View>

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
  calendarPlaceholder: {
    height: 200,
    borderRadius: DS.shape.radius.md,
    backgroundColor: DS.palette.background.input,
    borderWidth: 1,
    borderColor: DS.palette.border,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: DS.spacing.sm,
    padding: DS.spacing.lg,
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
