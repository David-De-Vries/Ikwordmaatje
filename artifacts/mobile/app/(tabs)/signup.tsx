import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, Card, TextField, Typography } from "@/components/ui";
import { DS } from "@/constants/design-system";
import { useColors } from "@/hooks/useColors";

export default function SignupScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validate = () => {
    const next = { email: "", password: "" };
    if (!email.trim()) next.email = "Vul je e-mailadres in";
    else if (!/\S+@\S+\.\S+/.test(email)) next.email = "Ongeldig e-mailadres";
    if (!password.trim()) next.password = "Vul een wachtwoord in";
    else if (password.length < 6) next.password = "Minimaal 6 tekens";
    setErrors(next);
    return !next.email && !next.password;
  };

  const handleCreate = () => {
    if (validate()) router.push("/step1");
  };

  const topPad =
    Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: topPad + DS.spacing.xxxl },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.brandArea}>
          <Image
            source={require("../../assets/images/icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Typography variant="h2" style={{ color: "#FFFFFF" }} align="center">
            Careibu
          </Typography>
          <Typography
            variant="body1"
            style={{ color: "#FFFFFF", opacity: 0.85 }}
            align="center"
          >
            Verbinding tussen vrijwilligers en ouderen
          </Typography>
        </View>

        <Card elevation={4} padding="lg" style={styles.card}>
          <Typography variant="h4" style={styles.cardTitle}>
            Account aanmaken
          </Typography>
          <Typography variant="body2" color="textSecondary" style={styles.cardSubtitle}>
            Maak een gratis account aan om te beginnen.
          </Typography>

          <View style={styles.fields}>
            <TextField
              label="E-mailadres"
              placeholder="naam@voorbeeld.nl"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={!!errors.email}
              helperText={errors.email}
              returnKeyType="next"
            />
            <TextField
              label="Wachtwoord"
              placeholder="Minimaal 6 tekens"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={!!errors.password}
              helperText={errors.password}
              returnKeyType="done"
              onSubmitEditing={handleCreate}
            />
          </View>

          <Button
            variant="contained"
            color="primary"
            size="lg"
            fullWidth
            onPress={handleCreate}
            style={styles.createBtn}
          >
            Account aanmaken
          </Button>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Typography variant="caption" color="textDisabled">
              of
            </Typography>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialButtons}>
            {/* Google */}
            <TouchableOpacity
              style={styles.socialBtn}
              onPress={() => router.push("/step1")}
              activeOpacity={0.82}
            >
              <Image
                source={require("../../assets/images/google-logo.png")}
                style={styles.socialLogo}
                resizeMode="contain"
              />
              <Typography variant="body2" style={styles.socialBtnText}>
                Ga verder met Google
              </Typography>
            </TouchableOpacity>

            {/* Apple */}
            <TouchableOpacity
              style={styles.socialBtn}
              onPress={() => router.push("/step1")}
              activeOpacity={0.82}
            >
              <Ionicons name="logo-apple" size={21} color="#000000" />
              <Typography variant="body2" style={styles.socialBtnText}>
                Ga verder met Apple
              </Typography>
            </TouchableOpacity>
          </View>

          <View style={styles.loginRow}>
            <Typography variant="body2" color="textSecondary">
              Al een account?{" "}
            </Typography>
            <Typography
              variant="body2"
              style={{ color: colors.primary }}
              onPress={() => {}}
            >
              Inloggen
            </Typography>
          </View>
        </Card>

        <View style={{ height: insets.bottom + DS.spacing.xl }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingHorizontal: DS.spacing.lg,
    gap: DS.spacing.xxl,
  },
  brandArea: {
    alignItems: "center",
    gap: DS.spacing.sm,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: DS.shape.radius.lg,
  },
  card: {
    gap: DS.spacing.lg,
  },
  cardTitle: {
    textAlign: "center",
  },
  cardSubtitle: {
    textAlign: "center",
    marginTop: -DS.spacing.sm,
  },
  fields: {
    gap: DS.spacing.md,
  },
  createBtn: {
    marginTop: DS.spacing.xs,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: DS.palette.border,
  },
  socialButtons: {
    gap: DS.spacing.sm,
  },
  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: DS.spacing.sm,
    height: 48,
    borderRadius: DS.shape.radius.md,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  socialBtnText: {
    color: "#1A1A1A",
    fontWeight: "500",
  },
  socialLogo: {
    width: 20,
    height: 20,
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
