module.exports = {
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
  },
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js']
}
