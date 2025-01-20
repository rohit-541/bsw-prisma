import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'PrismaService';
import { MailService } from 'src/mail/mail.service';
@Injectable()
export class UserService {

    constructor(private prisma:PrismaService,
                private mail:MailService){}

    //sendOTP
    async sendOTP(email:string){
        
    }

    //Register User

    //login user

    //update user details

    //delete user

    //getDetails
    
}
