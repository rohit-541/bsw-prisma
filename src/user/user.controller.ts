import { BadRequestException, Body, Controller, Get, Post, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { emailDTO, otpDTO, Responsewithcookie } from './user.validation';
import { MailService } from 'Mail/SendMail';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
@UsePipes(new ValidationPipe())
export class UserController {

    constructor(private userService:UserService,
        private jwtService:JwtService
    ){}

    //Get otp on Email
    @Get('/email')
    async getOtp(@Body() data:emailDTO){
        const email:string = data.kerbros+"@iitd.ac.in";
        try {
            const result = await this.userService.getOTP(email);
            console.log("Request reached here")
            return {
                success:true,
                message:"OTP sent successfully"
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    async verifyOtp(@Body() data:otpDTO,@Res() res:Responsewithcookie){
        const otp = Number(data.otp);
        const email = data.kerbros+"@iitd.ac.in";
        if(!otp){
            throw new BadRequestException("Invalid OTP");
        }

        try {
            await this.userService.verifyOTP(email,otp);
            //If successfull insert the token into cookies
            const token = this.jwtService.sign({
                email:email
            },{
                secret:process.env.SECRET_KEY||"Yourkey"
            });

            res.cookie('access_token', token, {
                httpOnly: true, // Make the cookie inaccessible to JavaScript
                secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (HTTPS)
                maxAge: 3600000, // 1 hour expiration time
              });

            return {
                success:true,
                token:token
            }
        } catch (error) {
            
        }
    }

    //Verify otp

    //Register User

    //login user

    //update user details

    //delete user

    //get user details

}
