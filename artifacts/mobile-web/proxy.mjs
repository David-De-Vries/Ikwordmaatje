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

  if (path === BASE_PREFIX || path === BASE_PATH) {
    return "/" + query;
  }
  if (path.startsWith(BASE_PATH)) {
    return "/" + path.slice(BASE_PATH.length) + query;
  }
  return url;
}

// Rewrite root-relative URLs in HTML to include the base path
function rewriteHtml(html) {
  // Match src="..." or href="..." where value starts with / but not // or /mobile-web/
  return html.replace(/(src|href)="(\/[^"]*?)"/g, (match, attr, url) => {
    if (url.startsWith("//") || url.startsWith(BASE_PATH) || url.startsWith(BASE_PREFIX + "?")) {
      return match;
    }
    if (url.startsWith("/")) {
      return `${attr}="${BASE_PREFIX}${url}"`;
    }
    return match;
  }).replace(/(src|href)='(\/[^']*?)'/g, (match, attr, url) => {
    if (url.startsWith("//") || url.startsWith(BASE_PATH) || url.startsWith(BASE_PREFIX + "?")) {
      return match;
    }
    if (url.startsWith("/")) {
      return `${attr}='${BASE_PREFIX}${url}'`;
    }
    return match;
  });
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
});

waitForExpo(EXPO_PORT).then((ok) => {
  console.log(ok
    ? `[proxy] Expo web server up on :${EXPO_PORT}`
    : `[proxy] Warning: Expo not ready on :${EXPO_PORT}`
  );
});
