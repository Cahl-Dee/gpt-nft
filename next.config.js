const withNextEnv = require("next-env");
const dotenvLoad = require("dotenv-load");

dotenvLoad();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = withNextEnv(nextConfig);

