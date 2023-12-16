import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { sql } from '@vercel/postgres';
import { unknown, z } from 'zod';
//import type { User } from '@/app/lib/definitions';
import { authConfig } from './auth.config';

// firebird way
//const { getConnection,  beginTransaction,  commitTransaction,   disconnectDb } = require('./lib/firebirdDb');
import { getConnection,  beginTransaction,  commitTransaction,   disconnectDb } from './app/lib/firebirdDb';
import type { User } from '@/app/lib/data-definitions';
//import interface { User } from '@/app/lib/data-definitions';



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

  

async function getUser(email: string, pass: string): Promise<User | undefined> {
  var user: User | undefined;
  //var rec: User | undefined;
  try  {    
    const dbconn = await getConnection();
    console.log('Connected to DB!');
    const sql = `SELECT USER_ID as id, DISPNAME, UNAME as name, '' as email, UPASS, ROLE_LEVEL FROM users WHERE UNAME='${email}' AND UPASS= '${pass}'`;
    /*  */
    
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


  


export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          //.object({ email: z.string().email(), password: z.string().min(6) })
          .object({ email: z.string(), password: z.string().min(4) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          const user = await getUser(email, password);
          if (!user) return null;

          const passwordsMatch = true; //await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});
