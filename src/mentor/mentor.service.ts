import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import { PrismaService } from 'src/prisma/prisma.service';
import { id } from './mentor.validation';

@Injectable()
export class MentorService {

    constructor(@Inject()private readonly prisma:PrismaService){}

    //create mentor
    async createMentor(data:any){
        const hashedPassword = await bcrypt.hash(data.password,12);
        data.password = hashedPassword;
        const result = await this.prisma.mentor.create(data);
        return result;
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

    //delete mentor
    async deleteMentor(mentorId:any){
        await this.prisma.mentor.delete({
            where:{
                id:mentorId
            }
        });
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
}
