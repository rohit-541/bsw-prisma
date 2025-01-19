import { Body, Controller, Post } from '@nestjs/common';
import { EmailVerify } from './user.validation';
import { MailService } from 'Mail/SendMail';

@Controller('user')
export class UserController {

    constructor(private mailService:MailService){}

    //Get Mail
    @Post('/email')
    async getMail(@Body('kerbrosId') kerbrosId:EmailVerify){
        const email = kerbrosId+"@iitd.ac.in";
        try {
            await this.mailService.sendMail(email,"Testing","Hey i am Testing");
        } catch (error) {
            console.log(error);
        }
    }
    //registerUser

    //loginUser

    //logoutUser

    //updateDetails 

    //deleteUser

    //reportUser

}
