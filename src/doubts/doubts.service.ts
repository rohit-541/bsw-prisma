import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class DoubtsService {

    constructor(private prisma:PrismaService){}

    //create a doubt
    async createDoubt(data:any){

        const result = await this.prisma.doubts.create({
            data:data
        });
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
            include:{
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
    async resolveDoubt(doubtId:string,email:string){
        await this.prisma.doubts.update({
            where:{
                id:doubtId
            },
            data:{
                status:"Resolved"
            }
        });

        const user = await this.prisma.mentor.findUnique({
            where:{
                kerbros:email
            }
        });

        return {
            id:user.id,
            name:user.name
        };
    }

    //getAll doubts
    async getall(){
        const result = await this.prisma.doubts.findMany(
            {
                select:{
                    id:true,
                    heading:true,
                    text:true,
                    imageUrl:true,
                    status:true,
                    user:{
                        select:{
                            id:true,
                            name:true,
                            kerbrosId:true
                        }
                    }
                }
            }
        );

        return result;
    }
    
    //Get all user doubts
    async getUserDoubts(userId:string){
        console.log(userId);
        const result = await this.prisma.doubts.findMany(  
            { where:{
                userId:userId
            },select:{
                    id:true,
                    heading:true,
                    text:true,
                    imageUrl:true,
                    status:true,
                    user:{
                        select:{
                            id:true,
                            name:true,
                            kerbrosId:true
                        }
                    }
                }
            });

        return result;
    }

    //Get doubts by course
    async doubtsBycourse(courseCode:string){
        const result  = await this.prisma.doubts.findMany({
            where:{
                course:courseCode
            },select:{
                    id:true,
                    heading:true,
                    text:true,
                    imageUrl:true,
                    status:true,
                    user:{
                        select:{
                            id:true,
                            name:true,
                            kerbrosId:true
                        }
                    }
                }
            });

        return result;
    }
}
