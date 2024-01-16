//manos  -->   https://blog.stackademic.com/next-js-13-authentication-with-nextauth-js-app-router-typescript-641058805bc3
//import "next-auth";
// 2. https://blog.henricook.com/how-i-got-the-accesstoken-from-the-provider-into-my-session-on-next-auth-v5-in-a-nextjs-app-with-typescript-and-appdir
import NextAuth, { DefaultSession } from "next-auth"
import {DefaultJWT} from "@auth/core/jwt";

declare module "next-auth" {
  interface User {
    id: number;
    email: string;
    name: string;
    role?: string;  //optional
    accessToken?: string;  //optional
    refreshToken?: string;  //optional
    accessTokenExpires?: number;  //optional
  }

  // Extend session to hold the access_token
  interface Session extends DefaultSession {
    user: User;
    expires: string;
    error: string;
    access_token: string & DefaultSession;
  }

  // Extend token to hold the access_token before it gets put into session   
  interface JWT {
    access_token: string & DefaultJWT;
  }  

}
