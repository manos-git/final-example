    //import 'server-only';  // manos
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
    import GoogleProvider from 'next-auth/providers/google'; // manos
//import bcrypt from 'bcrypt';
//import { sql } from '@vercel/postgres';
    import type { Session } from 'next-auth/types';  //manos
import { unknown, z } from 'zod';
//import type { User } from '@/app/lib/definitions';
import { authConfig } from './auth.config';

// firebird way
//const { getConnection,  beginTransaction,  commitTransaction,   disconnectDb } = require('./lib/firebirdDb');
//import { getConnection,  beginTransaction,  commitTransaction,   disconnectDb } from './app/lib/firebirdDb';

import { getConn, queryRun } from './app/lib/firebird';
import type { User } from '@/app/lib/definitions-cm';
import { getUserAuthById } from './app/lib/data-cm-authuser';

// import FirebirdAdapter from './app/lib/adapter-fb';
//import interface { User } from '@/app/lib/data-definitions';

 //import { SESSION_MAX_AGE,} from '@path/to/config'; // manos
 const SESSION_MAX_AGE = process.env.SESSION_MAX_AGE ; 
  
//import  AuthFirebirdAdapter  from '@/app/lib/auth-adapter-fb';  // manos
//import { generateId } from './app/lib/helpers';

/* postgres
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
*/
/* firebird */
/*
async function getUser(email: string, pass: string): Promise<User | undefined> {
  var user: User;
  try  {    
    const dbconn = await getConnection();
    console.log('Connected to DB!');
    const sql = `SELECT USER_ID as id, DISPNAME, UNAME as name, '' as email, UPASS, ROLE_LEVEL FROM users WHERE UNAME='${email}' AND UPASS= '${pass}'`;
    //const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    dbconn.query(sql, (err:any, res:any) => {
      if (err) {        
        disconnectDb(dbconn);
      } else {
          if (res) {
            user== res[0];
          }
        disconnectDb(dbconn);
      }
    });
    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
*/  



