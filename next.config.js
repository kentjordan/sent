/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [{ hostname: "picsum.photos" }],
  },
  env: {
    WS_GATEWAY_CHAT: "http://192.168.0.105:3500/chat",
    WS_GATEWAY_INBOX: "http://192.168.0.105:3500/inbox",
    API_HOSTNAME: "http://192.168.0.105:3001",
  },
};

module.exports = nextConfig;
