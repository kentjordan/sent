/** @type {import('next').NextConfig} */

const setVariable = ({ prod, dev }) => {
  return process.env.NODE_ENV === "production" ? prod : dev;
};

const API_PROTOCOL = setVariable({
  dev: "http",
  prod: "http",
});

const REST_HOSTNAME = setVariable({
  dev: "localhost:3001",
  prod: "kentjordan.xyz/rest",
});

const WS_HOSTNAME = setVariable({
  dev: "localhost:3500",
  prod: "kentjordan.xyz/ws",
});

const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [{ hostname: "picsum.photos" }],
  },
  env: {
    WS_GATEWAY_CHAT: `${API_PROTOCOL}://${WS_HOSTNAME}/chat`,
    WS_GATEWAY_INBOX: `${API_PROTOCOL}://${WS_HOSTNAME}/inbox`,
    API_HOSTNAME: `${API_PROTOCOL}://${REST_HOSTNAME}`,
  },
};

module.exports = nextConfig;
