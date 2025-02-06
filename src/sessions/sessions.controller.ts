import { BadRequestException, Body, Controller, Delete, Get, HttpException, InternalServerErrorException, NotFoundException, Param, Post, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { filter, sessionDTO, updateData } from './session.data.validation';
import { SessionsService } from './sessions.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Roles, RolesGuard } from 'src/auth/role.gaurd';
import { AnyAuthGuard, AuthGaurd } from 'src/auth/auth.service';
import { Url } from 'url';

@Controller('sessions')
export class SessionsController {

    constructor(private readonly sessionService:SessionsService){}

    //create a session
    @Post('/')
    @Roles('admin','superadmin')
    @UseGuards(AuthGaurd,RolesGuard)
    async createSession(@Body(new ValidationPipe({whitelist:true})) data:sessionDTO){
        try {
        
            const startDate = new Date(data.startTime);
            const endDate = new Date(data.endTime);

            if(!endDate || !startDate){
                throw new BadRequestException("Invalid Dates provided");
            }

            if(endDate < startDate){
                throw new BadRequestException("End Date cannot be in past");
            }
            
            const result = await this.sessionService.createSession(data);
            return {
                success:true,
                session:result
            }
        } catch (error) {
            console.log(error);
            if(error instanceof HttpException){
                throw error;
            }
            throw new InternalServerErrorException("Something went wrong");
        }
    }

    //delete a session
    @Delete('/:id')
    @Roles('admin','superadmin')
    @UseGuards(AuthGaurd,RolesGuard)
    async deleteSession(@Param('id') id:string){
        try {
            await this.sessionService.deleteSession(id);
            return {
                success:true,
                message:"Session deleted successfully"
            }
        } catch (error)  {
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code == "P2025"){
                    throw new NotFoundException("No User found");
                }
                if(error.code == "P2023"){
                    throw new BadRequestException("Invalid Id provided");
                }
            }
            throw new InternalServerErrorException("Something went wrong");
        }   
    }

    //update a session details
    @Put('/:id')
    @Roles('admin','superadmin')
    @UseGuards(AuthGaurd,RolesGuard)
    async updateSession(@Param('id') id:string,@Body(new ValidationPipe({whitelist:true})) data:updateData){
        try {
            const result = await this.sessionService.updateSession(id,data);
            return {
                success:true,
                session:result
            }
        } catch (error) 
            {
                if(error instanceof PrismaClientKnownRequestError){
                    if(error.code == "P2025"){
                        throw new NotFoundException("No User found");
                    }
                    if(error.code == "P2023"){
                        throw new BadRequestException("Invalid Id provided");
                    }
                }
                throw new InternalServerErrorException("Something went wrong");
            }
    }

    //get session details
    @Get('/:id')
    async sessionDetail(@Param('id') id:string){
        try {
            const result = await this.sessionService.sessionDetails 
            (id);
            if(!result){
                throw new NotFoundException("Session not found");
            }
            return {
                success:true,
                session:result
            }
        } catch (error) {
            if(error instanceof NotFoundException){
                throw error;
            }

            throw new InternalServerErrorException("Something went wrong");
        }
    }

    @Get('/live/all')
    async liveSession(){
        try {
            const result = await this.sessionService.liveSessions();
            return{
                success:true,
                sessions:result
            }
        } catch (error) {
            throw new InternalServerErrorException("Something went wrong");
        }
    }
    @Get('/past/all')
    async pastSession(){
        try {
            const result = await this.sessionService.pastSessions();
            return{
                success:true,
                sessions:result
            }
        } catch (error) {
            throw new InternalServerErrorException("Something went wrong");
        }
    }
    @Get('/upcomming/all')
    async upcomming(){
        try {
            const result = await this.sessionService.upcommingSession();
            return{
                success:true,
                sessions:result
            }
        } catch (error) {
            throw new InternalServerErrorException("Something went wrong");
        }
    }

    //get all sessions filter
    @Get('/filter/all')
    async filterSessions(@Body() data:filter){
        try {
            const result = await this.sessionService.filterSessions(data);
            return {
                success:true,
                sessions:result
            }
        } catch (error) {
            throw new InternalServerErrorException("Something went wrong");
        }
    }

    @Put('/joinLink/:id')
    @Roles('admin','mentor')
    @UseGuards(AnyAuthGuard,RolesGuard)
    async addJoinLink(@Param('id') id:string,@Body('joinLink') joinLink:string){
        try {
            const result = await this.sessionService.addJoinLink(id,joinLink);
            return {
                success:true,
                session:result
            }
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code == "P2025"){
                    throw new NotFoundException("No User found");
                }
                if(error.code == "P2023"){
                    throw new BadRequestException("Invalid Id provided");
                }
            }   

            throw new InternalServerErrorException("Something went wrong");
        }
    }


    @Put('/assests/:id')
    async addAssestLink(@Param('id') id:string,@Body('assestLink') link:Url){
        try {
            const result = await this.addAssestLink(id,link);
            return {
                success:true,
                session:result
            }
        } catch (error) {

            if(error instanceof PrismaClientKnownRequestError){
                if(error.code == "P2023"){
                    throw new BadRequestException("Invalid Id Provided");
                }
            }

            throw new InternalServerErrorException("Something went wrong");
        }
    }
}   
