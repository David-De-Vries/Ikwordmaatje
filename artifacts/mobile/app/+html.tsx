import { ScrollViewStyleReset } from "expo-router/html";
import type { PropsWithChildren } from "react";

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="nl">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" content="#8CBFBB" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <ScrollViewStyleReset />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html, body, #root {
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
                background-color: #8CBFBB;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                text-rendering: optimizeLegibility;
              }
              * { box-sizing: border-box; }

              @font-face {
                font-family: "Feather";
                src: url('./fonts/Feather.ttf') format('truetype');
                font-weight: normal;
                font-style: normal;
                font-display: block;
              }
              @font-face {
                font-family: "Ionicons";
                src: url('./fonts/Ionicons.ttf') format('truetype');
                font-weight: normal;
                font-style: normal;
                font-display: block;
              }

              @font-face {
                font-family: "Inter_400Regular";
                src: url('https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf') format('truetype');
                font-weight: 400;
                font-style: normal;
              }
              @font-face {
                font-family: "Inter_500Medium";
                src: url('https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fMZg.ttf') format('truetype');
                font-weight: 500;
                font-style: normal;
              }
              @font-face {
                font-family: "Inter_600SemiBold";
                src: url('https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYMZg.ttf') format('truetype');
                font-weight: 600;
                font-style: normal;
              }
              @font-face {
                font-family: "Inter_700Bold";
                src: url('https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf') format('truetype');
                font-weight: 700;
                font-style: normal;
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
