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
    <iframe
      src={url}
      title="Careibu gebruikerstest"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        border: "none",
        background: "#8CBFBB",
      }}
      allow="camera; microphone; geolocation"
    />
  );
}
