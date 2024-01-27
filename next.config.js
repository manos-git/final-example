/** @type {import('next').NextConfig} */
const nextConfig = { 
  //env: {
  //  SESSION_MAX_AGE: process.env.SESSION_MAX_AGE,
  //},
  images: {
    //formats: ['image/avif', 'image/webp'],    
    //minimumCacheTTL: 60,  // cache optimized images for 60 seconds    
    /*
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        port: '',
        pathname: '/models/**',
      },
    ],
    */
  },
  //experimental : {serverActions: true,},
  reactStrictMode: true,
  swcMinify: true,
  /* 
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8502/:path*' // Proxy to Backend
      }
    ]
  },
  */
  // manos to pio katw, den xreiazetai , na mpei se comments
  async headers() {
    return [
        {
            // matching all API routes
            source: "/api/:path*",
            headers: [
                { key: "Access-Control-Allow-Credentials", value: "true" },
                { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
                { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
                { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
            ]
        }
    ]
},
/* Nextjs remove console.log production
compiler: {
  removeConsole:process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
 },
*/

};



module.exports = nextConfig;
