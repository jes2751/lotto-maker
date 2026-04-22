/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/lotto-number-generator",
        destination: "/generate",
        permanent: true
      },
      {
        source: "/latest-lotto-results",
        destination: "/draws",
        permanent: true
      },
      {
        source: "/draw-analysis",
        destination: "/stats",
        permanent: true
      },
      {
        source: "/draw-analysis/:round",
        destination: "/draws/:round",
        permanent: true
      },
      {
        source: "/hot-numbers",
        destination: "/stats",
        permanent: true
      },
      {
        source: "/cold-numbers",
        destination: "/stats",
        permanent: true
      },
      {
        source: "/odd-even-pattern",
        destination: "/stats",
        permanent: true
      },
      {
        source: "/sum-pattern",
        destination: "/stats",
        permanent: true
      },
      {
        source: "/recent-10-draw-analysis",
        destination: "/stats",
        permanent: true
      },
      {
        source: "/lotto-buy-guide",
        destination: "/guides/how-to-buy-lotto-online",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
