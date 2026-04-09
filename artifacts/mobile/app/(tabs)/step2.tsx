import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import { ProgressHeader } from "@/components/ProgressHeader";
import { SelectCard } from "@/components/SelectCard";
import { Button, Card, Typography } from "@/components/ui";
import { DS } from "@/constants/design-system";
import { useOnboarding } from "@/context/OnboardingContext";
import { useColors } from "@/hooks/useColors";

const PROJECTS = Array.from({ length: 8 }, (_, i) => ({
  id: `project-${i + 1}`,
  name: `Project ${i + 1}`,
  color: "#8CBFBB",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
}));

export default function Step2Screen() {
  const router = useRouter();
  const colors = useColors();
  const { data, update } = useOnboarding();

  const toggle = (id: string) => {
    if (data.projectUndecided) return;
    update({ selectedProject: data.selectedProject === id ? "" : id });
  };

  const toggleUndecided = () => {
    update({ projectUndecided: !data.projectUndecided, selectedProject: "" });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ProgressHeader step={2} totalSteps={10} sectionName="Project" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
      >
        <Card elevation={2} padding="lg" style={styles.card}>
          <View style={styles.header}>
            <Typography variant="h3">Kies een project</Typography>
            <Typography variant="body2" color="textSecondary">
              Welk project spreekt jou het meest aan?
            </Typography>
          </View>

          <View style={styles.grid}>
            {PROJECTS.map((project) => (
              <View key={project.id} style={styles.gridItem}>
                <SelectCard
                  title={project.name}
                  description={project.description}
                  accentColor={project.color}
                  selected={data.selectedProject === project.id && !data.projectUndecided}
                  onPress={() => toggle(project.id)}
                  mode="single"
                  style={{ opacity: data.projectUndecided ? 0.45 : 1 }}
                />
              </View>
            ))}
          </View>

          <TouchableOpacity
            onPress={toggleUndecided}
            style={[
              styles.undecidedRow,
              {
                borderColor: data.projectUndecided ? colors.secondary : DS.palette.border,
                backgroundColor: data.projectUndecided ? colors.accent : "#FFFFFF",
              },
            ]}
          >
            <View
              style={[
                styles.checkbox,
                {
                  borderColor: data.projectUndecided ? colors.secondary : DS.palette.border,
                  backgroundColor: data.projectUndecided ? colors.secondary : "transparent",
                },
              ]}
            >
              {data.projectUndecided && (
                <Typography variant="caption" style={{ color: "#fff", lineHeight: 16 }}>
                  ✓
                </Typography>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Typography variant="h6">Ik twijfel nog</Typography>
              <Typography variant="caption" color="textSecondary">
                Geen probleem, je kunt dit later aanpassen.
              </Typography>
            </View>
          </TouchableOpacity>

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
              onPress={() => router.push("/step3")}
              style={styles.nextBtn}
            >
              Verder
            </Button>
          </View>
        </Card>

        <View style={{ height: DS.spacing.xl }} />
      </ScrollView>
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: DS.spacing.md,
  },
  gridItem: {
    width: "47%",
  },
  undecidedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.md,
    borderWidth: 1,
    borderRadius: DS.shape.radius.sm,
    padding: DS.spacing.md,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
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
