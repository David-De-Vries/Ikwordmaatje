function getExpoUrl(): string {
  const host = window.location.hostname;
  if (host.includes(".picard.replit.dev")) {
    const expoHost = host.replace(".picard.replit.dev", ".expo.picard.replit.dev");
    return `https://${expoHost}/?test=1`;
  }
  return window.location.origin + "/mobile/?test=1";
}

export default function App() {
  const url = getExpoUrl();

  return (
    <div
      style={{
        minHeight: "100dvh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(145deg, #7ab5b1 0%, #8CBFBB 50%, #9dccc8 100%)",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      {/* Phone shell */}
      <div
        style={{
          position: "relative",
          width: 390,
          height: 844,
          maxHeight: "calc(100dvh - 48px)",
          aspectRatio: "390 / 844",
          background: "#1a1a1a",
          borderRadius: 52,
          boxShadow:
            "0 0 0 2px #3a3a3a, 0 0 0 3px #111, 0 32px 80px rgba(0,0,0,0.45), inset 0 0 0 1px #2a2a2a",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {/* Top bar (Dynamic Island style) */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: "50%",
            transform: "translateX(-50%)",
            width: 126,
            height: 37,
            background: "#1a1a1a",
            borderRadius: 20,
            zIndex: 10,
            boxShadow: "0 0 0 1px #2a2a2a",
          }}
        />

        {/* Screen */}
        <div
          style={{
            position: "absolute",
            inset: 4,
            borderRadius: 48,
            overflow: "hidden",
            background: "#8CBFBB",
          }}
        >
          <iframe
            src={url}
            title="Careibu gebruikerstest"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              display: "block",
            }}
            allow="camera; microphone; geolocation"
          />
        </div>

        {/* Side buttons */}
        <div
          style={{
            position: "absolute",
            left: -3,
            top: 120,
            width: 3,
            height: 36,
            background: "#2e2e2e",
            borderRadius: "2px 0 0 2px",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -3,
            top: 170,
            width: 3,
            height: 62,
            background: "#2e2e2e",
            borderRadius: "2px 0 0 2px",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -3,
            top: 244,
            width: 3,
            height: 62,
            background: "#2e2e2e",
            borderRadius: "2px 0 0 2px",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -3,
            top: 160,
            width: 3,
            height: 80,
            background: "#2e2e2e",
            borderRadius: "0 2px 2px 0",
          }}
        />
      </div>
    </div>
  );
}
