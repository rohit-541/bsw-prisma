import { Injectable } from '@nestjs/common';
import { PrismaService } from 'PrismaService';

@Injectable()
export class DoubtsService {

    constructor(private prisma:PrismaService){}

    //create a doubt
    async createDoubt(data:any){
        const result = await this.prisma.doubts.create(data);
        return result;
    }

    //delete a doubt
    async deleteDoubt(doubtId:string){
        await this.prisma.doubts.delete({
            where:{
                id:doubtId
            }
        });
    }

    //update a doubt
    async updateDoubt(doubtId:string,data:any){
        const result = await this.prisma.doubts.update({
            where:{
                id:doubtId
            },
            data:data,
            select:{
                user:{
                    select:{
                        name:true,
                        kerbrosId:true
                    }
                }
            }
        });

        return result;
    }

    //resolve a doubt
    async resolveDoubt(doubtId:string){
        await this.prisma.doubts.update({
            where:{
                id:doubtId
            },
            data:{
                status:"Resolved"
            }
        });
    }

    //getAll doubts
    async getall(){
        const result = await this.prisma.doubts.findMany();

        return result;
    }
    //Get all user doubts
    async getUserDoubts(userId:string){
        const result = await this.prisma.doubts.findMany({
            where:{
                userId:userId
            }
        });

        return result;
    }

    //Get doubts by course
    async doubtsBycourse(courseCode:string){
        const result  = await this.prisma.doubts.findMany({
            where:{
                course:courseCode
            }
        });

        return result;
    }
}
