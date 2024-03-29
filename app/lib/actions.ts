'use server';

import { undefined, z } from 'zod';
//import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { getConn,  queryRun, statmentExec, closeConn } from './firebird';

//manos
import { RegisterSchema } from './schemas';
import bcrypt from "bcrypt";
import { userEmailUnique, createAuthUser } from './data-cm-authuser';
import { User } from './definitions-cm';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ date: true, id: true });

// This is temporary
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};


export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  // Insert data into the database
  try {
    //sqlIns = ` INSERT INTO invoices (customer_id, amount, status, date)  VALUES (${customerId}, ${amountInCents}, ${status}, ${date}) `;
    const sqlIns = ` INSERT INTO invoices (customer_id, amount, status, date)  VALUES (?, ?,?,?) `;
    const db = await getConn();    
    await statmentExec(db, sqlIns, [customerId, amountInCents, status, date] )  ;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    //await sql`UPDATE invoices  SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status} WHERE id = ${id} `;
    const sqlUpd = `UPDATE invoices  SET customer_id = ?, amount = ?, status = ? WHERE id = ?`;
    const db = await getConn();    
    await statmentExec(db, sqlUpd, [customerId, amountInCents, status, id] )  ;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  // throw new Error('Failed to Delete Invoice');

  try {
    //await sql`DELETE FROM invoices WHERE id = ${id}`;
    const sqlDel = `DELETE FROM invoices WHERE id = ?`;
    const db = await getConn();    
    await statmentExec(db, sqlDel, [id] )  ;

    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice.' };
  }
}


// SignIn 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error; //otherwise not redirect
  }
}


// Register 
/*
export async function register(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await register('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error; //otherwise not redirect
  }
}
*/

// This is temporary
//export type CustomState = {
//  error: boolean| null;
//  message?: string | null;
//};

export const createUser = async (prevState: any, formData: FormData) => {  
  // Validate form fields using Zod
  const validatedFields = RegisterSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    name: formData.get('name'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      //errors: validatedFields.error.flatten().fieldErrors,
      error: true,
      message: 'Missing Fields. Failed to Create User.',
    };
  }

  const {email, password, name} = validatedFields.data;
  const hashedPassword  = await bcrypt.hash(password, 10);
  
  // check if email already taken
  const existingEmail = await userEmailUnique(email);
  if (existingEmail) {
    return {  error: true, message : "Email, already in use." }
  }
  
  const userCreated = await createAuthUser(email, hashedPassword, name);
  if (!userCreated) {
    return {  error: true, message : "Error creating User." }
  }
  
  //return { error: false, message : "Success User created, email send!" }
  // Revalidate the cache for the invoices page and redirect the user.
  //revalidatePath('/dashboard/invoices');
  redirect('/login');
};





/*
  // Prepare data for insertion into the database
  const { email, password, name } = validatedFields.data;
  const date = new Date().toISOString().split('T')[0];
  // Insert data into the database
  try {
    //sqlIns = ` INSERT INTO invoices (customer_id, amount, status, date)  VALUES (${customerId}, ${amountInCents}, ${status}, ${date}) `;
    const sqlIns = ` INSERT INTO invoices (customer_id, amount, status, date)  VALUES (?, ?,?,?) `;
    const db = await getConn();    
    await statmentExec(db, sqlIns, [customerId, amountInCents, status, date] )  ;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
  */

