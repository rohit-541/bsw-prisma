import { Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, Post, Put, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { id, mentorDTO, time, UpdateMentorDTO } from './mentor.validation';
import { MentorService } from './mentor.service';
import { AuthGaurd } from 'src/auth/auth.service';

@Controller('mentor')
export class MentorController {

    constructor(private mentorService:MentorService){}

    //create mentor
    @Post()
    async createMentor(@Body(new ValidationPipe({whitelist:true})) data:mentorDTO){
        try {
            const result = await this.mentorService.createMentor(data);
            return {
                success:true,
                user:result
            }
        } catch (error) {
            throw new InternalServerErrorException("Something went wrong");
        }
    }

    //update mentor
    @Put('/')
    @UseGuards(AuthGaurd)
    async updateMentor(@Body(new ValidationPipe({whitelist:true})) data:UpdateMentorDTO,@Req() req:any){
        try {
            const result = await this.mentorService.updateMentor(req.user.kerbros,data);
            return {
                success:true,
                user:result
            }
        } catch (error) {
            throw new InternalServerErrorException("Something went wrong");
        }
    }

    //delete mentor
    @Delete('/:id')
    async deleteMentor(@Param('id',new ValidationPipe({whitelist:true})) id:id){
        try {
            await this.mentorService.deleteMentor(id);
            return {
                success:true,
                message:"Mentor Deleted Successfully"
            }
        } catch (error) {
            throw new InternalServerErrorException("Something went wrong");
        }
    }

    //add time for mentor
    @Put('/:id')
    async addTime(@Param('id',new ValidationPipe({whitelist:true})) id:id,@Body('time',new ValidationPipe({whitelist:true})) Time:time){
        try {
            const result = await this.mentorService.addTime(id,Time);
            return {
                success:true,
                user:result
            }
        } catch (error) {
            throw new InternalServerErrorException("Something went wrong");
        }
    }

    @Put('/updateTime/:id')
    async updateTime(@Param('id',new ValidationPipe({whitelist:true})) id:id,@Body('Time',new ValidationPipe({whitelist:true})) Time:time){
        try {
            const result = await this.mentorService.updateTime(id,Time);
            return {
                success:true,
                user:result
            }
        } catch (error) {
            throw new InternalServerErrorException("Something went wrong");
        }
    }

    @Get('/profile/:id')
    async profile(@Param('id',new ValidationPipe({whitelist:true})) id:id){ 
        try {
            const result = await this.mentorService.getProfile(id);
            if(!result){
                throw new NotFoundException("User not found!");
            }
            return {
                success:true,
                result:result
            }
        } catch (error) {
            if(error instanceof NotFoundException){
                throw error;
            }

            throw new InternalServerErrorException("Something went wrong");
        }
    }

    @Get('/:id')
    async mentorDetails(@Param('id',new ValidationPipe({whitelist:true})) id:id){
        try {
            const result = await this.mentorService.mentorDetails(id);
            if(!result){
                throw new NotFoundException("User Not found");
            }
            return {
                success:true,
                mentor:result
            }
        } catch (error) {
            if(error instanceof NotFoundException){
                throw error;
            }

            throw new InternalServerErrorException("Something went wrong");
        }
    }

}
