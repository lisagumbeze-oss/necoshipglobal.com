/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  /**
   * Optional isolated production output directory.
   * Concurrent `next dev` rewrites the default `.next` folder and can remove
   * production artifacts such as `routes-manifest.json`, causing `next start` to fail.
   * Use: `$env:NEXT_DIST_DIR='.next-prod'; npx next build` then the same env for `next start`.
   */
  distDir: process.env.NEXT_DIST_DIR || ".next"
};

module.exports = nextConfig;
