import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import { ProgressHeader } from "@/components/ProgressHeader";
import { Banner, Button, Card, Chip, IconBadge, Typography } from "@/components/ui";
import { DS } from "@/constants/design-system";
import { useOnboarding } from "@/context/OnboardingContext";
import { useColors } from "@/hooks/useColors";

const PROJECT_NAMES: Record<string, string> = {
  maatje: "Maatje",
  huisvriend: "Huisvriend",
  taalmaatje: "Taalmaatje",
  studie: "Studie",
  computer: "Digitaal",
  tuinieren: "Tuinieren",
  sport: "Sport",
  vrij: "Vrij project",
};

const ACTIVITY_NAMES: Record<string, string> = {
  buiten: "Wandelen en buiten",
  kletsen: "Gezellig kletsen",
  muziek: "Muziek en cultuur",
  lezen: "Lezen of verhalen",
  sport: "Sport en bewegen",
  eten: "Samen eten",
  digitaal: "Digitale hulp",
  creatief: "Creatief bezig",
};

const DEMENTIA_LABELS: Record<string, string> = {
  geen: "Geen ervaring",
  beetje: "Beetje ervaring",
  veel: "Veel ervaring",
};

export default function Step8Screen() {
  const router = useRouter();
  const colors = useColors();
  const { data } = useOnboarding();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ProgressHeader step={7} totalSteps={10} sectionName="Samenvatting" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
      >
        <Card elevation={2} padding="lg" style={styles.card}>
          <View style={styles.header}>
            <Typography variant="h3">Jouw profiel</Typography>
            <Typography variant="body2" color="textSecondary">
              Controleer je gegevens en sla je profiel op.
            </Typography>
          </View>

          <SummarySection
            iconName="user"
            color="teal"
            title="Persoonlijke gegevens"
            onEdit={() => router.push("/step1")}
          >
            {data.firstName || data.lastName ? (
              <Typography variant="body2">
                {[data.firstName, data.lastName].filter(Boolean).join(" ")}
              </Typography>
            ) : (
              <Typography variant="body2" color="textDisabled">Nog niet ingevuld</Typography>
            )}
            {data.dateOfBirth ? (
              <Typography variant="caption" color="textSecondary">{data.dateOfBirth}</Typography>
            ) : null}
            {data.phoneNumber ? (
              <Typography variant="caption" color="textSecondary">{data.phoneNumber}</Typography>
            ) : null}
          </SummarySection>

          <View style={styles.divider} />

          <SummarySection
            iconName="layers"
            color="navy"
            title="Project"
            onEdit={() => router.push("/step2")}
          >
            {data.selectedProject ? (
              <Chip
                label={PROJECT_NAMES[data.selectedProject] ?? data.selectedProject}
                color="primary"
                selected
              />
            ) : data.projectUndecided ? (
              <Typography variant="body2" color="textSecondary">Nog niet gekozen</Typography>
            ) : (
              <Typography variant="body2" color="textDisabled">Nog niet ingevuld</Typography>
            )}
          </SummarySection>

          <View style={styles.divider} />

          <SummarySection
            iconName="star"
            color="orange"
            title="Activiteiten & voorkeuren"
            onEdit={() => router.push("/step4")}
          >
            {data.selectedActivities.length > 0 ? (
              <View style={styles.chipRow}>
                {data.selectedActivities.map((id) => (
                  <Chip
                    key={id}
                    label={ACTIVITY_NAMES[id] ?? id}
                    color="secondary"
                    selected
                  />
                ))}
              </View>
            ) : (
              <Typography variant="body2" color="textDisabled">Nog niet ingevuld</Typography>
            )}
            {data.dementiaExperience ? (
              <Typography variant="caption" color="textSecondary">
                Dementie: {DEMENTIA_LABELS[data.dementiaExperience] ?? data.dementiaExperience}
              </Typography>
            ) : null}
            <Typography variant="caption" color="textSecondary">
              Comfort: {data.comfortLevel}/10
            </Typography>
          </SummarySection>

          <View style={styles.divider} />

          <SummarySection
            iconName="map-pin"
            color="green"
            title="Beschikbaarheid & locatie"
            onEdit={() => router.push("/step5")}
          >
            {data.availabilityUnknown ? (
              <Typography variant="body2" color="textSecondary">Nog niet bepaald</Typography>
            ) : data.availabilitySlots.some((s) => s.day) ? (
              <View style={{ gap: DS.spacing.xs }}>
                {data.availabilitySlots
                  .filter((s) => s.day)
                  .map((s, i) => (
                    <Typography key={i} variant="body2" color="textSecondary">
                      {s.day}: {s.startTime || "?"} – {s.endTime || "?"}
                    </Typography>
                  ))}
              </View>
            ) : (
              <Typography variant="body2" color="textDisabled">Nog niet ingevuld</Typography>
            )}
            {data.address ? (
              <Typography variant="caption" color="textSecondary">
                {data.address} ({data.travelDistance} km)
              </Typography>
            ) : null}
          </SummarySection>

          <Banner
            variant="info"
            title="Na je eerste bezoek"
            message="Je kunt je profiel altijd aanpassen na je eerste bezoek aan een senior."
          />

          <Button
            variant="contained"
            color="primary"
            size="lg"
            fullWidth
            onPress={() => router.push("/loading")}
          >
            Profiel opslaan
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
      </ScrollView>
    </View>
  );
}

function SummarySection({
  iconName,
  color,
  title,
  onEdit,
  children,
}: {
  iconName: React.ComponentProps<typeof IconBadge>["iconName"];
  color: React.ComponentProps<typeof IconBadge>["color"];
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.summarySection}>
      <View style={styles.sectionHeader}>
        <IconBadge iconName={iconName} color={color} size="sm" />
        <Typography variant="h6" style={{ flex: 1 }}>{title}</Typography>
        <TouchableOpacity onPress={onEdit} style={styles.editBtn}>
          <Typography variant="caption" style={{ color: DS.palette.info.main }}>
            Bewerken
          </Typography>
        </TouchableOpacity>
      </View>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: DS.spacing.lg,
    gap: DS.spacing.lg,
  },
  card: {
    gap: DS.spacing.lg,
  },
  header: {
    gap: DS.spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: DS.palette.border,
  },
  summarySection: {
    gap: DS.spacing.sm,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.sm,
  },
  editBtn: {
    padding: DS.spacing.xs,
  },
  sectionContent: {
    paddingLeft: 36 + DS.spacing.sm,
    gap: DS.spacing.xs,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: DS.spacing.sm,
  },
});
