import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Card, Typography } from "@/components/ui";
import { DS } from "@/constants/design-system";

// ─────────────────────────────────────────────────────────────────────────────
// Row components
// ─────────────────────────────────────────────────────────────────────────────

type FeatherName = React.ComponentProps<typeof Feather>["name"];

function RowDivider() {
  return <View style={styles.rowDivider} />;
}

function SettingRow({
  icon,
  label,
  sublabel,
  onPress,
  right,
  iconBg = "#EEF7F6",
  iconColor = "#3A9490",
  labelColor,
}: {
  icon: FeatherName;
  label: string;
  sublabel?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  labelColor?: string;
}) {
  return (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
    >
      <View style={[styles.rowIcon, { backgroundColor: iconBg }]}>
        <Feather name={icon} size={17} color={iconColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Typography
          variant="body2"
          style={{ fontWeight: "600", color: labelColor ?? DS.palette.text.primary }}
        >
          {label}
        </Typography>
        {sublabel ? (
          <Typography variant="caption" color="textSecondary" style={{ marginTop: 1 }}>
            {sublabel}
          </Typography>
        ) : null}
      </View>
      {right}
    </TouchableOpacity>
  );
}

function ToggleRow({
  icon,
  label,
  value,
  onToggle,
  disabled,
}: {
  icon: FeatherName;
  label: string;
  value: boolean;
  onToggle: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <SettingRow
      icon={icon}
      label={label}
      iconBg={disabled ? "#F0F0F0" : "#EEF7F6"}
      iconColor={disabled ? DS.palette.text.hint : "#3A9490"}
      labelColor={disabled ? DS.palette.text.secondary : undefined}
      right={
        <Switch
          value={value}
          onValueChange={onToggle}
          disabled={disabled}
          thumbColor="#FFFFFF"
          trackColor={{
            false: DS.palette.text.disabled,
            true: "#3A9490",
          }}
          ios_backgroundColor={DS.palette.text.disabled}
        />
      }
    />
  );
}

function ChevronRow({
  icon,
  label,
  onPress,
}: {
  icon: FeatherName;
  label: string;
  onPress?: () => void;
}) {
  return (
    <SettingRow
      icon={icon}
      label={label}
      onPress={onPress}
      right={
        <Feather name="chevron-right" size={16} color={DS.palette.text.hint} />
      }
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section wrapper
// ─────────────────────────────────────────────────────────────────────────────

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Typography style={styles.sectionLabel}>{label.toUpperCase()}</Typography>
      <Card elevation={2} padding="none">
        {children}
      </Card>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen
// ─────────────────────────────────────────────────────────────────────────────

export default function InstellingenScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [profileVisible, setProfileVisible] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View style={styles.root}>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: topPad }]}>
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.7}
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="arrow-left" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Typography variant="h4" style={{ color: "#FFFFFF" }}>
            Instellingen
          </Typography>
          <Typography
            variant="caption"
            style={{ color: "rgba(255,255,255,0.75)", marginTop: 2 }}
          >
            Jouw account & voorkeuren
          </Typography>
        </View>

        <View style={styles.backBtn} />
      </View>

      {/* ── Body ───────────────────────────────────────────────────────── */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.body,
          { paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Section 1 — Profiel */}
        <Section label="Profiel">
          <ChevronRow icon="user" label="Profiel bewerken" />
          <RowDivider />
          <ChevronRow icon="calendar" label="Mijn beschikbaarheid" />
        </Section>

        {/* Section 2 — Meldingen */}
        <Section label="Meldingen">
          <ToggleRow
            icon="bell"
            label="Pushmeldingen"
            value={pushEnabled}
            onToggle={setPushEnabled}
          />
          <RowDivider />
          <ToggleRow
            icon="mail"
            label="E-mailmeldingen"
            value={emailEnabled}
            onToggle={setEmailEnabled}
          />
        </Section>

        {/* Section 3 — Privacy */}
        <Section label="Privacy">
          <ToggleRow
            icon="eye"
            label="Profiel zichtbaar voor organisatie"
            value={profileVisible}
            onToggle={setProfileVisible}
          />
        </Section>

        {/* Section 4 — App-voorkeuren */}
        <Section label="App-voorkeuren">
          <ToggleRow
            icon="moon"
            label="Donkere modus"
            value={darkMode}
            onToggle={setDarkMode}
            disabled
          />
          <RowDivider />
          <SettingRow
            icon="globe"
            label="Taal"
            right={
              <Typography variant="caption" color="textSecondary">
                Nederlands
              </Typography>
            }
          />
        </Section>

        {/* Section 5 — Account */}
        <Section label="Account">
          <SettingRow
            icon="log-out"
            label="Uitloggen"
            iconBg="#FAE0EC"
            iconColor={DS.palette.primary.main}
            labelColor={DS.palette.primary.main}
          />
          <RowDivider />
          <SettingRow
            icon="trash-2"
            label="Account verwijderen"
            sublabel="Neem contact op met Careibu"
            iconBg="#F0F0F0"
            iconColor={DS.palette.text.hint}
            labelColor={DS.palette.text.hint}
          />
        </Section>

        {/* App version */}
        <Typography
          variant="caption"
          style={styles.versionText}
        >
          Careibu v1.0.0
        </Typography>
      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F2F3F5",
  },
  header: {
    backgroundColor: "#8CBFBB",
    paddingHorizontal: DS.spacing.lg,
    paddingBottom: DS.spacing.lg,
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    width: 36,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  body: {
    padding: DS.spacing.lg,
    gap: DS.spacing.lg,
  },
  section: {
    gap: DS.spacing.sm,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: DS.palette.text.secondary,
    letterSpacing: 0.8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.md,
    padding: DS.spacing.md,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: DS.shape.radius.sm,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  rowDivider: {
    height: 1,
    backgroundColor: DS.palette.border,
    marginHorizontal: DS.spacing.md,
  },
  versionText: {
    textAlign: "center",
    color: DS.palette.text.hint,
    marginTop: DS.spacing.sm,
  },
});
