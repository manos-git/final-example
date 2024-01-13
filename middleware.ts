import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
//import  authConfig  from "@/auth.config";


export default NextAuth(authConfig).auth;
/* or
const { auth } = NextAuth(authConfig);
export default auth((req) => {
  const isLoggedIn = !!req?.auth;
  console.log("ROUTE: ", req.nextUrl.pathname);
  console.log("IS LOGGEDIN: ", isLoggedIn);
})
*/

import { NextResponse, type NextRequest } from "next/server";  // for use cors

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  //matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|.*\\.jpg$).*)'],
};


// Config Cors
/*
const corsOptions: {
  allowedMethods: string[];
  allowedOrigins: string[];
  allowedHeaders: string[];
  exposedHeaders: string[];
  maxAge?: number;
  credentials: boolean;
} = {
  allowedMethods: (process.env?.ALLOWED_METHODS || "").split(","),
  allowedOrigins: (process.env?.ALLOWED_ORIGIN || "").split(","),
  allowedHeaders: (process.env?.ALLOWED_HEADERS || "").split(","),
  exposedHeaders: (process.env?.EXPOSED_HEADERS || "").split(","),
  maxAge: process.env?.MAX_AGE && parseInt(process.env?.MAX_AGE) || undefined, // 60 * 60 * 24 * 30, // 30 days
  credentials: process.env?.CREDENTIALS == "true",
};
*/

// Middleware  --> TO SXOLIASA GIATI DEN MPAINEI STO AUTH.CONFIG NA PERASEI STO /dashboaed
// ========================================================
// This function can be marked `async` if using `await` inside
/*
export async function middleware(request: NextRequest) {
  // Response
  const response = NextResponse.next();

  // Allowed origins check
  const origin = request.headers.get('origin') ?? '';
  if (corsOptions.allowedOrigins.includes('*') || corsOptions.allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  // Set default CORS headers
  response.headers.set("Access-Control-Allow-Credentials", corsOptions.credentials.toString());
  response.headers.set("Access-Control-Allow-Methods", corsOptions.allowedMethods.join(","));
  response.headers.set("Access-Control-Allow-Headers", corsOptions.allowedHeaders.join(","));
  response.headers.set("Access-Control-Expose-Headers", corsOptions.exposedHeaders.join(","));
  response.headers.set("Access-Control-Max-Age", corsOptions.maxAge?.toString() ?? "");

  // Return
  return response;
}
*/
  // add the CORS headers to the response
  /*
  res.headers.append('Access-Control-Allow-Credentials', "true")
  res.headers.append('Access-Control-Allow-Origin', '*') // replace this your actual origin
  res.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT')
  res.headers.append(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  return res
}
*/

/*manos for getip and store it in cookies
import { NextRequest, NextFetchEvent, NextResponse } from "next/server";
export async function middleware(request: NextRequest, _next: NextFetchEvent) {
  const res = NextResponse.next();
  let ip = request.ip ?? request.headers.get('x-real-ip');
  
  const forwardedFor = request.headers.get('x-forwarded-for')
  if(!ip && forwardedFor){
    ip = forwardedFor.split(',').at(0) ?? 'Unknown'
  }
  
  if(ip){
    res.cookies.set("user-ip", ip, {
      httpOnly: false,
    });
  }
  
  return res;
}
*/