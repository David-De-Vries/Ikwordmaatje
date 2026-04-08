import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Switch, View } from "react-native";

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

          <View style={styles.divider} />

          <View style={styles.section}>
            <Typography variant="h5">Contactgegevens delen</Typography>
            <Typography variant="body2" color="textSecondary">
              Kies hoe de senior jou kan bereiken na jullie ontmoeting.
            </Typography>

            <View
              style={[
                styles.contactRow,
                {
                  borderColor: data.contactWhatsApp ? colors.secondary : DS.palette.border,
                  backgroundColor: data.contactWhatsApp ? colors.accent : "#FFFFFF",
                },
              ]}
            >
              <View style={styles.contactIcon}>
                <Feather name="message-circle" size={20} color={colors.secondary} />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Typography variant="h6">WhatsApp</Typography>
                <Typography variant="caption" color="textSecondary">
                  Deel je WhatsApp-nummer
                </Typography>
              </View>
              <Switch
                value={data.contactWhatsApp}
                onValueChange={(v) => update({ contactWhatsApp: v })}
                trackColor={{ false: DS.palette.border, true: colors.secondary }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View
              style={[
                styles.contactRow,
                {
                  borderColor: data.contactEmail ? colors.secondary : DS.palette.border,
                  backgroundColor: data.contactEmail ? colors.accent : "#FFFFFF",
                },
              ]}
            >
              <View style={styles.contactIcon}>
                <Feather name="mail" size={20} color={colors.secondary} />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Typography variant="h6">E-mail</Typography>
                <Typography variant="caption" color="textSecondary">
                  Deel je e-mailadres
                </Typography>
              </View>
              <Switch
                value={data.contactEmail}
                onValueChange={(v) => update({ contactEmail: v })}
                trackColor={{ false: DS.palette.border, true: colors.secondary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          <Banner
            variant="info"
            title="Privacy"
            message="Je contactgegevens worden alleen gedeeld met jouw geverifieerde match."
          />

          <Button
            variant="contained"
            color="primary"
            size="lg"
            fullWidth
            onPress={() => router.push("/step11")}
          >
            Contactgegevens opgeslagen - verder
          </Button>

          <Button
            variant="outlined"
            color="default"
            size="md"
            onPress={() => router.back()}
            startIconName="arrow-left"
            fullWidth
          >
            Terug
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
    gap: DS.spacing.lg,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.md,
    borderWidth: 1,
    borderRadius: DS.shape.radius.sm,
    padding: DS.spacing.md,
  },
  contactIcon: {
    width: 36,
    height: 36,
    borderRadius: DS.shape.radius.xs,
    backgroundColor: DS.palette.background.input,
    alignItems: "center",
    justifyContent: "center",
  },
});
