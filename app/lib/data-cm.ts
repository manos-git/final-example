import { sql } from '@vercel/postgres';
//import { getConnection,  disconnectDb, runQuery } from './firebirdDb';
import { getConn,  queryRun } from './firebird';

import {
  CustomerField,
  //CustomersTableType,
  InvoiceForm,
  //InvoicesTable,
  //LatestInvoiceRaw,
  //User,
  //Revenue,
} from './definitions';
import { formatCurrency } from './utils';
import { unstable_noStore as noStore } from 'next/cache';
import { ErrorCM, 
  LatestInvoiceRaw, 
  CustomersTableType, 
  FormattedCustomersTable, 
  User,
  Revenue, 
  InvoicesTable } from './definitions-cm';
import { invoices } from './placeholder-data';
import { number, string } from 'zod';
import LatestInvoices from '../ui/dashboard/latest-invoices';

import { logger } from "@/logger"; // our logger import


export async function fetchRevenue() {
  // Add noStore() here prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();
  var data: Revenue[]; // | undefined;  //SWSTO
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000)); // 3 SEC

    //const data = await sql<Revenue>`SELECT * FROM revenue`;
    const selSQL= ` select extract(month from createddate) as month_, COUNT(*) AS revenue
                    FROM PROJECT_BUCKET pb 
                    JOIN PROJECT p ON p.PROJECT_ID= pb.PROJECT_ID
                    where EXTRACT (year FROM createddate) = 2022 and
                    p.ACT='Y' AND p.PROJECT_STATUS='I' and p.proj_prev_id=0
                    AND pb.MODEL_SELECTED='Y' AND pb.MODEL_STATUS='4'
                    GROUP BY 1`;

    let errcm: ErrorCM = {errCode: '1000',  errMsg: 'sfalma sto query'};
      
    const db = await getConn();

    const rows = await queryRun(db, selSQL)  ;
    if (rows && rows !== null) {      
      data  = rows.map(( revenue: {month_ : string; revenue:number}) => ({      
        ...revenue,
        month: revenue.month_,
        })); 
      return  data; 
    }

                    
    //////return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  noStore();
  var latestInvoices: LatestInvoiceRaw[]; // | undefined;  //SWSTO
  try { 
    const selSQL= `SELECT first 5 i.PARAS_ID as id, i.PARAS_NUM as name, i.PARAS_DATETIME as image_url ,  
                   c.FIRM_NAME as email, GROSS_TOT_VAL as amount     
                   FROM ISSUE_MAIN i
                   JOIN CUSTOMERS C ON C.CUSTOMER_ID= i.CUST_ID
                   ORDER BY i.PARAS_DATETIME desc`;
                    
    //i.KIN_TYPE,
    /*
    const selSQL= `select first 5 i.paras_id as id, i.paras_num as name, i.paras_datetime as image_url ,  
    c.firm_name as email, gross_tot_val as amount     
    from issue_main i
    join customers c on c.customer_id = i.cust_id
    order by i.paras_datetime desc`;
    */

    /*
    type demoUser = {username: string, age: number};
    let newUser: demoUser;
    newUser = {username: 'Justin',  age: 40};
    */
    let errcm: ErrorCM = {errCode: '1000',  errMsg: 'sfalma sto query'};
                      
    const db = await getConn();

    const rows = await queryRun(db, selSQL)  ;
    if (rows && rows !== null) {      
      latestInvoices  = rows.map(( invoice: { id: string;  name: string;  image_url: string;   email: string; amount:number}) => ({      
          ...invoice,
          amount: formatCurrency( invoice.amount ),
        })); 
        logger.info("fetchLatestInvoices called "); // calling our logger
      return  latestInvoices; 
    }

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}



/*  ------------------------  */
  

    
//+++++++++++++++++++++++++++++++
interface RespIntf  {
  TOT_MODELS: BigInteger;
};





