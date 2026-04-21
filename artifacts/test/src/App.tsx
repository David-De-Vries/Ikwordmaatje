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
    <>
      <style>{`
        html, body, #root {
          height: 100%;
          width: 100%;
          margin: 0;
          padding: 0;
        }

        .page {
          min-height: 100dvh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(145deg, #7ab5b1 0%, #8CBFBB 50%, #9dccc8 100%);
          padding: 24px;
          box-sizing: border-box;
        }

        .phone-shell {
          position: relative;
          width: 390px;
          height: 844px;
          max-height: calc(100dvh - 48px);
          aspect-ratio: 390 / 844;
          background: #1a1a1a;
          border-radius: 52px;
          box-shadow: 0 0 0 2px #3a3a3a, 0 0 0 3px #111,
            0 32px 80px rgba(0, 0, 0, 0.45),
            inset 0 0 0 1px #2a2a2a;
          flex-shrink: 0;
          overflow: hidden;
        }

        .dynamic-island {
          position: absolute;
          top: 14px;
          left: 50%;
          transform: translateX(-50%);
          width: 126px;
          height: 37px;
          background: #1a1a1a;
          border-radius: 20px;
          z-index: 10;
          box-shadow: 0 0 0 1px #2a2a2a;
        }

        .screen {
          position: absolute;
          inset: 4px;
          border-radius: 48px;
          overflow: hidden;
          background: #8CBFBB;
        }

        .screen iframe {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
        }

        .btn-left-1 {
          position: absolute;
          left: -3px;
          top: 120px;
          width: 3px;
          height: 36px;
          background: #2e2e2e;
          border-radius: 2px 0 0 2px;
        }
        .btn-left-2 {
          position: absolute;
          left: -3px;
          top: 170px;
          width: 3px;
          height: 62px;
          background: #2e2e2e;
          border-radius: 2px 0 0 2px;
        }
        .btn-left-3 {
          position: absolute;
          left: -3px;
          top: 244px;
          width: 3px;
          height: 62px;
          background: #2e2e2e;
          border-radius: 2px 0 0 2px;
        }
        .btn-right {
          position: absolute;
          right: -3px;
          top: 160px;
          width: 3px;
          height: 80px;
          background: #2e2e2e;
          border-radius: 0 2px 2px 0;
        }

        /* On a real mobile device — go full-screen, no frame */
        @media (max-width: 500px), (max-height: 700px) {
          .page {
            padding: 0;
            background: #8CBFBB;
          }
          .phone-shell {
            width: 100%;
            height: 100dvh;
            max-height: none;
            border-radius: 0;
            box-shadow: none;
            background: #8CBFBB;
          }
          .dynamic-island,
          .btn-left-1,
          .btn-left-2,
          .btn-left-3,
          .btn-right {
            display: none;
          }
          .screen {
            inset: 0;
            border-radius: 0;
          }
        }
      `}</style>

      <div className="page">
        <div className="phone-shell">
          <div className="dynamic-island" />
          <div className="screen">
            <iframe
              src={url}
              title="Careibu gebruikerstest"
              allow="camera; microphone; geolocation"
            />
          </div>
          <div className="btn-left-1" />
          <div className="btn-left-2" />
          <div className="btn-left-3" />
          <div className="btn-right" />
        </div>
      </div>
    </>
  );
}
