/** @type {import('next').NextConfig} */

const setVariable = ({ prod, dev }) => {
  return process.env.NODE_ENV === "production" ? prod : dev;
};

const API_PROTOCOL = setVariable({
  dev: "http",
  prod: "https",
});

const REST_HOSTNAME = setVariable({
  dev: "localhost:3001",
  prod: "13.215.30.232/rest",
});

const WS_HOSTNAME = setVariable({
  dev: "localhost:3500",
  prod: "13.215.30.232/ws",
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
