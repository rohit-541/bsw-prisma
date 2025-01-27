import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class RepliesService {
    
    constructor(private prisma:PrismaService){}

    //create a reply
    async createReply(data:any,userId:string){
        const result = await this.prisma.replies.create({
            data:{
                userId:userId,
                ...data
            }
        });
        return result;
    }

    //delete a reply
    async deleteReply(replyId:string,userId:string){

        const result = await this.prisma.replies.findUnique({
            where:{
                id:replyId
            }
        });

        if(result.userId != userId){
            const parentDoubt = await this.prisma.doubts.findUnique({
                where:{
                    id:result.doubtId
                }
            });

            if(userId != parentDoubt.userId){
                throw new UnauthorizedException("You are not allowed to do this operation!");
            }
        }

        await this.prisma.replies.delete({
            where:{
                id:replyId
            }
        });

        return true;
    }

    //update a reply
    async updateReply(replyId:string,data:any){
        const result = await this.prisma.replies.update({
            where:{
                id:replyId
            },
            data:data
        });

        return result;
    }

    //get all reply of a doubt
    async allReply(doubtId:string){
        const result = await this.prisma.replies.findMany({
            where:{
                doubtId:doubtId
            },
            select:{
                replyText:true,
                User:{
                    select:{
                        name:true,
                        kerbrosId:true,
                    }
                }
            }
        });
        return result;
    }
}
