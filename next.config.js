/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 静态导出配置（仅用于 GitHub Pages）
  output: process.env.BUILD_STATIC === 'true' ? 'export' : undefined,
  basePath: process.env.BUILD_STATIC === 'true' ? '/wenontheroad' : '',
  images: {
    unoptimized: process.env.BUILD_STATIC === 'true',
  },
  trailingSlash: process.env.BUILD_STATIC === 'true',
  // 排除 API 路由和管理页面
  ...(process.env.BUILD_STATIC === 'true' && {
    experimental: {
      missingSuspenseWithCSRBailout: false,
    },
  }),
}

module.exports = nextConfig
