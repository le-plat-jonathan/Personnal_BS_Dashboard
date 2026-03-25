// Mini proxy BS API — à lancer sur la machine à la maison
// Usage: node proxy-server.js

const http = require("http");

const API_KEY = process.env.BRAWL_STARS_API_KEY;
const BS_BASE = "https://api.brawlstars.com/v1";
const PORT = 3001;

if (!API_KEY) {
  console.error("❌ BRAWL_STARS_API_KEY manquant. Lance avec:");
  console.error(
    "   $env:BRAWL_STARS_API_KEY='ta_clé' ; node proxy-server.js   (PowerShell)"
  );
  process.exit(1);
}

const server = http.createServer(async (req, res) => {
  const targetUrl = `${BS_BASE}${req.url}`;
  console.log(`→ ${req.method} ${targetUrl}`);

  try {
    const response = await fetch(targetUrl, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.text();
    res.writeHead(response.status, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    });
    res.end(data);
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: err.message }));
  }
});

server.listen(PORT, () => {
  console.log(`✅ BS Proxy démarré sur http://localhost:${PORT}`);
  console.log(`   En attente du tunnel Cloudflare...`);
});
