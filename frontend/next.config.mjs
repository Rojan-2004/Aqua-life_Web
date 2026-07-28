/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    appIsrStatus: false,
  },
  turbopack: {
    root: "/Users/rojanmainali/Documents/web learning/project_files_aqq/aqua_life_web_project/frontend",
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
      {
        source: "/item_photos/:path*",
        destination: "http://localhost:3000/item_photos/:path*",
      },
    ];
  },
};

export default nextConfig;