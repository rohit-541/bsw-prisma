import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { unlink } from 'fs';
import { join } from 'path';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class RepliesService {
    
    constructor(private prisma:PrismaService){}

    //create a reply
    async createReply(data:any,userId:string,role:String){

        //Verify if doubt exists
        const doubt = await this.prisma.doubts.findUnique({
            where:{
                id:data.doubtId
            }
        });

        if(!doubt){
            throw new NotFoundException("Doubt with this Id not found!");
        }

        //Check what is the role of reply Added
        if(role == "user"){
            const result = await this.prisma.replies.create({
                data:{
                    userId:userId,
                    ...data
                }
            });
            return result;
        }else if(role == 'Mentor'){
            const result = await this.prisma.replies.create({
                data:{
                    mentorId:userId,
                    ...data
                }
            });
            return result; 
        }
        
    }

    //DeleteFile
    deleteFile(imageUrl:string){
        //delete the image
        const pathImage = join(__dirname,"..","..","..",'public',imageUrl);
        unlink(pathImage,(err)=>{
            if(err){
                console.log(err);
            }
        });
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
    async updateReply(replyId:string,data:any,userId:string){
        const result = await this.prisma.replies.update({
            where:{
                id:replyId,
                userId:userId
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
                        id:true,
                        name:true,
                        kerbrosId:true,
                    }
                },
                Mentor:{
                    select:{
                        id:true,
                        name:true,
                        kerbros:true
                    }
                },
                imageUrl:true,
            }
        });
        return result;
    }
}
