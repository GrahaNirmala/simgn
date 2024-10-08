/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/admin/login",
        permanent: true,
      },
      {
        source: "/app",
        destination: "/app/dashboard",
        permanent: true,
      },
      {
        source: "/admin",
        destination: "/admin/account",
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
