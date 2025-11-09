/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Allows next to build a self-contained app for Docker, making deployment easier
};

export default nextConfig;
