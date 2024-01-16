import type { NextAuthConfig } from 'next-auth';
//import FirebirdAdapter from './app/lib/adapter-fb';
//import { getUserAuthById } from './app/lib/data-cm-authuser';
import { error } from 'console';

export const authConfig = {
  //adapter: FirebirdAdapter(),
  pages: {
    signIn: '/login',
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  //session: {    strategy: "jwt", maxAge: 1* 24 * 60 * 60 ,  },  //MANOS  // 1 day
  secret: process.env.NEXTAUTH_SECRET,
  //debug: process.env.NODE_ENV === "development",
  callbacks: {
   // async signIn({ user, credentials }) {
   //   return true;
   // },
    async authorized({ auth, request: { nextUrl } }) {
      //console.log('middleware - withAuth - callbacks - authorized');
      //console.log('req: ', req);
      //console.log('token: ', token);
      const isLoggedIn =  !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },

    // MANOS --> https://github.com/nextauthjs/next-auth/blob/main/apps/dev/nextjs/auth.config.ts
    //jwt({ token, trigger, session }) {
    //  if (trigger === "update") token.name = session.user.name
    //  return token
    //},
    
  
    /*
    async session ({ session, token, user })  {
      console.log({
         sessionToken: session,
      })

      if (token.sub && session.user) {
       // session.user.email = token.email;
       // session.user.username = token.userName;
       // session.user.accessToken = token.accessToken;       
        session.user.id = token.sub;
      }
      //session.user = token as any;

      return session;
    },

    //jwt: async ({ token, user, session, account, profile }) => {
      async jwt ({ token, session })  {
      //console.log('token');
      //console.log(token);
      if (!token.sub)  return token;
      try {
        //edw xtypaei  --> https://authjs.dev/reference/core/errors/#jwtsessionerror
      //  const existingUser = await getUserAuthById(token.sub);
        //if (!existingUser)  return token;
        //token.role = existingUser.role;
      } catch (error) {
         console.log('ERRRRRRRRROR ', error)
         throw new Error('Failed to GET USER IN TOKEN.');
      }  
        
      
      //if (user) {n

      //  return {
      //    ...token,
      //    ...user
      //  };
        
        //token.email = user.data.auth.email;
        //token.username = user.data.auth.userName;
        //token.user_type = user.data.auth.userType;
        //token.accessToken = user.data.auth.token;
        
      //}
      
      return token;
    },  
    */



  },
  //adapter: FirebirdAdapter(),
} satisfies NextAuthConfig;
