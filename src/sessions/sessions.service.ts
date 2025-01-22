import { Injectable } from '@nestjs/common';
import { PrismaService } from 'PrismaService';
import { filter } from './session.data.validation';

@Injectable()
export class SessionsService {

    constructor(private readonly prisma:PrismaService){}

    //Create a session
    async createSession(data:any){
        const result = await this.prisma.session.create({
            data:data
        });

        return result;
    }

    //delete a session
    async deleteSession(sessionId:string){
        await this.prisma.session.delete({
            where:{
                id:sessionId
            }
        });
    }

    //update a session
    async updateSession(sessionId:string,data:any){
        const result = await this.prisma.session.update({
            where:{
                id:sessionId
            },
            data:data
        });

        return result;
    }

    //Get Session details
    async sessionDetails(sessionId:string){
        const result = await this.prisma.session.findUnique({
            where:{
                id:sessionId
            },
            select:{
                course:true,
                startTime:true,
                endTime:true,
                joinLink:true,
                assets:true,
                mentor:{
                    select:{
                        name:true,
                        contact:true,
                        email:true,
                        hostel:true
                    }
                }
            }            
        });

        return result;
    }

    //get past sessions
    async pastSessions(){
        const result = await this.prisma.session.findMany({
        where:{
            endTime:{
                lte:new Date(Date.now() + 5.5*60*60*1000)
            }
        },
        select:{
            course:true,
            startTime:true,
            endTime:true,
            joinLink:true,
            assets:true,
            mentor:{
                select:{
                    name:true,
                    contact:true,
                    email:true,
                    hostel:true
                }
            }
        }            
        });

        return result;
    }

    //get live sessions

    async liveSessions(){
        const result = await this.prisma.session.findMany({
        where:{
            endTime:{
                gte:new Date(Date.now() + 5.5*60*60*1000)
            },
            startTime:{
                lte:new Date(Date.now() + 5.5*60*60*1000)
            }
        },
        select:{
            course:true,
            startTime:true,
            endTime:true,
            joinLink:true,
            assets:true,
            mentor:{
                select:{
                    name:true,
                    contact:true,
                    email:true,
                    hostel:true
                }
            }
        }            
        });

        return result;
    }

    //get upcomming sessions
    async upcommingSession(){
        const result = await this.prisma.session.findMany({
        where:{
            startTime:{
                gte:new Date(Date.now() + 5.5*60*60*1000)
            }
        },
        select:{
            course:true,
            startTime:true,
            endTime:true,
            joinLink:true,
            assets:true,
            mentor:{
                select:{
                    name:true,
                    contact:true,
                    email:true,
                    hostel:true
                }
            }
        }            
        });

        return result;
    }

    //filter sessions
    async filterSessions(data:filter){
        const result = await this.prisma.session.findMany({
            where:{
                mentorId:data?.mentorId || {},
                course:data?.course||{},
            }
        });
        return result;
    }
}
