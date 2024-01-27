
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

export default async function sendEMail(subject, toEmail, msg) {
    const transporter = nodemailer.createTransport({
        service: 'hotmail', //'gmail',
        /* 
        setting service as 'gmail' is same as providing these setings:
        host: "smtp.gmail.com",
        port: 465,
        secure: true
        If you want to use a different email provider other than gmail, you need to provide these manually.
        Or you can go use these well known services and their settings at
        https://github.com/nodemailer/nodemailer/blob/master/lib/well-known/services.json
    */
        auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    const mailOptions= Mail.Options = {
        from: process.env.MY_EMAIL,
        to: process.env.MY_EMAIL,
        // cc: email, (uncomment this line if you want to send a copy to the sender)
        subject: `${subject} Message to (${toEmail})`,
        text: msg,
    };
    
    
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
        //throw new Error(error);
        return JSON.stringify( error);
        } else {
        console.log("Email Sent");
        //return true;
        return "Email Sent";
        }
    });
    }    

