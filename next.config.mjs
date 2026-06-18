/** @type {import('next').NextConfig} */
const nextConfig = {
  // Plain build → `.next`, served by `next start`. This is the most compatible
  // setup for Hostinger's Node.js application hosting (persistent process that
  // runs `npm start`). `next start` honors the PORT env var Hostinger assigns.
  // better-sqlite3 is a native module; keep it external to the server bundle.
  serverExternalPackages: ["better-sqlite3"],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
