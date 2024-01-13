//import { sql } from '@vercel/postgres';
//import { getConnection,  disconnectDb, runQuery } from './firebirdDb';
import { getConn,  queryRun } from './firebird';

import { ErrorCM, User } from './definitions-cm';

//***** AUTH USERS *****/
export async function getUserAuthById(id : string): Promise<User | undefined> {
  var oneUser: User; // | undefined;  //SWSTO
  try  {    
    const db = await getConn();
    console.log('Connected to DB!');
    const selSql = `SELECT id, name, email, '' as emailVerified, image,  role FROM AUTH_USERS  WHERE ID='${id}'`;

    const row = await queryRun(db, selSql)  ;
    if (row && row !== null && row.length>0)  {      
      oneUser = { id: row[0].id,  name: row[0].name,  email: row[0].email, // emailVerified: row[0].emailVerified,
        image:row[0].IMAGE, password: 'maimou',  role: 'admin'
        //rolelevel: row[0].ROLE_LEVEL,  
       // , accessToken: 'string', refreshToken: 'string', accessTokenExpires: 1      
      };
        //ID, NAME, EMAIL, '' as emailVerified, IMAGE, "password", "ROLE" FROM AUTH_USERS r

      return  oneUser; 
    } else {
       return undefined;
    }

  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

