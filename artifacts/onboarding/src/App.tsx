import { useEffect, useState } from "react";

function getExpoWebUrl(): string {
  const host = window.location.hostname;
  if (host.includes(".picard.replit.dev")) {
    const expoHost = host.replace(".picard.replit.dev", ".expo.picard.replit.dev");
    return `https://${expoHost}/?flow=onboarding`;
  }
  return `${window.location.origin}/mobile/?flow=onboarding`;
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const url = getExpoWebUrl();

  useEffect(() => {
    document.title = "Careibu Onboarding";
  }, []);

  return (
    <>
      <style>{`
        html, body, #root {
          margin: 0; padding: 0;
          height: 100%; width: 100%;
          font-family: system-ui, -apple-system, sans-serif;
        }
        * { box-sizing: border-box; }

        .page {
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(145deg, #7ab5b1 0%, #8CBFBB 60%, #9dccc8 100%);
          padding: 32px 16px;
        }

        .phone {
          position: relative;
          width: 393px;
          height: 852px;
          background: #1a1a1a;
          border-radius: 52px;
          box-shadow:
            0 0 0 2px #3a3a3a,
            0 32px 80px rgba(0,0,0,0.45),
            inset 0 0 0 2px #2a2a2a;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          flex-shrink: 0;
        }

        .dynamic-island {
          position: absolute;
          top: 12px;
          left: 50%;
          transform: translateX(-50%);
          width: 120px;
          height: 34px;
          background: #1a1a1a;
          border-radius: 20px;
          z-index: 10;
          pointer-events: none;
        }

        .btn-side {
          position: absolute;
          background: #2c2c2c;
          border-radius: 3px;
        }
        .btn-power  { right: -3px; top: 140px; width: 3px; height: 70px; }
        .btn-vol-up { left: -3px;  top: 140px; width: 3px; height: 42px; }
        .btn-vol-dn { left: -3px;  top: 196px; width: 3px; height: 42px; }

        .screen {
          flex: 1;
          margin: 12px;
          border-radius: 42px;
          overflow: hidden;
          background: #000;
          position: relative;
        }

        .loader {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #8CBFBB;
          gap: 16px;
          pointer-events: none;
          transition: opacity 0.4s ease;
        }

        .loader-dots { display: flex; gap: 8px; }

        .loader-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          background: rgba(255,255,255,0.85);
          animation: ldpulse 1.2s infinite ease-in-out;
        }
        .loader-dot:nth-child(2) { animation-delay: 0.2s; }
        .loader-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes ldpulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.35; }
          40% { transform: scale(1); opacity: 1; }
        }

        .loader-text {
          color: rgba(255,255,255,0.85);
          font-size: 14px;
          font-weight: 500;
        }

        /* Full-screen on real mobile devices */
        @media (max-width: 500px), (max-height: 700px) {
          .page { padding: 0; background: #000; }
          .phone { width: 100vw; height: 100dvh; border-radius: 0; box-shadow: none; }
          .dynamic-island, .btn-side { display: none; }
          .screen { margin: 0; border-radius: 0; }
        }
      `}</style>

      <div className="page">
        <div className="phone">
          <div className="dynamic-island" />
          <div className="btn-side btn-power" />
          <div className="btn-side btn-vol-up" />
          <div className="btn-side btn-vol-dn" />

          <div className="screen">
            <div
              className="loader"
              style={{ opacity: loaded ? 0 : 1 }}
            >
              <div className="loader-dots">
                <div className="loader-dot" />
                <div className="loader-dot" />
                <div className="loader-dot" />
              </div>
              <div className="loader-text">Laden…</div>
            </div>

            <iframe
              src={url}
              title="Careibu Onboarding"
              onLoad={() => setLoaded(true)}
              allow="camera; microphone"
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                display: "block",
                opacity: loaded ? 1 : 0,
                transition: "opacity 0.4s ease",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
