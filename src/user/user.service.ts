import { Injectable } from '@nestjs/common';
import { PrismaService } from 'PrismaService';
import { MailService } from 'Mail/SendMail';
import * as otpGenerator from 'otp-generator'
@Injectable()
export class UserService {

    constructor(private prisma:PrismaService,
                private mailService:MailService
                ){}

    //Get otp on Email
    async getOTP(email:string){
        const otp = Number(otpGenerator.generate(4,{lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars:false}));
        try {
            await this.mailService.sendMail(email,"OTP:One time Password",`your otp is: ${otp}. Do not share`);
            const newOtp = this.prisma.otps.upsert({
                where:{
                    email:email
                },
                update:{OTP:otp,dateCreated:new Date()},
                create:{email:email,OTP:otp}
            });
            this.deleteExpired();
            return newOtp;
        } catch (error) {
            console.log(error);
        }

    }  

   // Delete OTPs that are older than the expiration time
    async deleteExpired() {
        const expirationTime = 5 * 60 * 1000; // 5 minutes in milliseconds
        const cutoffDate = new Date(Date.now() - expirationTime); // Calculate expiration date

        try {
            await this.prisma.otps.deleteMany({
                where: {
                    dateCreated: {
                        lt: cutoffDate, // Delete OTPs created before the cutoff date
                    },
                },
            });
            console.log("Expired OTPs deleted successfully");
        } catch (error) {
            console.error("Error deleting expired OTPs:", error);
        }
    }

    //Verify otp
    async verifyOTP(email:string,otp:number){
        const result = await this.prisma.otps.findUnique({
            where:{
                email:email,
                OTP:otp
            }
        });

        return result;
    }

    //Register User

    //login user

    //update user details

    //delete user

    //getDetails
    
}
