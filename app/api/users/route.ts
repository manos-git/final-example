//https://wyattweb.dev/blog/posts/how-to-add-a-rate-limiter-for-your-api-using-next-js-13
//import App from "next/app";

//import requestIp from "request-ip";

import {data} from "./todo";
import { NextResponse, NextRequest } from "next/server";
import { NextApiRequest, NextApiResponse } from 'next';

//import { todo } from "node:test";
import { rateLimiter } from "@/app/lib/rate-limiter"; 
import TooManyRequests from "@/app/too-many-requsts"
//G:\Development\VScode\Projects\dokimes\NEXT\final-example\app\too-many-requsts.js

/*
export async function GET(req: Request, context: any) {
    const {params} =  context;
    //const user = data.filter((x)=> params.user.Id === x.id.toString());

    return  NextResponse.json({
        //user,
        data,
  });
  }
 */   


  
/*
export default async function handler(req, res) {
  const ip = req.ip ?? "127.0.0.1";
  try {
    const { success } = await rateLimiter.limit(ip);

    if (!success)
      return Response.json({ status: 429, message: "Too many submissions" });
  } catch (error) {
    return new NextResponse("Something went wrong with your form.");
  }
}
*/

/*
export default async function handler(request: NextRequest) {
  // You could alternatively limit based on user ID or similar
  const ip = request.ip ?? '127.0.0.1'
  const { limit, reset, remaining } = await rateLimiter.limit(ip)
  console.log('Limit Remain: ', remaining)

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': reset.toString(),
    },
  })
}
*/

//const handler = async (req: NextApiRequest, res: NextApiResponse) => {
const handler = async (req: NextRequest, res: NextResponse) => {
  //const ip = request.ip ?? '127.0.0.1'
  const ip = '127.0.0.1'
  const { limit, reset, remaining } = await rateLimiter.limit(ip)
  console.log('Limit Remain: ', remaining)
  const subject='subject mailllllllllll'
  const toMail='toMail nameeeeeeeeeeeee'
  const message='mmmmmmmmmmmmmmmmmm'


  if (remaining>0 && remaining<2) {
    /*
    await fetch("/api/email", {
      method: "POST",
      //body: JSON.stringify({ "email", "Limit Remain ", "" }),
      body: '{ "email":"Jane Doe", "name":"Manos", "message":"Limited"}',
      });
    */
      try {
        const mailResponse = await fetch('http://127.0.0.1:8502/api/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subject, toMail, message }),
          mode: 'no-cors', // disable cors
        })
        //if (mailResponse) { //alert(mailResponse)          
        console.log(mailResponse.json());
        //};
      } catch (error) {
        console.log(error)
        //  alert('Something went wrong. Please try again.')
      } finally {
        //setIsSending(false)
      }    
  }

  if (remaining===0) {
    //return  res.status(200).json({TooManyRequests,});
    return new NextResponse(); //des pws einai to error.tsx --> https://blog.logrocket.com/testing-error-handling-patterns-next-js/
  }
  
  return  Response.json({data,});
    /*
    const { token } = req.body;   
    try {
      const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY}&response=${token}`,{},{headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" }});
      if (response.data.success) {
        return res.status(200).json({ message: 'reCAPTCHA verification successful' })
      } else {
        return res.status(400).json({ message: 'reCAPTCHA verification failed' })
      }
    } catch (err) {
      return res.status(500).json({ message: 'Internal server error' })
    } */

  if (req.method === 'POST') {
    return Response.json({ status: 429, message: "Too many submissions" });
    //return res.status(200).json({ message: 'POST successful' })
  } else 
  if (req.method === 'GET') {
    //return res.status(200).json({ message: 'GET successful' })
    return Response.json({ status: 429, message: "Too many submissions" });
} else 
if (req.method === 'PUT') {
//  return res.status(200).json({ message: 'PUT successful' })
return Response.json({ status: 429, message: "Too many submissions" });
} else 
if (req.method === 'HEAD') {
  //return res.status(200).json({ message: 'HEAD successful' })
  return Response.json({ status: 429, message: "Too many submissions" });
} else 
if (req.method === 'DELETE') {
  //return res.status(200).json({ message: 'DELETE successful' })
  return Response.json({ status: 429, message: "Too many submissions" });
} else 
if (req.method === 'PATCH') {
  //return res.status(200).json({ message: 'PATCH successful' })
  return Response.json({ status: 429, message: "Too many submissions" });
} else 
if (req.method === 'OPTIONS') {
  //return res.status(200).json({ message: 'OPTIONS successful' })
  return Response.json({ status: 429, message: "Too many submissions" });
}  else{
  //return res.status(405).json({message: "Method Not Allowed"})
  return Response.json({ status: 429, message: "Too Many Requests Error" });
  }

  
};
 
export { handler as GET, handler as POST, handler as PUT, handler as HEAD, handler as DELETE, handler as PATCH };