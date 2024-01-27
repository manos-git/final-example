## Next.js App Router Course - Final
vopied from original --> nextjs-dashboard_old



For more information, see the [course curriculum](https://nextjs.org/learn) on the Next.js Website.


https://slproweb.com/products/Win32OpenSSL.html
Email: user@nextmail.com
Password: 123456



------------
Other examples 
https://github.com/safak/nextadmin/tree/completed
https://github.com/vercel/next-learn/tree/main
https://dev.to/franciscomendes10866/nextjs-and-graphql-the-perfect-combination-for-full-stack-development-18l7

https://medium.com/@jhnmugambi/deploying-nextjs-app-with-next-auth-on-iis-c1baec3cb53c

https://www.youtube.com/watch?v=FKZAXFjxlJI
https://github.com/adrianhajdin/anime_vault
https://github.com/mertthesamael/lalasia  --> structure nextjs
**********
For use at BaseModels WinServer IIS (G:\Development\VScode\Projects\dokimes\NEXT\my-app)
Firebird example 1 --> G:\Development\VScode\Projects\dokimes\FireBird\cm-firebird-srv
Firebird example 2 -->G:\Development\React\Projects\firebird-srv\controller\user.js
******************************
ADD NEXT-AUTH 14 V5

auth.config.ts  -->
    jwt({ token, trigger, session }) {
      if (trigger === "update") token.name = session.user.name
      return token
    },
https://github.com/nextauthjs/next-auth/blob/main/apps/dev/nextjs/auth.config.ts

session: { strategy: "jwt", maxAge: 1* 24 * 60 * 60 ,  },  //MANOS  // 1 day
https://dev.to/ekimcem/nextauthjs-authjs-credential-authentication-with-methods-you-need--21al

must enable  check for session 
https://dev.to/ekimcem/nextauthjs-authjs-credential-authentication-with-methods-you-need--21al

Custome adapter for all databases
--> --> https://authjs.dev/getting-started/adapters#user

*******************************
\*************
TODO
-- api routes --> https://refine.dev/blog/next-js-api-routes/#typing-response-data






************************************
return new Promise((resolve, reject) => {
    fb.attach(this.options, (err, db) => {

        if (err) {
            // throw new Error('Erro na conexión á DB');
            reject('Erro na consulta ó Padrón');
        }

        db.query(query, params, (err, res) => {

            if (err) {
                // throw new Error('Erro na consulta ó Padrón');
                reject('Erro na consulta ó Padrón');
            }
            console.log('firebird.service - Response DB ================', res);

            db.detach();
            // return res
            resolve(res);
        });
    });
});
************************************
  const fetchData = async () => { 
	try { 
	Const conn = await connect({ 
			Database: 'C:\my_database\my_database.fdb', 
			User: 'SYSDBA', 
			Password: 'masterkey' }); 
			Const stmt = await conn.execSQL(`SELECT * FROM my_table`); // Fetch all records using the `stmt.get()` 
			Const records = []; 
			while ((record = await stmt.get()) !== null) { 
				records.push({ id: record.get('id'), name: record.get('name'), email: record.get('email') }); 
				} 
			Await stmt.close(); 
			await conn.close(); 
			SetData(records); 
			setMessage('Data fetched successfully! '); 
	
	} catch (error) { 
		SetIsError(true); 
		setMessage(`Error: ${error}`); 
		console.error(error); } 
	finally { 
	Await conn?.close(); 
	await stmt?.close();
    } 
***************************************    
interface User {
  id: number;
  name: string;
  email: string;
}

const fetchData = async () => {
  try {
    const conn = await connect({
      database: 'C:\my_database\my_database.fdb',
      user: 'SYSDBA',
      password: 'masterkey',
    });

 const stmt = await conn.execSQL('SELECT * FROM my_table');
    const records = await stmt.get() as IRecordSet; 
    const users: User[] = records.parse(record => ({ 
        // Define a callback function that maps each record to a `User` object using its properties.
         Id: record.get('id'), 
         name: record.get('name'), 
         email: record.get('email'),
          })); 
        await stmt.close(); 
        await conn.close(); 
        setData(users); 
        setMessage('Data fetched successfully! '); 
        } 
        catch (error) 
        { // Handle errors as before... } 
        finally { // Close the connection and statement objects as before... }
};
*************************************** 


if i like to use ... const firebird = require('objection').Model.knex('firebird');   and i want to parse the user as type like   export type  User = {
  id: string;
  name: string;
  email: string;} how can i do it?

*************************************** 
Trick 
- result of sql query of backend, to server through getServerSideProps,  -->   https://github.com/vercel/next.js/discussions/15066
- 
- https://uploadthing.com/   --> https://www.youtube.com/watch?v=OyxDGWgNJMc
- node-firebird  -->  https://habr.com/ru/articles/760000/
*************************************** 

ui/invoices/table.tsx --> fetchFilteredInvoices


*******************************************************************************************

Auth.js   CUSTOM FIREBIRD DATABASE ADAPTOR
--> https://authjs.dev/getting-started/adapters#user
*******************

CREATE TABLE AUTH_USERS
(
  ID integer NOT NULL,
  NAME varchar(255),
  EMAIL varchar(255) NOT NULL,
  "emailVerified" timestamp,
  IMAGE varchar(1000),
    password varchar(80) // optional if use oauth providers and not credentials   (declre password? means optional, not required)
    
  CONSTRAINT AUTH_USERS_PK PRIMARY KEY (ID),
  CONSTRAINT AUTH_USERS_EMAIL_UK UNIQUE (EMAIL)
);

GRANT DELETE, INSERT, REFERENCES, SELECT, UPDATE
 ON AUTH_USERS TO  MANOS WITH GRANT OPTION;


SET TERM ^ ;
CREATE TRIGGER AUTH_USERS_BI FOR AUTH_USERS ACTIVE
BEFORE insert POSITION 0
AS
BEGIN
  if (new.id is null) then
  begin
    new.id = gen_id(gen_auth_users_id, 1);
  end
END^
SET TERM ; ^
-------------------------------------------------
CREATE TABLE AUTH_ACCOUNTS
(
  ID integer NOT NULL,
  "userId" integer NOT NULL,
  "TYPE" varchar(255) NOT NULL,
  PROVIDED varchar(255) NOT NULL,
  "providerAccountId" varchar(255) NOT NULL,
  REFRESH_TOKEN varchar(200),
  ACCESS_TOKEN varchar(200),
  EXPIRES_AT bigint,
  ID_TOKEN varchar(100),
  SCOPE varchar(100),
  SESSION_STATE varchar(100),
  TOKEN_TYPE varchar(100),
  CONSTRAINT AUTH_ACCOUNTS_PK PRIMARY KEY (ID)
);

ALTER TABLE AUTH_ACCOUNTS ADD CONSTRAINT "auth_accounts_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES AUTH_USERS (ID) ON DELETE CASCADE;

SET TERM ^ ;
CREATE TRIGGER AUTH_ACCOUNTS_BI FOR AUTH_ACCOUNTS ACTIVE
BEFORE insert POSITION 0
AS
BEGIN
  if (new.id is null) then
  begin
    new.id =  gen_id(gen_auth_accounts_id, 1);
  end
END^
SET TERM ; ^
-------------------------------------------------
// sessions not work ath the Edge , SO NOT USE AND USE STRATEGY ='jwt'
CREATE TABLE AUTH_SESSIONS
(
  ID integer NOT NULL,
  "userId" integer NOT NULL,
  EXPIRES timestamp NOT NULL,
  "sessionToken" varchar(255) NOT NULL,
  CONSTRAINT AUTH_SESSIONS_PK PRIMARY KEY ("sessionToken")
);

ALTER TABLE AUTH_SESSIONS ADD CONSTRAINT "auth_sessions_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES AUTH_USERS (ID) ON DELETE CASCADE;

SET TERM ^ ;
CREATE TRIGGER AUTH_SESSIONS_BI FOR AUTH_SESSIONS ACTIVE
BEFORE insert POSITION 0
AS
BEGIN
  if (new.id is null) then
  begin
    new.id = gen_id(gen_auth_sessions_id, 1);
  end
END^
SET TERM ; ^
-------------------------------------------------
// only for email providers
CREATE TABLE AUTH_VERIFICATION_TOKENS
(
  TOKEN varchar(400) NOT NULL,
  IDENTIFIER varchar(100) NOT NULL,
  EXPIRES timestamp NOT NULL,
  CONSTRAINT AUTH_VERIFICATION_TOKENS_PK PRIMARY KEY (identifier, token)
);

GRANT DELETE, INSERT, REFERENCES, SELECT, UPDATE
 ON AUTH_VERIFICATION_TOKENS TO  MANOS WITH GRANT OPTION;
-------------------------------------------------
CREATE TABLE AUTH_PROVIDER_TYPE
(
  "value" varchar(15) NOT NULL
);

GRANT DELETE, INSERT, REFERENCES, SELECT, UPDATE
 ON AUTH_PROVIDER_TYPE TO  MANOS WITH GRANT OPTION;

INSERT INTO AUTH_PROVIDER_TYPE ("value") VALUES ('credentials');
INSERT INTO AUTH_PROVIDER_TYPE ("value") VALUES ('email');
INSERT INTO AUTH_PROVIDER_TYPE ("value") VALUES ('oauth');
INSERT INTO AUTH_PROVIDER_TYPE ("value") VALUES ('oidc');
-------------------------------------------------

*******************************************************************************************
custom server (server.js)
https://nextjs.org/docs/pages/building-your-application/configuring/custom-server

deploying on iisnode server
https://medium.com/@jhnmugambi/deploying-nextjs-app-with-next-auth-on-iis-c1baec3cb53c

deploying docker
https://nextjs.org/docs/pages/building-your-application/deploying

Continuous Integration (CI) Build Caching
https://nextjs.org/docs/pages/building-your-application/deploying/ci-build-caching
*******************************************************************************************
Rate limits with upstash
https://levelup.gitconnected.com/secure-your-api-endpoints-in-next-js-13-with-upstash-b305da433e13
https://www.dhairyashah.dev/posts/implementing-rate-limiting-for-nextjs-api-routes-with-upstash-and-redis/
*******************************************************************************************
Email
https://medium.com/@abilsavio/email-contact-form-using-nextjs-app-router-60c29fe70644
https://blog.logrocket.com/streamline-email-creation-react-email/
https://dev.to/thevinitgupta/crafting-stunning-emails-with-nextjs-and-tailwind-css-529a

*******************************************************************************************


-when a folder starts with _ then router ignore it.
-all components inside folder app is server components and logged (console.log) appears only in terminal and not in broser tools (elements). 
for that case must write on the top "use client".
- Calling session on Server Side, await auth()
- Calling session on Client Side, useSession()
- inside <main --> ... bg-[radial-gradient(ellipse_at_top, _var(--tw-gradient-stops))] from-sky-400 to-blue-800">
*******************************************************************************************
https://www.youtube.com/watch?v=1MTyCvS05V4
Free postgresql hosting -->  https://neon.tech/
the right Authjs.dev NOT nextAuth
1.59 time for register
2.08 for auth
// sessions not work ath the Edge , SO NOT USE AND USE STRATEGY ='jwt'
2.30.35 enswmatwnei sto auth.ts ton routes.ts
2.54.00   ... continue... extent token , jwt
first extent jwt then session ( custom adaptor)


authjs v5
https://medium.com/@youngjun625/next-js14-nextauth-v5-1-signin-signout-7e30cce52e7f
https://medium.com/@youngjun625/next-js14-nextauth-v5-2-session-update-b977cb6afd47

session & jwt
https://stackoverflow.com/questions/77574338/issue-in-next-auth-v5-session-in-next-js-14
allos tropos
https://javascript.plainenglish.io/seamless-authentication-and-authorization-in-nextjs-leveraging-external-jwts-in-next-auth-1af1ef8fd7d8
kai ayto --> https://remaster.com/blog/next-auth-jwt-session

session update
https://medium.com/@youngjun625/next-js14-nextauth-v5-2-session-update-b977cb6afd47

Magik Links
https://medium.com/@uriser/authentication-in-next-js-with-auth-js-nextauth-5-b74e3ae18ab8

***********************************
AUTH DB
CREATE DOMAIN auth_role
AS varchar(10) CHECK (value IS NULL or VALUE IN ('su','admin','company','entoleas','model','user'));

CREATE TABLE AUTH_USERS
(
  ID integer NOT NULL,
  NAME varchar(255),
  EMAIL varchar(255) NOT NULL,
  "emailVerified" timestamp,
  IMAGE varchar(1000),
  "PASSWORD" varchar(255) NOT NULL,
  "ROLE" AUTH_ROLE,
  USER_ID INTDEF0,
  DISPLAY_NAME varchar(20),
  CREATED_AT DATETIME_NOW NOT NULL,
  CONSTRAINT AUTH_USERS_PK PRIMARY KEY (ID),
  CONSTRAINT AUTH_USERS_EMAIL_UK UNIQUE (EMAIL)
);
CREATE INDEX IDX_AUTH_USERS_ID ON AUTH_USERS (USER_ID);
***********************************


But, add AUTH_URL to .env and then solved.
https://stackoverflow.com/questions/77547870/is-there-special-function-to-call-for-updating-session-in-the-newest-beta-next

https://medium.com/@uriser/authentication-in-next-js-with-auth-js-nextauth-5-b74e3ae18ab8
resend for email
https://www.brevo.com/pricing/

Deploy
https://www.saotn.org/install-nodejs-iisnode-ghost-on-windows-server-iis/