// Custom production server for Hostinger (Phusion Passenger) and any generic Node host.
//
// Hostinger's Node.js hosting loads an "application startup file" instead of running
// `npm start`; Passenger assigns the port via the PORT env var. This file boots Next.js
// in production mode and forwards every request (including middleware and API routes)
// to Next's request handler.
//
// Run `npm run build` first so the .next directory exists.

const { createServer } = require("node:http");
const { loadEnvConfig } = require("@next/env");
const next = require("next");

// Load .env files (Hostinger panel env vars in process.env still take precedence).
loadEnvConfig(process.cwd(), false);

const port = parseInt(process.env.PORT || "3000", 10);
const hostname = process.env.HOSTNAME || "0.0.0.0";

const app = next({ dev: false, hostname, port });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((req, res) => handle(req, res)).listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Kanews Feedback ready on http://${hostname}:${port}`);
    });
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error("Failed to start Next.js server:", err);
    process.exit(1);
  });
