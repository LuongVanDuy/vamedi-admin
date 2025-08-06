/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.vamedi.net",
        port: "",
        pathname: "/api/v1/file/view/**", // Đường dẫn đến tệp ảnh trên máy chủ
      },
    ],
  },
};

module.exports = nextConfig;
