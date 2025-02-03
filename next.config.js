// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   images: {
//     // domains: ['ssostaging.hp.gov.in'],
//     domains: ['localhost', 'sso.hp.gov.in'],

//   },
// }

// module.exports = nextConfig

/** @type {import('next').NextConfig} */
const webpack = require("webpack");
const nextConfig = {
  reactStrictMode: true,
  basePath: process.env.NEXT_PUBLIC_API_ENDPOINT || "",
  assetPrefix: process.env.NEXT_PUBLIC_API_ENDPOINT || "",
  // basePath: "",
  // assetPrefix: "",
  reactStrictMode: true,
  images: {
    // domains: ['ssostaging.hp.gov.in'],
    // domains: ["localhost", "himstaging2.hp.gov.in", 'himparivaranalytics.hp.gov.in'], // staging
    domains: ["localhost", "sso.hp.gov.in", "himstaging2.hp.gov.in", 'cdn.myscheme.in', 'himparivaranalytics.hp.gov.in'], // production
  },
};

module.exports = nextConfig;
