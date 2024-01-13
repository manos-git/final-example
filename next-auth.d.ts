//manos  -->   https://blog.stackademic.com/next-js-13-authentication-with-nextauth-js-app-router-typescript-641058805bc3
import "next-auth";

declare module "next-auth" {
  interface User {
    id: number;
    email: string;
    name: string;
    role: string;
    accessToken?: string;  //optional
    refreshToken?: string;  //optional
    accessTokenExpires?: number;  //optional
  }

  interface Session extends DefaultSession {
    user: User;
    expires: string;
    error: string;
  }
}
