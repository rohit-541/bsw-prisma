import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'

@Injectable()
export class MailService {
    //create a transport    
    private transport = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.email,
            pass:process.env.email_password
        }
    });

    sendMail(to:string,subject:string,text:string,htmlString?:string){
        this.transport.sendMail({
            from:process.env.email,
            to:to,
            subject:subject,
            text:text,
            html:htmlString
        });
    }


}
