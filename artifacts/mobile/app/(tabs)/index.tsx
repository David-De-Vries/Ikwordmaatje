import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Typography } from "@/components/ui";
import { DS } from "@/constants/design-system";
import { useOnboardingMode } from "@/context/OnboardingModeContext";
import { useTestMode } from "@/context/TestModeContext";

export default function LauncherScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isTestMode } = useTestMode();
  const { isOnboardingMode } = useOnboardingMode();

  React.useEffect(() => {
    if (isTestMode || isOnboardingMode) {
      router.replace("/signup");
    }
  }, [isTestMode, isOnboardingMode]);

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Feather name="feather" size={28} color="#FFFFFF" />
        </View>
        <Typography variant="h3" style={{ color: "#FFFFFF" }}>
          Careibu
        </Typography>
        <Typography variant="body2" style={{ color: "rgba(255,255,255,0.75)" }}>
          Kies waar je wilt beginnen
        </Typography>
      </View>

      {/* Buttons */}
      <View style={styles.card}>
        {!isTestMode && (
          <>
            <TouchableOpacity
              style={[styles.btn, styles.btnPrimary]}
              activeOpacity={0.85}
              onPress={() => router.push("/signup")}
            >
              <View style={styles.btnIcon}>
                <Feather name="user-plus" size={20} color="#A01550" />
              </View>
              <View style={{ flex: 1 }}>
                <Typography variant="subtitle1" style={{ color: DS.palette.text.primary }}>
                  Onboarding
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Doorloop de aanmeldingsstappen
                </Typography>
              </View>
              <Feather name="chevron-right" size={18} color={DS.palette.text.hint} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={[styles.btn, styles.btnSecondary]}
              activeOpacity={0.85}
              onPress={() => router.push("/dashboard")}
            >
              <View style={[styles.btnIcon, { backgroundColor: "#D6ECEA" }]}>
                <Feather name="home" size={20} color="#3A9490" />
              </View>
              <View style={{ flex: 1 }}>
                <Typography variant="subtitle1" style={{ color: DS.palette.text.primary }}>
                  Dashboard FTUX
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Taken gedeeltelijk voltooid
                </Typography>
              </View>
              <Feather name="chevron-right" size={18} color={DS.palette.text.hint} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={[styles.btn, styles.btnSecondary]}
              activeOpacity={0.85}
              onPress={() => router.push("/dashboard-complete")}
            >
              <View style={[styles.btnIcon, { backgroundColor: "#D6F0EA" }]}>
                <Feather name="check-circle" size={20} color="#2E7D6E" />
              </View>
              <View style={{ flex: 1 }}>
                <Typography variant="subtitle1" style={{ color: DS.palette.text.primary }}>
                  Dashboard Complete Tasklist
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Alle taken voltooid
                </Typography>
              </View>
              <Feather name="chevron-right" size={18} color={DS.palette.text.hint} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={[styles.btn, styles.btnSecondary]}
              activeOpacity={0.85}
              onPress={() => router.push("/dashboard-intake")}
            >
              <View style={[styles.btnIcon, { backgroundColor: "#E8D6F0" }]}>
                <Feather name="calendar" size={20} color="#7B2D8B" />
              </View>
              <View style={{ flex: 1 }}>
                <Typography variant="subtitle1" style={{ color: DS.palette.text.primary }}>
                  Dashboard Intake Planned
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Na het inplannen van een afspraak
                </Typography>
              </View>
              <Feather name="chevron-right" size={18} color={DS.palette.text.hint} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={[styles.btn, styles.btnSecondary]}
              activeOpacity={0.85}
              onPress={() => router.push("/dashboard-seniors")}
            >
              <View style={[styles.btnIcon, { backgroundColor: "#D6ECEA" }]}>
                <Feather name="users" size={20} color="#3A9490" />
              </View>
              <View style={{ flex: 1 }}>
                <Typography variant="subtitle1" style={{ color: DS.palette.text.primary }}>
                  Dashboard Seniors
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Na het bekijken van senioren
                </Typography>
              </View>
              <Feather name="chevron-right" size={18} color={DS.palette.text.hint} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={[styles.btn, styles.btnSecondary]}
              activeOpacity={0.85}
              onPress={() => router.push("/dashboard-active")}
            >
              <View style={[styles.btnIcon, { backgroundColor: "#FFF0D9" }]}>
                <Feather name="activity" size={20} color="#C97B00" />
              </View>
              <View style={{ flex: 1 }}>
                <Typography variant="subtitle1" style={{ color: DS.palette.text.primary }}>
                  Dashboard Active Match
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Actief gematcht, geen takenlijst
                </Typography>
              </View>
              <Feather name="chevron-right" size={18} color={DS.palette.text.hint} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={[styles.btn, styles.btnSecondary]}
              activeOpacity={0.85}
              onPress={() => router.push("/dashboard-kennisbank")}
            >
              <View style={[styles.btnIcon, { backgroundColor: "#D6E4F5" }]}>
                <Feather name="book-open" size={20} color="#1A5EA8" />
              </View>
              <View style={{ flex: 1 }}>
                <Typography variant="subtitle1" style={{ color: DS.palette.text.primary }}>
                  Dashboard Kennisbank
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Informatie & tips voor vrijwilligers
                </Typography>
              </View>
              <Feather name="chevron-right" size={18} color={DS.palette.text.hint} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#8CBFBB",
    gap: DS.spacing.xl,
    paddingHorizontal: DS.spacing.lg,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    gap: DS.spacing.sm,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: DS.spacing.xs,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: DS.shape.radius.lg,
    overflow: "hidden",
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.md,
    padding: DS.spacing.lg,
  },
  btnPrimary: {},
  btnSecondary: {},
  btnIcon: {
    width: 44,
    height: 44,
    borderRadius: DS.shape.radius.sm,
    backgroundColor: "#FAE0EC",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  divider: {
    height: 1,
    backgroundColor: DS.palette.border,
    marginHorizontal: DS.spacing.lg,
  },
});
