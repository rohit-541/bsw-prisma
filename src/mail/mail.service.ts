import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'

@Injectable()
export class MailService {
    //create a transport    
    private transport = nodemailer.createTransport({
        host:'smpt.iitd.ac.in',
        port:465,
        secure:false,
        auth:{
            user:process.env.email,
            pass:process.env.email_password
        },
        tls: {
            rejectUnauthorized: false  // May be required if IITD's SSL cert is self-signed
        }
    });
    
    async sendMail(to:string,subject:string,text:string,htmlString?:string){
        this.transport.sendMail({
            from:process.env.email,
            to:to,
            subject:subject,
            text:text,
            html:htmlString
        });
    }


}
