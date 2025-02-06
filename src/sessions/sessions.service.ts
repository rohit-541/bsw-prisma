import { Injectable } from '@nestjs/common';
import { filter } from './session.data.validation';
import { PrismaService } from 'src/prisma/prisma.service';

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
                id:true,
                course:true,
                startTime:true,
                endTime:true,
                joinLink:true,
                assets:true,
                mentor1:{
                    select:{
                        id:true,
                        name:true,
                        contact:true,
                        email:true,
                        hostel:true
                    }
                },
                mentor2:{
                    select:{
                        id:true,
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
            mentor1:{
                select:{
                    id:true,
                    name:true,
                    contact:true,
                    email:true,
                    hostel:true
                }
            },
            mentor2:{
                select:{
                    id:true,
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
            id:true,
            course:true,
            startTime:true,
            endTime:true,
            joinLink:true,
            assets:true,
            mentor1:{
                select:{
                    id:true,
                    name:true,
                    contact:true,
                    email:true,
                    hostel:true
                }
            },
            mentor2:{
                select:{
                    id:true,
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
            id:true,
            course:true,
            startTime:true,
            endTime:true,
            joinLink:true,
            assets:true,
            mentor1:{
                select:{
                    id:true,
                    name:true,
                    contact:true,
                    email:true,
                    hostel:true
                }
            },
            mentor2:{
                select:{
                    id:true,
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

    //Session mentor wise
    async filterSessions(data: filter) {
        const whereClause: any = {};
        if (data?.mentorId) {
            whereClause.OR = [
                {mentorId1:data.mentorId},
                {mentorId2:data.mentorId}
            ]
        }
        if (data?.course) {
            whereClause.course = data.course;
        }

        try {
            const result = await this.prisma.session.findMany({
                where:whereClause
            });
            return result;
        } catch (error) {
            console.error("Error fetching sessions:", error);
            throw new Error("Failed to fetch sessions");
        }
    }

    //add session link
    async addJoinLink(sessionId:string,joinLink:string){
        const result = await this.prisma.session.update({
            where:{
                id:sessionId
            },
            data:{
                joinLink:joinLink
            }
        });

        return result;
    }
    
}
