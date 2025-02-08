import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'

@Injectable()
export class MailService {
    //create a transport    
    private transport = nodemailer.createTransport({
        host:'smtp.iitd.ac.in',
        port:465,
        secure:true,
        auth:{
            user:process.env.email,
            pass:process.env.email_password
        },
        tls: {
            rejectUnauthorized: false  // May be required if IITD's SSL cert is self-signed
        }
    });
    
    async sendMail(to:string,subject:string,text:string,htmlString?:string){
        try {
            this.transport.sendMail({
                from:process.env.email,
                to:to,
                subject:subject,
                text:text,
                html:htmlString
            }); 
        } catch (error) {
            console.log(error);
            throw error;
        }
        
    }


}
