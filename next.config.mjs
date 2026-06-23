/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    appIsrStatus: false,
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "http://localhost:3000/api/v1/:path*",
      },
      {
        source: "/profile_pictures/:path*",
        destination: "http://localhost:3000/profile_pictures/:path*",
      },
    ];
  },
};

export default nextConfig;