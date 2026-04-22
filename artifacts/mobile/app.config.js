const baseUrl = process.env.EXPO_WEB_BASE_URL || "/";

module.exports = {
  expo: {
    name: "Careibu Mobile",
    slug: "mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "mobile",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/icon.png",
      resizeMode: "contain",
      backgroundColor: "#8CBFBB",
    },
    ios: {
      supportsTablet: false,
    },
    android: {},
    web: {
      favicon: "./assets/images/icon.png",
      bundler: "metro",
      output: "static",
    },
    plugins: [
      [
        "expo-router",
        {
          origin: process.env.EXPO_PUBLIC_DOMAIN
            ? `https://${process.env.EXPO_PUBLIC_DOMAIN}`
            : "https://localhost:8081",
        },
      ],
      "expo-font",
      "expo-web-browser",
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
      baseUrl,
    },
  },
};
