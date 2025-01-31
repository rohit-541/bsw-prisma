import {Injectable, InternalServerErrorException, NotFoundException, UseGuards,UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import { PrismaService } from 'src/prisma/prisma.service';
import * as otpGenerator from 'otp-generator'
import { MailService } from 'src/mail/mail.service';
import { Roles } from 'src/auth/role.gaurd';

@Injectable()
export class MentorService {

    constructor(private readonly prisma:PrismaService,
                private readonly mail:MailService
){}

    //create mentor
    async createMentor(data:any){
        const hashedPassword = await bcrypt.hash(data.password,12);
        data.password = hashedPassword;
        const result = await this.prisma.mentor.create({
            data:data
        });
        return {
            id:result.id,
            name:result.name,
            email:result.email,
            contact:result.contact,
            Gender:result.Gender,
            kerbros:result.kerbros,
            hostel:result.hostel,
            course:result.course,
            hours:result.hours,
            role:result.role,
        };
    }
    
    //update mentor
    async updateMentor(kerbros:string,data:any){
        const result = await this.prisma.mentor.update({
            where:{
                kerbros:kerbros
            },
            data:data,
            select:{
                id:true,
                kerbros:true,
                name:true,
                contact:true,
                email:true,
            }
        });

        return result;
    }

    async loginUser(kerbros:string,password:string){

        const user = await this.prisma.mentor.findUnique({
            where:{
                kerbros:kerbros
            }
        });

        if(!user){
            throw new NotFoundException("User not found!");
        }

        if(!await bcrypt.compare(password,user.password)){
            throw new UnauthorizedException("Invalid Credentials");
        }

        return {
            id:user.id,
            name:user.name,
            email:user.email,
            contact:user.contact,
            Gender:user.Gender,
            kerbros:user.kerbros,
            hostel:user.hostel,
            course:user.course,
            hours:user.hours,
            role:user.role,
        };
    }

    //addToken to user 
    async addToken(token:string,userId:string){
        const result = await this.prisma.mentor.update({
            where:{
                kerbros:userId
            },
            data:{
                tokens:{
                    push:token
                }
            }
        });

        return true;
    }

    //delete mentor
    async deleteMentor(mentorId:any){
        const result = await this.prisma.mentor.delete({
            where:{
                id:mentorId
            }
        });

    }

        
    //remove a token
    async removeToken(kerbros:string,token:string){
        await this.prisma.mentor.updateMany({
            where: { kerbros: kerbros },
            data: {
              tokens: {
                set: (await this.prisma.mentor.findUnique({
                  where: { kerbros: kerbros },
                  select: { tokens: true },
                })).tokens.filter(item => item !== token),
              },
            },
          });

          return true;
    }

    //logoutall
    async removeallTokens(kerbros:string){
        const result = await this.prisma.mentor.update({
            where:{
                kerbros:kerbros
            },
            data:{
                tokens:{
                    set:[]
                }
            }
        });
        return true;
    }


    //Add hours 
    //Time must be provided in minutes
    async addTime(mentorId:any,time:any){
        const result = await this.prisma.mentor.update({
            where:{
                id:mentorId
            },
            data:{
                hours:{
                    increment:Number(time)
                }
            },
            select:{
                id:true,
                name:true,
                kerbros:true,
                hours:true,
            }
        });

        return result;
    }

    //Update exact time
    async updateTime(mentorId:any,newHours:any){
        await this.prisma.mentor.update({
            where:{
                id:mentorId
            },
            data:{
                hours:newHours
            },
            select:{
                name:true,
                email:true,
                kerbros:true
            }
        });
    }

    //Get details of mentor
    async mentorDetails(mentorId:any){
        const result = await this.prisma.mentor.findUnique({
            where:{
                id:mentorId
            },
            select:{
                name:true,
                kerbros:true,
                email:true,
                contact:true,
                course:true
            }
        });

        return result;
    }

    //Get myProfile
    async getProfile(mentorId:any){
        const result = await this.prisma.mentor.findUnique({
            where:{
                id:mentorId
            },
            select:{
                id:true,
                name:true,
                email:true,
                contact:true,
                hours:true,
                kerbros:true
            }
        });

        return result;
    }

    //send otp
    async sendOTP(kerbros:string){
        //check if mentor with this mentor exists
        const result = await this.prisma.mentor.findUnique({
            where:{
                kerbros:kerbros
            }
        });

        if(!result){
            throw new NotFoundException("User not found");
        }

        const otp:number = Number(otpGenerator.generate(4,{
            lowerCaseAlphabets:false,
            upperCaseAlphabets:false,
            specialChars:false
        }));
        try {
            this.mail.sendMail(kerbros+"@iitd.ac.in","OTP:Password Reset",`Here is your OTP: ${otp}.Do Not Share.`);
        } catch (error) {
            throw new InternalServerErrorException("Something wrong with mailing service.");
        }    
        //Create dates
         const dateStart = new Date(Date.now() + 5.5*60*60*1000);
         const dateEnd = new Date(Date.now() + 5.5*60*60*1000 +5*60*1000);   //Expiry after 5 minutes
 
        await this.prisma.otps.upsert({
             where:{
                 email:kerbros+"@iitd.ac.in"
             },
             create:{
                 OTP:otp,
                 email:kerbros+"@iitd.ac.in",
                 createdAt:dateStart,
                 expiresAt:dateEnd,
             },
             update:{
                 OTP:otp,
                 createdAt:dateStart,
                 expiresAt:dateEnd
             }
         });
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

     //forgot password 
    async setNewPassword(kerbros:string,password:string){
        const hashedPassword = await bcrypt.hash(password,12);
        await this.prisma.mentor.update({
            where:{
                kerbros:kerbros
            },
            data:{
                password:hashedPassword
            }
        });
        await this.mail.sendMail(`${kerbros}@iitd.ac.in`,"BSW:AcadmentorShip","Your password has been reset.If not you please update your password and revoke any email access.");
        return true;
    }
    

    async allMentors(){
        const result = await this.prisma.mentor.findMany(
            {
                select:{
                    id:true,
                    name:true,
                    email:true,
                    course:true,
                    contact:true,
                    hostel:true,
                    kerbros:true,
                    Gender:true
                }
            }
        );

        return result;
    }
}