async function getUser(email: string, pass: string): Promise<User | undefined> {
  var oneUser: User; // o User einai dhlvmenos sto  app\lib\definitions-cm.ts  & sto  next-auth.d.ts
  try  {    
    const db = await getConn();
    console.log('Connected to DB!');
    const selSql = `SELECT USER_ID as id, DISPNAME, UNAME as name_, '' as email, UPASS as password, ROLE_LEVEL, '' as IMAGE FROM users WHERE UNAME='${email}' AND UPASS= '${pass}'`;
    /*      
    const getloginuser = async () => {
      return new Promise<User|undefined>((resolve, reject)=> {
        dbconn.query(sql, (err:any, res:any) => {
          if (err) {        
            disconnectDb(dbconn);
            reject(undefined);
          } else {
              if (res && res.length > 0) {
                //user== res[0];
                 user = { id: res[0].id,  name: res[0].name,  email: res[0].UPASS,
                        dispname: res[0].DISPNAME, password: res[0].UPASS,  rolelevel: res[0].ROLE_LEVEL };
              }
            disconnectDb(dbconn);
            resolve(user);
          }

          
        })
      });
    };
    return await getloginuser();  
    */
        
        //return await queryRun(db, sql)  ;
       
          const row = await queryRun(db, selSql)  ;
          if (row && row !== null && row.length>0)  {      
            // kalo alla gyrnaei array
            /*
            oneUser = row.map(( usr: { id: string;   name_: string;  email: string;   password: string}) => ({      
              name: usr.name_,  
              ...usr,                      
          
            }));       
            */
            oneUser = { id: row[0].id,  name: row[0].name,  email: row[0].UPASS,  // {dispname: row[0].DISPNAME,
               password: row[0].UPASS,  image:row[0].IMAGE, role: 'admin'
               //,  accessToken: 'string', refreshToken: 'string', accessTokenExpires: 1
              };

            return  oneUser; 
          }        

    
    /*
    let pr = new Promise((resolve, reject)=> {
      dbconn.query(sql, (err:any, res:any) => {
        if (err) {        
          disconnectDb(dbconn);
          reject('');
        } else {
            if (res) {
              //user== res[0];
               user = { id: res[0].id,  name: res[0].name,  email: res[0].UPASS,
                      dispname: res[0].DISPNAME, password: res[0].UPASS,  rolelevel: res[0].ROLE_LEVEL };
            }
          disconnectDb(dbconn);
        }

        resolve(user);
      })
    });
   
    pr.then((u)=> {return u}).catch((e)=> {return undefined})
    return undefined;
    */
    


    /*
    dbconn.query(sql, (err:any, res:any) => {
      if (err) {        
        disconnectDb(dbconn);
      } else {
          if (res) {
            //user== res[0];
             user = { id: res[0].id,  name: res[0].name,  email: res[0].UPASS,
                    dispname: res[0].DISPNAME, password: res[0].UPASS,  rolelevel: res[0].ROLE_LEVEL };
          }
        disconnectDb(dbconn);
      }
    });
    return user;
    */

/*
    async function getrec() {
      await dbconn.query(sql, (err:any, res:any) => {
        if (err) {        
          disconnectDb(dbconn);          
        } else {
            if (res) {
              //user== res[0];
               user = { id: res[0].id,  name: res[0].name,  email: res[0].UPASS,
                      dispname: res[0].DISPNAME, password: res[0].UPASS,  rolelevel: res[0].ROLE_LEVEL };
            }
          disconnectDb(dbconn);
        }

        return user;
      })
    };
   
    getrec().then((u)=> {return u}).catch((e)=> {return undefined})
    //return undefined;
*/


    

  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

//+++++++++++++++++++++++++++++++

//+++++++++++++++++++++++++++++++


// https://authjs.dev/guides/providers/credentials  
//import { getIP } from '@/app/libutilities';

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  //adapter:  FirebirdAdapter(), //  AuthFirebirdAdapter(),
  //session: { strategy: "jwt", maxAge: 1* 24 * 60 * 60 ,  },  //MANOS  // 1 day
  //session: {  strategy: 'database',   maxAge: 1, generateSessionToken: () => generateId().token(), },  // process.env.SESSION_MAX_AGE
  ...authConfig,

  callbacks: {  // TA CALLBACKS YPARXOUN KAI STO uth.config.js kai GINONTAI MERGE
    /*
    async session ({ session, token, user })  {
      console.log({         sessionToken: session,      });      
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      //session.user = token as any;
      return session;
    },
    */

    //jwt: async ({ token, user, session, account, profile }) => {
      async jwt ({ token, user, session })  {
        
       // 2 EDW NA TO KANW OPWS STO PARADEIGMA  --> https://blog.stackademic.com/next-js-13-authentication-with-nextauth-js-app-router-typescript-641058805bc3
        
      if (!token.sub)  return token;
      try {
        //edw xtypaei AN TO VALV STO auth.config.js 
        const existingUser = await getUserAuthById(token.sub);
        if (!existingUser)  return token;
       // token.role = existingUser.role;
        if (existingUser) {
          token.accessToken = existingUser.accessToken;
          token.refreshToken = existingUser.refreshToken;
          token.accessTokenExpires = existingUser.accessTokenExpires;
          token.role = existingUser.role;
          token.id = existingUser.id;
        }     


      } catch (error) {
         console.log('ERRRRRRRRROR ', error)
         throw new Error('Failed to GET USER IN TOKEN.');
      }  
        
      console.log("jwt callback ", { token, user, session });
       
      return token;
      },  

      //  The session receives the token from JWT
      async session({ session, token, user }) {
        console.log("session callback ", { token, user, session });

        return {
          ...session,
          user: {
            ...session.user,
            accessToken: token.accessToken as string,
            refreshToken: token.refreshToken as string,
            //role: token.role,
            //id: token.id,
          },
          error: token.error,
        };
      },
  },


  providers: [
    Credentials({
      //credentials: {
      //  username: { label: "Username", type: "text", placeholder: "jsmith" },
      //  password: {  label: "Password", type: "password" }
      //},
      //profile(profile) {
      //  return { role: profile.role ?? "user", ... }
      //},

      async authorize(credentials) {
        const parsedCredentials = z
          //.object({ email: z.string().email(), password: z.string().min(6) })
          .object({ email: z.string(), password: z.string().min(4) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
           
          const user = await getUser(email, password);    //-- > EDW NA XTYPAW TO AUT_USERS
          if (!user) return null;

          // if (user && bcrypt.compareSync(password, user.passwordHash))  apo paradeigma , alloiws to pio katw
          const passwordsMatch = true; //await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }

        console.log('Invalid credentials');
        return null;
      },
    }),

    /* manos   
    GoogleProvider({
      clientId: '<id>',
      clientSecret: '<secret>',
      authorization: {
        params: {
          scope: 'email',
        },
      },
      //httpOptions: {      timeout: 10000,      },
      async profile(profile) {
        //...
        return profile;
      },
    }),
    */  
  ],
  
  /*//manos
  callbacks: {
    async jwt({ user }) {
      // Override default jwt callback behavior.
      // Create a session instead and then return that session token for use in the
      // `jwt.encode` callback below.
      const session = await AuthFirebirdAdapter().createSession?.({
        expires: new Date(Date.now() + 1 * 1000),  // process.env.SESSION_MAX_AGE 
        sessionToken: generateId().token(),
        userId: user.id,
      });

      return { id: session?.sessionToken };
    },
    async session({ session: defaultSession, token, user }) {
      // Make our own custom session object.
      const session: Session = {      
        user: user, // { ... },
        expires: defaultSession.expires,
      };

      return session;
    },
  },
  jwt: {
    async encode({ token }) {
      // This is the string returned from the `jwt` callback above.
      // It represents the session token that will be set in the browser.
      return token?.id as unknown as string;
    },
    async decode() {
      // Disable default JWT decoding.
      // This method is really only used when using the email provider.
      return null;
    },
  },
  */
  
  /*
  session: {
    strategy: 'jwt',
    maxAge: 1 * 24 * 60 * 60, // 1 day
  },

  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.email = user.data.auth.email;
        token.username = user.data.auth.userName;
        token.user_type = user.data.auth.userType;
        token.accessToken = user.data.auth.token;
      }

      return token;
    },
    session: ({ session, token, user }) => {
      if (token) {
        session.user.email = token.email;
        session.user.username = token.userName;
        session.user.accessToken = token.accessToken;
      }
      return session;
    },
  },
*/
 // ADD ADDITIONAL INFORMATION TO SESSION
 /*
callbacks: {
  // async jwt({ token, user }) {
  //   if (user) {
  //     token.username = user.username;
  //     token.img = user.img;
  //   }
  //   return token;
  // },
   async session({ session, token }) {
     if (token) {
       session.user.username = token.username;
       session.user.img = token.img;
     }
     return session;
   },
 },
*/



});
