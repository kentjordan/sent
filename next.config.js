/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [{ hostname: "picsum.photos" }],
  },
  env: {
    WS_GATEWAY_CHAT: "http://localhost:3500/chat",
    WS_GATEWAY_INBOX: "http://localhost:3500/inbox",
    API_HOSTNAME: "http://localhost:3001",
  },
};

module.exports = nextConfig;
