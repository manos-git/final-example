/**
*  Database Firebird adapter 
* created from @auth/pg-adapter pg
*/


import type {
    Adapter,
    AdapterUser,
    VerificationToken,
    AdapterSession,
  } from "@auth/core/adapters"

  //import type { Pool } from "pg"
  import { getConn,  queryRun, statmentExec } from './firebird';
  
  export function mapExpiresAt(account: any): any {
    const expires_at: number = parseInt(account.expires_at)
    return {
      ...account,
      expires_at,
    }
  }
  
  /**
   * ## Setup
   *
   * The SQL schema for the tables used by this adapter is as follows. Learn more about the models at our doc page on [Database Models](https://authjs.dev/getting-started/adapters#models).
   *
   * ```sql
   * CREATE TABLE verification_token
   * (
   *   identifier TEXT NOT NULL,
   *   expires TIMESTAMPTZ NOT NULL,
   *   token TEXT NOT NULL,
   *
   *   PRIMARY KEY (identifier, token)
   * );
   *
   * CREATE TABLE accounts
   * (
   *   id SERIAL,
   *   "userId" INTEGER NOT NULL,
   *   type VARCHAR(255) NOT NULL,
   *   provider VARCHAR(255) NOT NULL,
   *   "providerAccountId" VARCHAR(255) NOT NULL,
   *   refresh_token TEXT,
   *   access_token TEXT,
   *   expires_at BIGINT,
   *   id_token TEXT,
   *   scope TEXT,
   *   session_state TEXT,
   *   token_type TEXT,
   *
   *   PRIMARY KEY (id)
   * );
   *
   * CREATE TABLE sessions
   * (
   *   id SERIAL,
   *   "userId" INTEGER NOT NULL,
   *   expires TIMESTAMPTZ NOT NULL,
   *   "sessionToken" VARCHAR(255) NOT NULL,
   *
   *   PRIMARY KEY (id)
   * );
   *
   * CREATE TABLE users
   * (
   *   id SERIAL,
   *   name VARCHAR(255),
   *   email VARCHAR(255),
   *   "emailVerified" TIMESTAMPTZ,
   *   image TEXT,
   *
   *   PRIMARY KEY (id)
   * );
   *
   * ```
   *
   * ```typescript title="auth.ts"
   * import NextAuth from "next-auth"
   * import GoogleProvider from "next-auth/providers/google"
   * import PostgresAdapter from "@auth/pg-adapter"
   * import { Pool } from 'pg'
   *
   * const pool = new Pool({
   *   host: 'localhost',
   *   user: 'database-user',
   *   max: 20,
   *   idleTimeoutMillis: 30000,
   *   connectionTimeoutMillis: 2000,
   * })
   *
   * export default NextAuth({
   *   adapter: PostgresAdapter(pool),
   *   providers: [
   *     GoogleProvider({
   *       clientId: process.env.GOOGLE_CLIENT_ID,
   *       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
   *     }),
   *   ],
   * })
   * ```
   *
   */
  export default function FirebirdAdapter(): Adapter {    //client: Pool
    return {
      async createVerificationToken(
        verificationToken: VerificationToken
      ): Promise<VerificationToken> {
        const { identifier, expires, token } = verificationToken
        const sql = `
          INSERT INTO auth_verification_token ( identifier, expires, token ) 
          VALUES ($1, $2, $3)
          `
        const db = await getConn();  
        await statmentExec(db, sql, [identifier, expires, token]);
        //await client.query(sql, [identifier, expires, token])
        return verificationToken

      },
      async useVerificationToken({
        identifier,
        token,
      }: {
        identifier: string
        token: string
      }): Promise<VerificationToken> {
        const sql = `delete from auth_verification_token
        where identifier = $1 and token = $2
        RETURNING identifier, expires, token `
        //const result = await client.query(sql, [identifier, token])
        const db = await getConn();  
        const result = await statmentExec(db, sql, [identifier, token]);
        return result.rowCount !== 0 ? result.rows[0] : null
      },
  
      async createUser(user: Omit<AdapterUser, "id">) {
        const { name, email, emailVerified, image } = user
        const sql = `
          INSERT INTO auth_users (name, email, "emailVerified", image) 
          VALUES ($1, $2, $3, $4) 
          RETURNING id, name, email, "emailVerified", image`
        
        /* const result = await client.query(sql, [
          name,
          email,
          emailVerified,
          image,
        ])*/
        const db = await getConn();  
        const result = await statmentExec(db, sql, [name, email, emailVerified, image]);

        return result.rows[0]
      },
      async getUser(id) {
        const sql = `select * from auth_users where id = $1`
        try {
          //const result = await client.query(sql, [id])          
          const db = await getConn();
          const result = await queryRun(db, sql, [id]) ;
          return result.rowCount === 0 ? null : result.rows[0]   
        } catch (e) {
          return null
        }
      },
      async getUserByEmail(email) {
        const sql = `select * from auth_users where email = $1`
        //const result = await client.query(sql, [email])
        const db = await getConn();
        const result = await queryRun(db, sql, [email]) ;        
        return result.rowCount !== 0 ? result.rows[0] : null
      },
      async getUserByAccount({
        providerAccountId,
        provider,
      }): Promise<AdapterUser | null> {
        const sql = `
            select u.* from auth_users u join auth_accounts a on u.id = a."userId"
            where 
            a.provider = $1 
            and 
            a."providerAccountId" = $2`
        const db = await getConn();
        const result = await queryRun(db, sql, [provider, providerAccountId]) ;         
        //const result = await client.query(sql, [provider, providerAccountId])        
        return result.rowCount !== 0 ? result.rows[0] : null
      },
      async updateUser(user: Partial<AdapterUser>): Promise<AdapterUser> {
        const fetchSql = `select * from auth_users where id = $1`
        //const query1 = await client.query(fetchSql, [user.id])
        const db = await getConn();
        const query1 = await queryRun(db, fetchSql, [user.id]) ;         

        const oldUser = query1.rows[0]
  
        const newUser = {
          ...oldUser,
          ...user,
        }
  
        const { id, name, email, emailVerified, image } = newUser
        const updateSql = `
          UPDATE auth_users set
          name = $2, email = $3, "emailVerified" = $4, image = $5
          where id = $1
          RETURNING name, id, email, "emailVerified", image
          `
        /*
        const query2 = await client.query(updateSql, [
          id,
          name,
          email,
          emailVerified,
          image,
        ])
        */
        const query2 = await statmentExec(db, updateSql, [  
          id,
          name,
          email,
          emailVerified,
          image,          
        ]) ;         

        return query2.rows[0]
      },
      async linkAccount(account) {
        const sql = `
        insert into auth_accounts 
        (
          "userId", 
          provider, 
          type, 
          "providerAccountId", 
          access_token,
          expires_at,
          refresh_token,
          id_token,
          scope,
          session_state,
          token_type
        )
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        returning
          id,
          "userId", 
          provider, 
          type, 
          "providerAccountId", 
          access_token,
          expires_at,
          refresh_token,
          id_token,
          scope,
          session_state,
          token_type
        `
  
        const params = [
          account.userId,
          account.provider,
          account.type,
          account.providerAccountId,
          account.access_token,
          account.expires_at,
          account.refresh_token,
          account.id_token,
          account.scope,
          account.session_state,
          account.token_type,
        ]
  
        //const result = await client.query(sql, params)
        const db = await getConn();
        const result = await statmentExec(db, sql, params);  
        return mapExpiresAt(result.rows[0])
      },
      async createSession({ sessionToken, userId, expires }) {
        if (userId === undefined) {
          throw Error(`userId is undef in createSession`)
        }
        const sql = `insert into auth_sessions ("userId", expires, "sessionToken")
        values ($1, $2, $3)
        RETURNING id, "sessionToken", "userId", expires`
  
        //const result = await client.query(sql, [userId, expires, sessionToken])
        const db = await getConn();
        const result = await statmentExec(db, sql, [userId, expires, sessionToken]); 
        return result.rows[0]
      },
  
      async getSessionAndUser(sessionToken: string | undefined): Promise<{
        session: AdapterSession
        user: AdapterUser
      } | null> {
        if (sessionToken === undefined) {
          return null
        }

        const db = await getConn();
        const result1 = await queryRun(db, `select * from auth_sessions where "sessionToken" = $1`, [sessionToken]) ;
        //const result1 = await client.query(
        //  `select * from sessions where "sessionToken" = $1`,
        //  [sessionToken]
        //)
        if (result1.rowCount === 0) {
          return null
        }
        let session: AdapterSession = result1.rows[0]
  
        //const result2 = await client.query("select * from users where id = $1", [ session.userId, ])
        const result2 = await queryRun(db, `select * from auth_users where id = $1`, [session.userId,]) ;        
        if (result2.rowCount === 0) {
          return null
        }
        const user = result2.rows[0]
        return {
          session,
          user,
        }
      },
      async updateSession(
        session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">
      ): Promise<AdapterSession | null | undefined> {
        const { sessionToken } = session
        //const result1 = await client.query( `select * from sessions where "sessionToken" = $1`, [sessionToken] )
        const db = await getConn();
        const result1 = await queryRun(db, `select * from auth_sessions where "sessionToken" = $1`, [sessionToken]) ;        
        if (result1.rowCount === 0) {
          return null
        }
        const originalSession: AdapterSession = result1.rows[0]
  
        const newSession: AdapterSession = {
          ...originalSession,
          ...session,
        }
        const sql = `
          UPDATE auth_sessions set
          expires = $2
          where "sessionToken" = $1
          `
        //const result = await client.query(sql, [ newSession.sessionToken, newSession.expires, ])
        const result = await statmentExec(db, sql, [newSession.sessionToken, newSession.expires,]); 
        return result.rows[0]
      },
      async deleteSession(sessionToken) {
        const sql = `delete from auth_sessions where "sessionToken" = $1`
        const db = await getConn();
        //await client.query(sql, [sessionToken])
        await statmentExec(db, sql, [sessionToken]);                 
      },
      async unlinkAccount(partialAccount) {
        const { provider, providerAccountId } = partialAccount
        const sql = `delete from auth_accounts where "providerAccountId" = $1 and provider = $2`
        //await client.query(sql, [providerAccountId, provider])
        const db = await getConn();
        await statmentExec(db, sql, [providerAccountId, provider]);                 
      },
      async deleteUser(userId: string) {
        //await client.query(`delete from users where id = $1`, [userId])
        //await client.query(`delete from sessions where "userId" = $1`, [userId])
        //await client.query(`delete from accounts where "userId" = $1`, [userId])
        // to pio kat mporei na mhn xreiazetai apo ta foreign keys
        const db = await getConn();
        await statmentExec(db, `delete from users where id = $1`, [userId]);    
        await statmentExec(db, `delete from sessions where "userId" = $1`, [userId]);    
        await statmentExec(db, `delete from accounts where "userId" = $1`, [userId]);    
      },
    }
  }