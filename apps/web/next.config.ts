import type { NextConfig } from 'next';
const config:NextConfig={output:'standalone',reactStrictMode:true,images:{remotePatterns:[{protocol:'https',hostname:'images.unsplash.com'},{protocol:'http',hostname:'localhost'}]},experimental:{typedRoutes:true}};
export default config;
