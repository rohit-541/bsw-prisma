import {Injectable } from '@nestjs/common';
import { PrismaService } from 'PrismaService';
import { MailService } from 'src/mail/mail.service';
import * as otpGenrator from 'otp-generator'

@Injectable()
export class UserService {

    constructor(private prisma:PrismaService,
                private mail:MailService){}

    //sendOTP
    async sendOTP(email:string){
        console.log("Reached Here");
        //Create a otp
        const otp = Number(otpGenrator.generate(4,{lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars:false}));

        console.log(otp);


        try {
            //Send this otp to user
            this.mail.sendMail(email,"OTP",`Your otp is ${otp}.Do not share it with others`);
        } catch (error) {
            console.log("Error: ",error);
        }


        //Create dates
        const dateStart = new Date(Date.now() + 5.5*60*60*1000);
        const dateEnd = new Date(Date.now() + 5.5*60*60*1000 +5*60*1000);   //Expiry after 5 minutes

        try {
           //Store this otp for verification
        const result = await this.prisma.otps.upsert({
            where:{
                email:email
            },
            create:{
                OTP:otp,
                email:email,
                createdAt:dateStart,
                expiresAt:dateEnd,
            },
            update:{
                OTP:otp,
                createdAt:dateStart,
                expiresAt:dateEnd
            }
        });

        console.log(result);
        return true; 
        } catch (error) {
            console.log(error);
        }

        

    }

    //verifyOTP and give registeration token
    async verifyOTP(email:string,otp:number){
        const result = await this.prisma.otps.findUnique({
            where:{
                email:email,
                OTP:otp,
                expiresAt:{
                    gte:new Date(Date.now() + 5.5*60*60*1000)
                }
            },
        });

        return result;
    }


    //Register User
    async registerUser(data:any,email:string){
        const result = await this.prisma.user.create({
            data:{
                kerbrosId:email,
                ...data
            }
        });

        return result;
    }

    //Should have verification token

    //login user

    //update user details

    //delete user

    //getDetails
    
    //forgot password 

}
