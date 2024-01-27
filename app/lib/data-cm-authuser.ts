//import { sql } from '@vercel/postgres';
//import { getConnection,  disconnectDb, runQuery } from './firebirdDb';
import { getConn, queryRun, statmentExec, closeConn } from './firebird';
import { redirect } from 'next/navigation';
import { ErrorCM, User } from './definitions-cm';

//***** AUTH USERS *****/
export async function getUserAuthById(id : string): Promise<User | undefined> {
  var oneUser: User; // | undefined;  //SWSTO
  try  {    
    const db = await getConn();
    console.log('Connected to DB!');
    const selSql = `SELECT id, name, email, '' as emailVerified, image,  role FROM AUTH_USERS  WHERE ID='${id}'`;
    const row = await queryRun(db, selSql);
    await closeConn(db);
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

export async function userEmailUnique(email : string): Promise<boolean> {  
  try  {    
    const db = await getConn();
    console.log('Connected to DB!');
    const selSql = `SELECT id FROM AUTH_USERS  WHERE ID='${email}'`;
    const row = await queryRun(db, selSql)  ;
    await closeConn(db);
    if (row && row !== null && row.length>0)  {      
      return true
    } else {
       return false;
    }

  } catch (error) {
    //console.error('Failed to fetch user:', error);
    return false;
  }
}



export async function createAuthUser(email: string, password: string, name: string): Promise<boolean> {  
  try {
    //sqlIns = ` INSERT INTO invoices (customer_id, amount, status, date)  VALUES (${customerId}, ${amountInCents}, ${status}, ${date}) `;
    const sqlIns = ` INSERT INTO AUTH_USERS (name, email, password, role, display_name)  VALUES (?,?,?,?,?)`;
    const db = await getConn();    
    await statmentExec(db, sqlIns, [name, email, password, 'user', name] )  ;
    await closeConn(db);
    return true  //"User created" 
    // Revalidate the cache for the invoices page and redirect the user.
    //revalidatePath('/dashboard/invoices');
    redirect('/login');    
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return  false //"Database Error: Failed to Create User."
  }
 
};