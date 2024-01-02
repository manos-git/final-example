import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { sql } from '@vercel/postgres';
import { unknown, z } from 'zod';
//import type { User } from '@/app/lib/definitions';
import { authConfig } from './auth.config';

// firebird way
//const { getConnection,  beginTransaction,  commitTransaction,   disconnectDb } = require('./lib/firebirdDb');
//import { getConnection,  beginTransaction,  commitTransaction,   disconnectDb } from './app/lib/firebirdDb';

import { getConn, queryRun } from './app/lib/firebird';
import type { User } from '@/app/lib/definitions-cm';
//import interface { User } from '@/app/lib/data-definitions';


// import jwt from 'jsonwebtoken';




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

/*
interface UserIntf  {
  id: string;
  name: string;
  email: string;
  //image_url: string;
  //USER_ID: string;
  DISPNAME: string;
  //UNAME: string;
  UPASS: string;
  ROLE_LEVEL: BigInteger;
};
*/
  

async function getUser(email: string, pass: string): Promise<User | undefined> {
  var oneUser: User; // | undefined;  //SWSTO
  try  {    
    const db = await getConn();
    console.log('Connected to DB!');
    const selSql = `SELECT USER_ID as id, DISPNAME, UNAME as name_, '' as email, UPASS as password, ROLE_LEVEL FROM users WHERE UNAME='${email}' AND UPASS= '${pass}'`;
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
            oneUser = row.map(( usr: { id: string;   name_: string;  email: string;   password: string}) => ({      
              name: usr.name_,  
              ...usr,                      
            }));       
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


export const { auth, signIn, signOut } = NextAuth({
  //session: { strategy: "jwt", maxAge: 1* 24 * 60 * 60 ,  },  //MANOS  // 1 day
  ...authConfig,
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

          const user = await getUser(email, password);
          if (!user) return null;

          // if (user && bcrypt.compareSync(password, user.passwordHash))  apo paradeigma , alloiws to pio katw
          const passwordsMatch = true; //await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
  
  
  
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
