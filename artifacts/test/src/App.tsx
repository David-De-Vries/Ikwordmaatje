import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    const target = window.location.origin + "/mobile/?test=1";
    window.location.replace(target);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#8CBFBB",
        gap: "16px",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
          <line x1="16" y1="8" x2="2" y2="22" />
          <line x1="17.5" y1="15" x2="9" y2="15" />
        </svg>
      </div>
      <p
        style={{
          color: "#ffffff",
          fontSize: "16px",
          fontFamily: "system-ui, sans-serif",
          opacity: 0.85,
        }}
      >
        Gebruikerstest wordt gestart…
      </p>
    </div>
  );
}
