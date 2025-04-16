/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "deforge-jlkmp.sevalla.storage",
      },
    ],
  },
};

export default nextConfig;
