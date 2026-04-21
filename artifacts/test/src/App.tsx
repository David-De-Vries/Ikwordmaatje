import { QRCodeSVG } from "qrcode.react";

function getExpoGoUrl(): string {
  const host = window.location.hostname;
  if (host.includes(".picard.replit.dev")) {
    const expoHost = host.replace(".picard.replit.dev", ".expo.picard.replit.dev");
    return `exp://${expoHost}/--/?test=1`;
  }
  return `exp://${host}/--/?test=1`;
}

function getWebUrl(): string {
  const host = window.location.hostname;
  if (host.includes(".picard.replit.dev")) {
    const expoHost = host.replace(".picard.replit.dev", ".expo.picard.replit.dev");
    return `https://${expoHost}/?test=1`;
  }
  return window.location.origin + "/mobile/?test=1";
}

export default function App() {
  const expoGoUrl = getExpoGoUrl();
  const webUrl = getWebUrl();

  return (
    <>
      <style>{`
        html, body, #root {
          height: 100%;
          width: 100%;
          margin: 0;
          padding: 0;
        }
        * { box-sizing: border-box; }

        .page {
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(145deg, #7ab5b1 0%, #8CBFBB 50%, #9dccc8 100%);
          padding: 24px;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .card {
          background: #ffffff;
          border-radius: 24px;
          padding: 40px 36px 36px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          max-width: 380px;
          width: 100%;
          box-shadow: 0 16px 48px rgba(0,0,0,0.18);
        }

        .logo {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #8CBFBB;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        h1 {
          margin: 0;
          font-size: 22px;
          font-weight: 700;
          color: #1a1a1a;
          text-align: center;
        }

        .subtitle {
          margin: -12px 0 0;
          font-size: 14px;
          color: #6b7280;
          text-align: center;
          line-height: 1.5;
        }

        .qr-wrap {
          background: #f9fafb;
          border-radius: 16px;
          padding: 20px;
          border: 1px solid #e5e7eb;
        }

        .steps {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .step {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 14px;
          color: #374151;
          line-height: 1.4;
        }

        .step-num {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #A01550;
          color: white;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .divider {
          width: 100%;
          height: 1px;
          background: #e5e7eb;
        }

        .web-link {
          font-size: 13px;
          color: #6b7280;
          text-align: center;
          line-height: 1.5;
        }

        .web-link a {
          color: #A01550;
          text-decoration: none;
          font-weight: 500;
          word-break: break-all;
        }

        .web-link a:hover { text-decoration: underline; }
      `}</style>

      <div className="page">
        <div className="card">
          <div className="logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
              <line x1="16" y1="8" x2="2" y2="22" />
              <line x1="17.5" y1="15" x2="9" y2="15" />
            </svg>
          </div>

          <h1>Gebruikerstest</h1>
          <p className="subtitle">
            Scan de QR-code met de <strong>Expo Go</strong>-app om de test te starten op je eigen apparaat.
          </p>

          <div className="qr-wrap">
            <QRCodeSVG value={expoGoUrl} size={200} level="M" />
          </div>

          <div className="steps">
            <div className="step">
              <div className="step-num">1</div>
              <span>Download <strong>Expo Go</strong> uit de App Store of Google Play</span>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <span>Open Expo Go en tik op <strong>"Scan QR-code"</strong></span>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <span>Scan de code hierboven — de test start automatisch</span>
            </div>
          </div>

          <div className="divider" />

          <p className="web-link">
            Of open in de browser:{" "}
            <a href={webUrl} target="_blank" rel="noopener noreferrer">
              {webUrl.replace("https://", "")}
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
