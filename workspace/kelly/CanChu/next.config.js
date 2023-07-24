module.exports = {
  env: {
    API_DOMAIN: process.env.API_DOMAIN
  },
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // eslint-disable-next-line no-param-reassign
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        react: require.resolve('react')
      }
    }
    return config
  }
  // pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js']
}
