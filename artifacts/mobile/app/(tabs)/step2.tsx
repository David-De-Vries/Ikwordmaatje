import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  LayoutAnimation,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";

import { ProgressHeader } from "@/components/ProgressHeader";
import { SelectCard } from "@/components/SelectCard";
import { Button, Card, Typography } from "@/components/ui";
import { DS } from "@/constants/design-system";
import { useOnboarding } from "@/context/OnboardingContext";
import { useColors } from "@/hooks/useColors";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const PROJECTS = [
  {
    id: "p1",
    name: "Maatjesproject",
    category: "Vriendschap",
    color: "#8CBFBB",
    description: "Wekelijks bezoek aan een eenzame senior in de buurt.",
    longDescription:
      "Als maatje bezoek jij wekelijks een eenzame senior thuis. Je drinkt een kop koffie, luistert naar hun verhalen en brengt wat gezelligheid. Geen speciale vaardigheden nodig — gewoon jouw tijd en aandacht maken al het verschil.",
  },
  {
    id: "p2",
    name: "Wandelmaatje",
    category: "Buiten",
    color: "#7BB0AC",
    description: "Samen buiten wandelen en genieten van de natuur.",
    longDescription:
      "Samen de frisse lucht in! Jij wandelt wekelijks met een senior door het park of de wijk. Dit is goed voor hun gezondheid en geeft hen iets om naar uit te kijken. Een korte wandeling van een half uur is al waardevol.",
  },
  {
    id: "p3",
    name: "Digitaal Hulpje",
    category: "Technologie",
    color: "#6EA8A4",
    description: "Help senioren met smartphone, tablet en computer.",
    longDescription:
      "Veel senioren voelen zich verloren in de digitale wereld. Jij helpt hen stap voor stap: e-mail lezen, videobellen met kleinkinderen of veilig internetten. Geduld en duidelijkheid zijn jouw belangrijkste tools.",
  },
  {
    id: "p4",
    name: "Leesmaatje",
    category: "Cultuur",
    color: "#8CBFBB",
    description: "Voorlezen of samen praten over boeken en verhalen.",
    longDescription:
      "Lezen verbindt generaties. Jij leest voor aan een senior of bespreekt samen een boek. Voor senioren met verminderd zicht is voorlezen extra waardevol. Kies een boek dat jullie allebei aanspreekt.",
  },
  {
    id: "p5",
    name: "Kookmaatje",
    category: "Eten & Drinken",
    color: "#7BB0AC",
    description: "Samen koken en gezellig aan tafel zitten.",
    longDescription:
      "Eten is meer dan voeding — het is gezelligheid en verbinding. Jij kookt samen met een senior een maaltijd: van boodschappen doen tot tafeldekken. Een zelfgekookte maaltijd smaakt altijd het lekkerst.",
  },
  {
    id: "p6",
    name: "Muziekmaatje",
    category: "Muziek",
    color: "#6EA8A4",
    description: "Muziek luisteren, zingen of naar concerten gaan.",
    longDescription:
      "Muziek raakt de ziel. Jij luistert samen met een senior naar hun favoriete nummers, zingt mee of gaat samen naar een concert of optreden. Muziek wekt herinneringen op en brengt vreugde.",
  },
  {
    id: "p7",
    name: "Sport & Bewegen",
    category: "Gezondheid",
    color: "#8CBFBB",
    description: "Lichte sport en bewegingsoefeningen begeleiden.",
    longDescription:
      "Bewegen is goed voor lichaam en geest, ook op hoge leeftijd. Jij begeleidt een senior bij lichte oefeningen, een balletje gooien of een rondje fietsen. Samen bewegen is leuker dan alleen.",
  },
  {
    id: "p8",
    name: "Creatief Atelier",
    category: "Creativiteit",
    color: "#7BB0AC",
    description: "Knutselen, schilderen en handwerken samen.",
    longDescription:
      "Creativiteit heeft geen leeftijd. Jij knutselt, schildert of handwerkt samen met een senior. Van kaartjes maken tot aquarelleren — het creatieve proces brengt rust en voldoening voor jullie allebei.",
  },
];

interface VideoModalProps {
  project: (typeof PROJECTS)[0] | null;
  onClose: () => void;
}

