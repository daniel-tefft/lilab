/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // three / drei ship ESM that Next can transpile directly.
  transpilePackages: ['three'],
  webpack: (config) => {
    // Allow importing GLSL-ish assets if ever needed; keep GLB handled by file-loader default.
    return config;
  },
};

export default nextConfig;
