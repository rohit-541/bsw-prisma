import {Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import * as otpGenrator from 'otp-generator'
import * as bcrypt from 'bcrypt'
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {

    constructor(private prisma:PrismaService,private mail:MailService){}

    //sendOTP
    async sendOTP(email:string){
        //Create a otp
        const otp = Number(otpGenrator.generate(4,{lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars:false}));

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
        const hashedPassword = await bcrypt.hash(data.password,12);
        data.password = hashedPassword;
        const result = await this.prisma.user.create({
            data:{
                kerbrosId:email,
                ...data
            }
        });

        return result;
    }

    //login user
    async loginUser(kerbrosId:string,password:string){
        const result = await this.prisma.user.findUnique({
            where:{
                kerbrosId:kerbrosId,
            }
        });

        if(!result){
            throw new NotFoundException("User not found!");
        }

        const resultCompare = await bcrypt.compare(password,result.password);
        if(!resultCompare){
            return null;
        }

        return {
            id:result.id,
            name:result.name,
            hostel:result.hostel,
            kerbrosId:result.kerbrosId,
            role:result.role,
        };
    }

    //addToken to user 
    async addToken(token:string,userId:string){
        const result = await this.prisma.user.update({
            where:{
                kerbrosId:userId
            },
            data:{
                tokens:{
                    push:token
                }
            }
        });

        return true;
    }


    //delete user
    async deleteUser(kerbros:string){
        const result = await this.prisma.user.delete({
            where:{
                kerbrosId:kerbros
            }
        });
        
        return result;
    }
    
    //remove a token
    async removeToken(kerbros:string,token:string){
        await this.prisma.user.updateMany({
            where: { kerbrosId: kerbros },
            data: {
              tokens: {
                set: (await this.prisma.user.findUnique({
                  where: { kerbrosId: kerbros },
                  select: { tokens: true },
                })).tokens.filter(item => item !== token),
              },
            },
          });

          return true;
    }
    
    //logoutall
    async removeallTokens(kerbros:string){
        const result = await this.prisma.user.update({
            where:{
                kerbrosId:kerbros
            },
            data:{
                tokens:{
                    set:[]
                }
            }
        });
        return true;
    }

    //getDetails
    async userDetails(userId:string){
        const result = await this.prisma.user.findUnique({
            where:{
                id:userId
            },
            select:{
                name:true,
                kerbrosId:true,
                hostel:true,
            }
        });

        return result;
    }
    
    //Update details
    async updateUser(kerbros:string,data:any){
        const result = await this.prisma.user.update({
            where:{
                kerbrosId:kerbros
            },
            data:data,
            select:{
                id:true,
                kerbrosId:true,
                name:true,
                hostel:true
            }
        });

        return result;
    }

    //forgot password 
    async setNewPassword(kerbros:string,password:string){
        const hashedPassword = await bcrypt.hash(password,12);
        await this.prisma.user.update({
            where:{
                kerbrosId:kerbros
            },
            data:{
                password:hashedPassword
            }
        });
        return true;
    }

    //Update role of user
    async updateRole(kerbros:string,newRole:string){
        
    }
}
