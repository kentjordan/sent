/** @type {import('next').NextConfig} */

const PROD_API_PROTOCOL = "https";

const PROD_API_HOSTNAME = "localhost";
const PROD_WS_HOSTNAME = "localhost:3500";

const DEV_API_PROTOCOL = "http";

const DEV_API_HOSTNAME = "localhost:3001";
const DEV_WS_HOSTNAME = "localhost:3500";

const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [{ hostname: "picsum.photos" }],
  },
  env: {
    WS_GATEWAY_CHAT: `${DEV_API_PROTOCOL}://${DEV_WS_HOSTNAME}/chat`,
    WS_GATEWAY_INBOX: `${DEV_API_PROTOCOL}://${DEV_WS_HOSTNAME}/inbox`,
    API_HOSTNAME: `${DEV_API_PROTOCOL}://${DEV_API_HOSTNAME}`,
  },
};

module.exports = nextConfig;
