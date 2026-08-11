/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Frames are served as static assets from /public; no remote sources needed.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
