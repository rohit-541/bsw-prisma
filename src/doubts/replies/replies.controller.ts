import { BadRequestException, Body, Controller, Delete, Get, HttpException, InternalServerErrorException, Param, Post, Put, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AnyAuthGuard, AuthGaurd } from 'src/auth/auth.service';
import { replyDTO, updateReplyDto } from './replyDTO';
import { RepliesService } from './replies.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Controller('replies')
export class RepliesController {

    constructor(private replyService:RepliesService){}

    //create a reply
    @Post('/')
    @UseGuards(AnyAuthGuard)
    async createReply(@Body(new ValidationPipe({whitelist:true})) data:replyDTO,@Req() req:any){
        const userId = req.user.id;
        try {
            const result = await this.replyService.createReply(data,userId);
            return {
                success:true,
                reply:result
            }
        } catch (error) {
            if(error instanceof HttpException){
                throw error;
            }
            throw new InternalServerErrorException("Something went wrong");
        }
    }

    //delete a reply
    @Delete('/:id')
    @UseGuards(AnyAuthGuard)
    async deleteReply(@Param('id') id:string,@Req() req:any){
        //Two user can delete reply 
        //1.User whose doubt is that 
        //2. User who created that reply
        const userId = req.user.id;
        try {
            await this.replyService.deleteReply(id,userId);
            return {
                success:true,
                message:"Reply Deleted Successfully"
            }
        } catch (error) {

            console.log("Error: ",error);

            if(error instanceof HttpException){
                throw error;
            }

            throw new InternalServerErrorException("Something went wrong!");
        }
    }

    //update a reply
    @Put('/:id')
    @UseGuards(AnyAuthGuard)
    async updateReply(@Req() req:any,@Body(new ValidationPipe({whitelist:true})) data:updateReplyDto,@Param('id') id:string){

        //Only user who posted it is able to update it
        const userId = req.user.id;
        try {
            console.log(data);
            const result = await this.replyService.updateReply(id,data,userId);
            return {
                success:true,
                reply:result
            }
        } catch (error) {
            console.log(error);
            if(error instanceof HttpException){
                throw error;
            }

            throw new InternalServerErrorException("Something went wrong!");
        }
    }

    //get all reply of a doubt
    @Get('/:id')
    async allReply(@Param('id') id:string){
        try {
            const result = await this.replyService.allReply(id);
            return {
                success:true,
                Replies:result
            }
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code ==  "P2023"){
                    throw new BadRequestException("Invalid Id Provided");
                }
            }
            throw new InternalServerErrorException("Something went wrong");
        }
    }
}
