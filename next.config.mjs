import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Plain build → `.next`, served by `next start`. This is the most compatible
  // setup for Hostinger's Node.js application hosting (persistent process that
  // runs `npm start`). `next start` honors the PORT env var Hostinger assigns.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default withNextIntl(nextConfig);
