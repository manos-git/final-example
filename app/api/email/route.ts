//import { Console } from 'console';
import { type NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import sendEmail   from '@/app/lib/mailer'

import { NextApiRequest, NextApiResponse } from 'next';

export async function POST(request: NextRequest) {
  const { subject, toMail, message } = await request.json();

  /*
  const transport = nodemailer.createTransport({
    service: 'hotmail', //'gmail',
    // 
    //  setting service as 'gmail' is same as providing these setings:
    //  host: "smtp.gmail.com",
    //  port: 465,
    //  secure: true
    //  If you want to use a different email provider other than gmail, you need to provide these manually.
    //  Or you can go use these well known services and their settings at
    //  https://github.com/nodemailer/nodemailer/blob/master/lib/well-known/services.json
    //
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
      },
  });

  const mailOptions: Mail.Options = {
    from: process.env.MY_EMAIL,
    to: process.env.MY_EMAIL,
    // cc: email, (uncomment this line if you want to send a copy to the sender)
    subject: `Message from ${name} (${email})`,
    text: message,
  };

  const sendMailPromise = () =>
    new Promise<string>((resolve, reject) => {
      transport.sendMail(mailOptions, function (err) {
        if (!err) {
          resolve('Email sent');
        } else {
          reject(err.message);
        }
      });
    });

  try {
    await sendMailPromise();
    //console.log({ message: 'Email sent' });    
    return NextResponse.json({ message: 'Email sent' });
  } catch (err) {
    console.log('error:', err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
  */

  try {   
    const respMesg =   await sendEmail( subject, toMail, message);
    console.log({ message: respMesg });    
    return NextResponse.json({ message: respMesg });
  } catch (err) {
    console.log('error:', err);
    return NextResponse.json({ error: err }, { status: 500 });
  }


}