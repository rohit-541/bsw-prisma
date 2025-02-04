import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs'
import { join } from 'path';

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

        await this.prisma.replies.deleteMany({
            where:{
                doubtId:doubtId
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

    //DeleteFile
    deleteFile(imageUrl:string){
        //delete the image
        const pathImage = join(__dirname,"..","..","..",'public',imageUrl);
        fs.unlink(pathImage,(err)=>{
            if(err){
                console.log(err);
            }
        });
    }


    //Upload image to doubt
    async updateImage(doubtId:string,userId:string,imageUrl:string){
        //Get the doubt
        const doubtObj = await this.prisma.doubts.findUnique({
            where:{
                id:doubtId
            }
        });

       //if doubt not found
       if(!doubtObj){
            this.deleteFile(imageUrl);
            throw new NotFoundException("Doubt not found!");
       }

       //validation
       if(doubtObj.userId != userId){
            this.deleteFile(imageUrl);
            throw new UnauthorizedException("You not allowed to update other's doubt");
       }

       if(doubtObj.imageUrl){
         //delete the image 
            this.deleteFile(doubtObj.imageUrl);
       }

       const result = await this.prisma.doubts.update({
            where:{
                id:doubtId
            },
            data:{
                imageUrl:imageUrl
            },
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
       });

       return result;
    }


}
