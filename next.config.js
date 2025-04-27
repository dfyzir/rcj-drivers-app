const nextI18NextConfig = require("./next-i18next.config.js");
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["mui-tel-input"],
  i18n: nextI18NextConfig.i18n,
};

module.exports = nextConfig;
