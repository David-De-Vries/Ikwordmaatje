/**
 * Careibu Design System
 * MUI-inspired design tokens for the Careibu mobile app.
 *
 * ─────────────────────────────────────────────────────────────
 * HOW TO CONVERT TO FIGMA (using Cursor or similar)
 * ─────────────────────────────────────────────────────────────
 *
 * 1. FIGMA VARIABLES  (map from DS.palette.*)
 *    Create a "Careibu/Palette" variable collection.
 *    Each key becomes a variable: primary/main → #A01550, etc.
 *
 * 2. FIGMA TEXT STYLES  (map from DS.typography.*)
 *    Create a text style for each variant key (h1, h2, body1 …).
 *    Use the fontFamily, fontSize, lineHeight values.
 *
 * 3. FIGMA EFFECTS  (map from DS.shadows.*)
 *    Create a drop shadow effect for each elevation level.
 *
 * 4. FIGMA COMPONENTS
 *    Each component in /components/ui/* maps 1:1 to a Figma component.
 *    Component props (variant, color, size) map to Figma component properties.
 *
 * ─────────────────────────────────────────────────────────────
 */

export const DS = {
  /**
   * COLOR PALETTE
   * Figma: Variables / Palette
   */
  palette: {
    primary: {
      main: "#A01550",
      light: "#D4396E",
      dark: "#6B0E37",
      contrast: "#FFFFFF",
    },
    secondary: {
      main: "#7BB5AD",
      light: "#A9D1CC",
      dark: "#527A75",
      contrast: "#FFFFFF",
    },
    background: {
      page: "#8CBFBB",
      paper: "#FFFFFF",
      input: "#F7F7F7",
      selected: "#EAF5F3",
    },
    text: {
      primary: "#1A1A1A",
      secondary: "#5A5A5A",
      disabled: "#BDBDBD",
      hint: "#9E9E9E",
      inverse: "#FFFFFF",
    },
    error: {
      main: "#D32F2F",
      light: "#EF9A9A",
      dark: "#B71C1C",
      contrast: "#FFFFFF",
    },
    warning: {
      main: "#ED6C02",
      light: "#FFB74D",
      dark: "#E65100",
      contrast: "#FFFFFF",
    },
    info: {
      main: "#1565C0",
      light: "#64B5F6",
      dark: "#0D47A1",
      contrast: "#FFFFFF",
      bg: "#E8F2FE",
    },
    success: {
      main: "#2E7D32",
      light: "#81C784",
      dark: "#1B5E20",
      contrast: "#FFFFFF",
      bg: "#EBF5EB",
    },
    divider: "#E0E0E0",
    border: "#E0E0E0",
  },

  /**
   * ICON BADGE COLORS
   * Figma: Variables / IconBadge
   * Used by the <IconBadge> component.
   */
  iconBadge: {
    teal: { bg: "#D4EBE9", icon: "#5A9E97" },
    orange: { bg: "#FFF0E0", icon: "#E07B39" },
    crimson: { bg: "#FAE0EC", icon: "#A01550" },
    navy: { bg: "#E0E8F5", icon: "#1565C0" },
    green: { bg: "#E0F2E1", icon: "#2E7D32" },
    purple: { bg: "#EDE0FA", icon: "#7B39A0" },
    gray: { bg: "#F0F0F0", icon: "#5A5A5A" },
  },

  /**
   * TYPOGRAPHY SCALE
   * Figma: Text Styles
   *
   * Font families (loaded in app/_layout.tsx):
   *   Regular  → "Inter_400Regular"
   *   Medium   → "Inter_500Medium"
   *   SemiBold → "Inter_600SemiBold"
   *   Bold     → "Inter_700Bold"
   */
  typography: {
    fontFamily: {
      regular: "Inter_400Regular",
      medium: "Inter_500Medium",
      semiBold: "Inter_600SemiBold",
      bold: "Inter_700Bold",
    },
    /** Figma Text Style: "H1 / Display" */
    h1: { fontSize: 28, fontFamily: "Inter_700Bold", lineHeight: 36 },
    /** Figma Text Style: "H2 / Title" */
    h2: { fontSize: 24, fontFamily: "Inter_700Bold", lineHeight: 32 },
    /** Figma Text Style: "H3 / Headline" */
    h3: { fontSize: 20, fontFamily: "Inter_600SemiBold", lineHeight: 28 },
    /** Figma Text Style: "H4 / Subheadline" */
    h4: { fontSize: 18, fontFamily: "Inter_600SemiBold", lineHeight: 26 },
    /** Figma Text Style: "H5 / Section" */
    h5: { fontSize: 16, fontFamily: "Inter_600SemiBold", lineHeight: 24 },
    /** Figma Text Style: "H6 / Label Large" */
    h6: { fontSize: 14, fontFamily: "Inter_600SemiBold", lineHeight: 20 },
    /** Figma Text Style: "Subtitle 1" */
    subtitle1: { fontSize: 16, fontFamily: "Inter_500Medium", lineHeight: 24 },
    /** Figma Text Style: "Subtitle 2" */
    subtitle2: { fontSize: 14, fontFamily: "Inter_500Medium", lineHeight: 20 },
    /** Figma Text Style: "Body 1" */
    body1: { fontSize: 16, fontFamily: "Inter_400Regular", lineHeight: 24 },
    /** Figma Text Style: "Body 2" */
    body2: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 20 },
    /** Figma Text Style: "Caption" */
    caption: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 16 },
    /** Figma Text Style: "Button" */
    button: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      lineHeight: 20,
      letterSpacing: 0.5,
    },
    /** Figma Text Style: "Overline" */
    overline: {
      fontSize: 11,
      fontFamily: "Inter_500Medium",
      lineHeight: 16,
      letterSpacing: 1.5,
      textTransform: "uppercase" as const,
    },
  },

  /**
   * SPACING SCALE (4px base grid)
   * Figma: Variables / Spacing
   */
  spacing: {
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    xxxxl: 48,
  },

  /**
   * SHAPE / BORDER RADIUS
   * Figma: Variables / Radius
   */
  shape: {
    radius: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
      full: 9999,
    },
  },

  /**
   * ELEVATION / SHADOW SCALE
   * Figma: Effects → Drop Shadow
   *
   * elevation0 → no shadow
   * elevation1 → subtle card lift
   * elevation2 → card/tile default
   * elevation4 → dropdown/popover
   * elevation8 → modal/sheet
   */
  shadows: {
    elevation0: {
      shadowColor: "transparent",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    elevation1: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    elevation2: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 2,
    },
    elevation4: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 10,
      elevation: 4,
    },
    elevation8: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.16,
      shadowRadius: 20,
      elevation: 8,
    },
  },

  /**
   * Z-INDEX SCALE
   * Figma: (for documentation purposes)
   */
  zIndex: {
    base: 0,
    raised: 1,
    dropdown: 100,
    sticky: 200,
    overlay: 300,
    modal: 400,
    toast: 500,
  },

  /**
   * ANIMATION DURATIONS (ms)
   * Figma: Prototype transitions
   */
  animation: {
    fast: 150,
    normal: 250,
    slow: 400,
  },
} as const;

export type DSSpacing = keyof typeof DS.spacing;
export type DSRadius = keyof typeof DS.shape.radius;
export type DSIconBadgeColor = keyof typeof DS.iconBadge;
