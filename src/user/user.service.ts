import { Injectable } from '@nestjs/common';
import { PrismaService } from 'PrismaService';
import { MailService } from 'Mail/SendMail';

@Injectable()
export class UserService {

    constructor(private prisma:PrismaService){}


    //VerifyEmail

    //Register User

    //loginUser

    //logoutUser

    //updateDetails 

    //deleteUser

    //reportUser

}
