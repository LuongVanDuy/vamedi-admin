/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  images: {
    domains: ["api.fixelsphoto.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.vamedi.net",
        port: "",
        pathname: "/api/v1/file/view/**",
      },
      {
        protocol: "http",
        hostname: "72.167.151.240",
        port: "8080",
        pathname: "/v1/**",
      },
      {
        protocol: "https",
        hostname: "api.fixelsphoto.com",
        port: "",
        pathname: "/public/**",
      },
    ],
  },
};

module.exports = nextConfig;