export async function fetchCardData() {
  noStore();
  try {
    const sel2020 = `select COUNT(*) AS TOT_MODELS
            FROM PROJECT_BUCKET pb 
            JOIN PROJECT p ON p.PROJECT_ID= pb.PROJECT_ID
            where EXTRACT (year FROM createddate) = 2020 and
            p.ACT='Y' AND p.PROJECT_STATUS='I' and p.proj_prev_id=0
            AND pb.MODEL_SELECTED='Y' AND pb.MODEL_STATUS='4'`;
    const sel2021 = `select COUNT(*) AS TOT_MODELS
            FROM PROJECT_BUCKET pb 
            JOIN PROJECT p ON p.PROJECT_ID= pb.PROJECT_ID
            where EXTRACT (year FROM createddate) = 2021 and
            p.ACT='Y' AND p.PROJECT_STATUS='I' and p.proj_prev_id=0
            AND pb.MODEL_SELECTED='Y' AND pb.MODEL_STATUS='4'`;
    const sel2022 = `select COUNT(*) AS TOT_MODELS
            FROM PROJECT_BUCKET pb 
            JOIN PROJECT p ON p.PROJECT_ID= pb.PROJECT_ID
            where EXTRACT (year FROM createddate) = 2022 and
            p.ACT='Y' AND p.PROJECT_STATUS='I' and p.proj_prev_id=0
            AND pb.MODEL_SELECTED='Y' AND pb.MODEL_STATUS='4'`;
    const sel2023 = `select COUNT(*) AS TOT_MODELS
            FROM PROJECT_BUCKET pb 
            JOIN PROJECT p ON p.PROJECT_ID= pb.PROJECT_ID
            where EXTRACT (year FROM createddate) = 2023 and
            p.ACT='Y' AND p.PROJECT_STATUS='I' and p.proj_prev_id=0
            AND pb.MODEL_SELECTED='Y' AND pb.MODEL_STATUS='4'`;

    /*        
    const dbconn = await getConnection();
    const get2020 =  new Promise((resolve, reject)=> {      
        dbconn.query(sel2020, (err:any, res:any) => {
          if (err) {        
            disconnectDb(dbconn);
            reject();
          } else {
              if (res && res.length > 0) {
                disconnectDb(dbconn);
                resolve(res);
              } else { 
                  disconnectDb(dbconn);
                  resolve;
                };
          }
         
        })
      });

    const get2021 = await runQuery(sel2021);
    const get2022 = await runQuery(sel2022);
    const get2023 = await runQuery(sel2023);
    */
   
    const db = await getConn();
    
    const get2020 = await queryRun(db, sel2020)  ;
    const get2021 = await queryRun(db, sel2021);
    const get2022 = await queryRun(db, sel2022);
    const get2023 = await queryRun(db, sel2023);
    
    const data = await Promise.all([
      get2020,
      get2021,
      get2022,
      get2023,
    ]);

    const totalModels2020 = Number((data[0])[0].tot_models ?? 0);
    const totalModels2021 = Number((data[1])[0].tot_models ?? 0);
    const totalModels2022 = Number((data[2])[0].tot_models ?? 0);
    const totalModels2023 = Number((data[3])[0].tot_models ?? 0);
    //const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    //const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      totalModels2020,
      totalModels2021,
      totalModels2022,
      totalModels2023,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 10;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    /*
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    */
  
  var invoices: InvoicesTable[]; // | undefined;  //SWSTO

  const selSQL =  // ATTENTION!!! an allaxtei to query , prepei na allaxtei kai sto fetchInvoicesPages
  `SELECT first ${ITEMS_PER_PAGE} skip ${offset} I.ISS_MAIN_ID, I.PARAS_ID as id, I.PARAS_NUM, I.PARAS_DATETIME as date_, 
    I.CUST_ID as customer_id, I.KIN_TYPE, I.NET_TOT_VAL, I.FPA_TOT_VAL, coalesce(I.GROSS_TOT_VAL, 0) as amount,
    I.TAM_1, I.TAM_2, I.TAM_3, I.TAM_4, I.REMARKS, I.RELATIVE_DOCS, I.ACT, 'pending' as status,
    I.ISCANCELLED, I.REL_ISS_MAIN_ID, C.FIRM_NAME as name_, '' as email, '' as image_url,
    COALESCE(I.AADE_MARK, '') AS AADE_MARK, COALESCE(I.AADE_CANCEL_MARK, '') AS AADE_CANCEL_MARK,
       CASE WHEN (I.PARAS_ID=5 AND I.REL_ISS_MAIN_ID<>0) THEN --//pistvtiko
     (SELECT IM.PARAS_NUM FROM ISSUE_MAIN IM WHERE IM.ISS_MAIN_ID= I.REL_ISS_MAIN_ID)
    ELSE 0 END AS ORIGIN_PARASNUM --// TO ARXIKO parasnum TOY PISTVTIKOY
    FROM ISSUE_MAIN I
    JOIN CUSTOMERS C ON C.CUSTOMER_ID= I.CUST_ID
    WHERE  C.CUST_TYPE = 1 and extract(year from PARAS_DATETIME) = 2022 
    AND firm_name LIKE '${`${query}%`}' 
    ORDER BY I.PARAS_DATETIME desc, I.PARAS_NUM asc
    `;

  let errcm: ErrorCM = {errCode: '1000',  errMsg: 'sfalma sto query'};
    
  const db = await getConn();

  const rows = await queryRun(db, selSQL)  ;
  if (rows && rows !== null) {      
    invoices  = rows.map(( inv: {id: string; customer_id: string;  name_: string;  email: string;  image_url: string;  date_: string;  amount: number;  status: 'pending' | 'paid';}) => ({      
      ...inv,
      name: inv.name_,
      date: inv.date_,
      })); 
    return  invoices; 
  }

  /////return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  noStore();
  try {   
    /*
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;
  //const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
  */
  const selCount =  // ATTENTION!!! an allaxtei to query , prepei na allaxtei kai sto fetchFilteredInvoices
    `SELECT COUNT(*) as tot
      FROM ISSUE_MAIN I
      JOIN CUSTOMERS C ON C.CUSTOMER_ID= I.CUST_ID
      WHERE  C.CUST_TYPE = 1 and extract(year from PARAS_DATETIME) = 2022 
      AND firm_name LIKE '${`${query}%`}'     
      `;
    let errcm: ErrorCM = {errCode: '1000',  errMsg: 'sfalma sto query'};
    const db = await getConn();
    const rows = await queryRun(db, selCount)  ;

    const totalPages = Math.ceil(Number(rows[0].tot) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  noStore();
  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  noStore();  
  var customers: FormattedCustomersTable[]; // | undefined;  //SWSTO
  try {
    //const data = await sql<CustomersTableType>`
    const selSQL =//`SELECT first 30 CUSTOMER_ID as id, FIRM_NAME as name, PHONE1 as phone, email, '/models/'||lower(COALESCE(photoid, ''))||'.jpg' as image_url,
                  `SELECT first 30 CUSTOMER_ID as id, FIRM_NAME as name, PHONE1 as phone, email, '/'||cast(trunc(rand() * 3 + 1) as integer)||'.jpg' as image_url,
                   123 AS total_invoices,  345 AS total_pending,  678 AS total_paid
                   FROM customers
                   WHERE firm_name LIKE '${`${query}%`}' OR email LIKE '${`%${query}%`}'                   
          		     ORDER BY firm_name ASC`;

    //const customers = data.rows.map((customer) => ({
    //  ...customer,
    //  total_pending: formatCurrency(customer.total_pending),
    //  total_paid: formatCurrency(customer.total_paid),
    //}));
    const db = await getConn();

    const rows = await queryRun(db, selSQL)  ;
    if (rows && rows !== null) {      
        customers  = rows.map(( customer: { id: string;   name: string;  email: string;   image_url: string;  total_invoices: number;  total_pending: number;  total_paid: number;}) => ({      
          ...customer,          
          total_pending: formatCurrency(customer.total_pending),
          total_paid: formatCurrency(customer.total_paid),

        }));       
        return  customers; 
    }
      
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function getUser(email: string) {
    var oneUser: User; // | undefined;  //SWSTO
    try {
      //const data = await sql<CustomersTableType>`
      //const user = await sql`SELECT * FROM users WHERE email=${email}`;
      const selSql =`SELECT first 1  USER_ID as id, DISPNAME, UNAME as name_, '' as email, UPASS as password, ROLE_LEVEL  FROM users WHERE email=${email}`; 
      const db = await getConn();
      const row = await queryRun(db, selSql)  ;
      if (row && row !== null) {      
        oneUser = row.map(( usr: { id: string;   name_: string;  email: string;   password: string}) => ({      
          name: usr.name_,  
          ...usr,                      
        }));       
        return  oneUser; 
      }
   
    //return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}



