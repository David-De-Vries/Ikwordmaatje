import http from "http";
import net from "net";

const PROXY_PORT = parseInt(process.env.PORT || "22605");
const EXPO_PORT = parseInt(process.env.EXPO_PORT || "22606");
const BASE_PATH = process.env.BASE_PATH || "/mobile-web/";
const BASE_PREFIX = BASE_PATH.endsWith("/") ? BASE_PATH.slice(0, -1) : BASE_PATH;

function stripBasePath(url) {
  if (!url) return "/";
  const qIdx = url.indexOf("?");
  const path = qIdx >= 0 ? url.slice(0, qIdx) : url;
  const query = qIdx >= 0 ? url.slice(qIdx) : "";

  if (path === BASE_PREFIX || path === BASE_PATH) return "/" + query;
  if (path.startsWith(BASE_PATH)) return "/" + path.slice(BASE_PATH.length) + query;
  return url;
}

const ROUTING_PATCH = `<script>
(function() {
  var BASE = ${JSON.stringify(BASE_PREFIX)};
  function stripBase(p) {
    if (!p || typeof p !== 'string') return p;
    if (p === BASE || p === BASE + '/') return '/';
    if (p.startsWith(BASE + '/')) return '/' + p.slice(BASE.length + 1);
    return p;
  }
  function addBase(p) {
    if (!p || typeof p !== 'string') return p;
    if (p.startsWith('//') || p.startsWith('http')) return p;
    if (p.startsWith('/') && !p.startsWith(BASE + '/') && p !== BASE) return BASE + p;
    return p;
  }

  // Save original History methods BEFORE patching
  var _push = History.prototype.pushState;
  var _replace = History.prototype.replaceState;

  // STEP 1: Use the ORIGINAL replaceState to strip the base from the current URL
  // This changes window.location.pathname from "/mobile-web/" to "/"
  // BEFORE Expo Router's deferred bundle loads and reads the pathname
  var currentPath = window.location.pathname;
  var strippedPath = stripBase(currentPath);
  if (strippedPath !== currentPath) {
    try {
      _replace.call(window.history, window.history.state, document.title, strippedPath + window.location.search + window.location.hash);
    } catch(e) {}
  }

  // STEP 2: Patch pushState/replaceState so future navigation adds the base back
  History.prototype.pushState = function(s, t, url) {
    return _push.call(this, s, t, addBase(url));
  };
  History.prototype.replaceState = function(s, t, url) {
    return _replace.call(this, s, t, addBase(url));
  };
})();
</script>`;

function rewriteHtml(html) {
  // 1. Rewrite root-relative asset src/href to include base prefix
  let result = html.replace(/(src|href)="(\/[^"]*?)"/g, (match, attr, url) => {
    if (url.startsWith("//") || url.startsWith(BASE_PATH) || url.startsWith(BASE_PREFIX + "?")) return match;
    if (url.startsWith("/")) return `${attr}="${BASE_PREFIX}${url}"`;
    return match;
  }).replace(/(src|href)='(\/[^']*?)'/g, (match, attr, url) => {
    if (url.startsWith("//") || url.startsWith(BASE_PATH) || url.startsWith(BASE_PREFIX + "?")) return match;
    if (url.startsWith("/")) return `${attr}='${BASE_PREFIX}${url}'`;
    return match;
  });

  // 2. Inject routing patch + fonts BEFORE the bundle script (inside </head>)
  const fontInjection = `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style id="careibu-fonts">
      @font-face {
        font-family: "Feather";
        src: url('${BASE_PATH}fonts/Feather.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
        font-display: block;
      }
      @font-face {
        font-family: "Ionicons";
        src: url('${BASE_PATH}fonts/Ionicons.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
        font-display: block;
      }
      @font-face {
        font-family: "Inter_400Regular";
        src: url('https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf') format('truetype');
        font-weight: 400; font-style: normal;
      }
      @font-face {
        font-family: "Inter_500Medium";
        src: url('https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fMZg.ttf') format('truetype');
        font-weight: 500; font-style: normal;
      }
      @font-face {
        font-family: "Inter_600SemiBold";
        src: url('https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYMZg.ttf') format('truetype');
        font-weight: 600; font-style: normal;
      }
      @font-face {
        font-family: "Inter_700Bold";
        src: url('https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf') format('truetype');
        font-weight: 700; font-style: normal;
      }
    </style>`;

  result = result.replace("</head>", fontInjection + "\n  </head>");

  // 3. Inject routing patch BEFORE the deferred bundle script (so it runs first)
  result = result.replace(/<script\s+src="[^"]*entry\.bundle[^"]*"\s+defer><\/script>/,
    ROUTING_PATCH + "\n  $&");

  return result;
}

function waitForExpo(port, retries = 60, delayMs = 1000) {
  return new Promise((resolve) => {
    function attempt(n) {
      const sock = net.createConnection(port, "127.0.0.1");
      sock.once("connect", () => { sock.destroy(); resolve(true); });
      sock.once("error", () => {
        sock.destroy();
        if (n > 0) setTimeout(() => attempt(n - 1), delayMs);
        else resolve(false);
      });
    }
    attempt(retries);
  });
}

const server = http.createServer((req, res) => {
  req.url = stripBasePath(req.url || "/");

  const options = {
    hostname: "127.0.0.1",
    port: EXPO_PORT,
    path: req.url,
    method: req.method,
    headers: {
      ...req.headers,
      host: `localhost:${EXPO_PORT}`,
      "accept-encoding": "identity",
    },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    const contentType = proxyRes.headers["content-type"] || "";
    const isHtml = contentType.includes("text/html");

    if (isHtml) {
      const chunks = [];
      proxyRes.on("data", (chunk) => chunks.push(chunk));
      proxyRes.on("end", () => {
        const raw = Buffer.concat(chunks).toString("utf8");
        const rewritten = rewriteHtml(raw);
        const headers = { ...proxyRes.headers };
        delete headers["content-encoding"];
        delete headers["content-length"];
        res.writeHead(proxyRes.statusCode, headers);
        res.end(rewritten);
      });
    } else {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    }
  });

  proxyReq.on("error", () => {
    if (!res.headersSent) {
      res.writeHead(502, { "Content-Type": "text/plain" });
      res.end("Expo web server starting up. Please refresh in a moment.");
    }
  });

  req.pipe(proxyReq, { end: true });
});

server.on("upgrade", (req, socket, head) => {
  req.url = stripBasePath(req.url || "/");
  const target = net.createConnection(EXPO_PORT, "127.0.0.1", () => {
    const hdrs = { ...req.headers, host: `localhost:${EXPO_PORT}` };
    const headerStr = Object.entries(hdrs).map(([k, v]) => `${k}: ${v}`).join("\r\n");
    target.write(`${req.method} ${req.url} HTTP/1.1\r\n${headerStr}\r\n\r\n`);
    if (head && head.length) target.write(head);
    socket.pipe(target);
    target.pipe(socket);
  });
  target.on("error", () => socket.destroy());
  socket.on("error", () => target.destroy());
});

server.listen(PROXY_PORT, "0.0.0.0", () => {
  console.log(`[proxy] Listening on :${PROXY_PORT}`);
  console.log(`[proxy] Forwarding ${BASE_PATH}* -> :${EXPO_PORT}/*`);
  console.log(`[proxy] HTML injection: fonts + routing patch + asset rewrite active`);
});

waitForExpo(EXPO_PORT).then((ok) => {
  console.log(ok
    ? `[proxy] Expo web server up on :${EXPO_PORT}`
    : `[proxy] Warning: Expo not ready on :${EXPO_PORT}`
  );
});