function VideoModal({ project, onClose }: VideoModalProps) {
  const [playing, setPlaying] = useState(false);

  if (!project) return null;

  return (
    <Modal
      visible
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
      <SafeAreaView style={modalStyles.root}>
        <View style={modalStyles.topBar}>
          <Typography variant="h6" style={{ color: "#FFFFFF", flex: 1 }} numberOfLines={1}>
            {project.name}
          </Typography>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Feather name="x" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={[modalStyles.player, { backgroundColor: project.color }]}>
          <TouchableOpacity
            onPress={() => setPlaying((p) => !p)}
            style={modalStyles.playBtn}
            activeOpacity={0.85}
          >
            <Feather name={playing ? "pause" : "play"} size={32} color={project.color} />
          </TouchableOpacity>

          {playing && (
            <View style={modalStyles.progressBar}>
              <View style={[modalStyles.progressFill, { backgroundColor: "#FFFFFF" }]} />
            </View>
          )}
        </View>

        <ScrollView style={modalStyles.info} contentContainerStyle={modalStyles.infoContent}>
          <View style={[modalStyles.chip, { backgroundColor: project.color + "33" }]}>
            <Typography variant="caption" style={{ color: project.color, fontWeight: "700" }}>
              {project.category}
            </Typography>
          </View>
          <Typography variant="h4" style={{ color: "#FFFFFF" }}>
            {project.name}
          </Typography>
          <Typography variant="body2" style={{ color: "rgba(255,255,255,0.75)", lineHeight: 22 }}>
            {project.longDescription}
          </Typography>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

export default function Step2Screen() {
  const router = useRouter();
  const colors = useColors();
  const { data, update } = useOnboarding();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [videoProject, setVideoProject] = useState<(typeof PROJECTS)[0] | null>(null);

  const toggle = (id: string) => {
    if (data.projectUndecided) return;
    update({ selectedProject: data.selectedProject === id ? "" : id });
  };

  const toggleUndecided = () => {
    update({ projectUndecided: !data.projectUndecided, selectedProject: "" });
  };

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ProgressHeader step={2} totalSteps={10} sectionName="Project" />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scroll}>
        <Card elevation={2} padding="md" style={styles.card}>
          <View style={styles.header}>
            <Typography variant="h3">Kies een project</Typography>
            <Typography variant="body2" color="textSecondary">
              Welk project spreekt jou het meest aan?
            </Typography>
          </View>

          <View style={styles.grid}>
            {PROJECTS.map((project) => {
              const isExpanded = expandedId === project.id;
              const isSelected = data.selectedProject === project.id && !data.projectUndecided;

              return (
                <View
                  key={project.id}
                  style={[
                    styles.gridItem,
                    isSelected && { borderColor: colors.secondary, backgroundColor: colors.accent },
                  ]}
                >
                  <SelectCard
                    layout="horizontal"
                    category={project.category}
                    title={project.name}
                    description={project.description}
                    accentColor={project.color}
                    selected={isSelected}
                    onPress={() => toggle(project.id)}
                    mode="single"
                    style={{
                      opacity: data.projectUndecided ? 0.45 : 1,
                      borderWidth: 0,
                      borderRadius: 0,
                      backgroundColor: "transparent",
                    }}
                  />

                  <TouchableOpacity
                    onPress={() => toggleExpand(project.id)}
                    style={styles.meerInfoRow}
                    activeOpacity={0.65}
                  >
                    <Typography
                      variant="caption"
                      style={{ color: colors.secondary, fontWeight: "600" }}
                    >
                      Meer informatie
                    </Typography>
                    <Feather
                      name={isExpanded ? "chevron-up" : "chevron-down"}
                      size={14}
                      color={colors.secondary}
                    />
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.expandedPanel}>
                      <View style={styles.expandDivider} />

                      <Typography
                        variant="body2"
                        color="textSecondary"
                        style={{ lineHeight: 20 }}
                      >
                        {project.longDescription}
                      </Typography>

                      <TouchableOpacity
                        onPress={() => setVideoProject(project)}
                        activeOpacity={0.85}
                        style={styles.videoWrap}
                      >
                        <View
                          style={[
                            styles.videoThumb,
                            { backgroundColor: project.color },
                          ]}
                        >
                          <View style={styles.playCircle}>
                            <Feather name="play" size={20} color={project.color} />
                          </View>
                        </View>
                        <Typography
                          variant="caption"
                          style={{ color: colors.secondary, marginTop: DS.spacing.xs }}
                        >
                          Bekijk de introductievideo
                        </Typography>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
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

      {videoProject && (
        <VideoModal project={videoProject} onClose={() => setVideoProject(null)} />
      )}
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
    flexDirection: "column",
    gap: DS.spacing.sm,
  },
  gridItem: {
    width: "100%",
    borderWidth: 1,
    borderColor: DS.palette.border,
    borderRadius: DS.shape.radius.sm,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  meerInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.xs,
    paddingHorizontal: DS.spacing.md,
    paddingVertical: DS.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: DS.palette.border,
  },
  expandedPanel: {
    paddingHorizontal: DS.spacing.md,
    paddingTop: DS.spacing.md,
    paddingBottom: DS.spacing.md,
    gap: DS.spacing.md,
  },
  expandDivider: {
    height: 1,
    backgroundColor: DS.palette.border,
  },
  videoWrap: {
    alignItems: "flex-start",
  },
  videoThumb: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: DS.shape.radius.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  playCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 4,
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

const modalStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: DS.spacing.lg,
    paddingVertical: DS.spacing.md,
    gap: DS.spacing.md,
  },
  player: {
    width: "100%",
    aspectRatio: 9 / 16,
    maxHeight: "55%",
    alignItems: "center",
    justifyContent: "center",
  },
  playBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 4,
  },
  progressBar: {
    position: "absolute",
    bottom: 16,
    left: 20,
    right: 20,
    height: 3,
    backgroundColor: "rgba(255,255,255,0.35)",
    borderRadius: 2,
  },
  progressFill: {
    width: "30%",
    height: "100%",
    borderRadius: 2,
  },
  info: {
    flex: 1,
  },
  infoContent: {
    padding: DS.spacing.lg,
    gap: DS.spacing.md,
  },
  chip: {
    alignSelf: "flex-start",
    paddingHorizontal: DS.spacing.md,
    paddingVertical: DS.spacing.xs,
    borderRadius: DS.shape.radius.xs,
  },
});
