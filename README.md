## Next.js App Router Course - Final

This is the final template for the Next.js App Router Course. It contains the final code for the dashboard application.

For more information, see the [course curriculum](https://nextjs.org/learn) on the Next.js Website.


https://slproweb.com/products/Win32OpenSSL.html
Email: user@nextmail.com
Password: 123456



------------
Other examples 
https://github.com/vercel/next-learn/tree/main
https://dev.to/franciscomendes10866/nextjs-and-graphql-the-perfect-combination-for-full-stack-development-18l7

https://www.youtube.com/watch?v=FKZAXFjxlJI
https://github.com/adrianhajdin/anime_vault
https://github.com/mertthesamael/lalasia  --> structure nextjs
**********
For use at BaseModels WinServer IIS (G:\Development\VScode\Projects\dokimes\NEXT\my-app)
Firebird example 1 --> G:\Development\VScode\Projects\dokimes\FireBird\cm-firebird-srv
Firebird example 2 -->G:\Development\React\Projects\firebird-srv\controller\user.js
\*************
TODO
- Connect with Firebird and replace all db routines
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

https://uploadthing.com/   --> https://www.youtube.com/watch?v=OyxDGWgNJMc
*************************************** 

ui/invoices/table.tsx --> fetchFilteredInvoices
