import { Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, Post, Put, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { doubtDTO, updateDoubtDTO } from './doubtsValidation';
import { AuthGaurd } from 'src/auth/auth.service';
import { DoubtsService } from './doubts.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Controller('doubts')
export class DoubtsController {
    
    constructor(private doubtService:DoubtsService){}

    //create a doubt
    @Post('/')
    @UseGuards(AuthGaurd)
    async createDoubt(@Body(new ValidationPipe({whitelist:true})) data:doubtDTO){
        try {
            const result = await this.doubtService.createDoubt(data);
            return{
                success:true,
                doubt:result
            }
        } catch (error) {
            console.log(error);
            
            throw new InternalServerErrorException("Something went wrong");
        }
    }

    //delete a doubt
    @Delete('/:id')
    async deleteDoubt(@Param('doubtId') doubtId:string){
        try {
            await this.doubtService.deleteDoubt(doubtId);
            return {
                success:true,
                message:"Doubt deleted successfully"
            }
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code == "P2025"){
                    throw new NotFoundException("Doubt not found");
                }
            }
            throw new InternalServerErrorException("Something went wrong");
        }
    }

    //update a doubt
    @Put('/:id')
    async updateDoubt(@Param('id') id:string,@Body(new ValidationPipe()) data:updateDoubtDTO){
        try {
            const result = await this.doubtService.updateDoubt(id,data);
            return {
                success:true,
                doubt:result
            }
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code == "P2025"){
                    throw new NotFoundException("Doubt not found");
                }
            }
            throw new InternalServerErrorException("Something went wrong");            
        }
    }
    //resolve a doubt
    @Put('/resolve/:id')
    async resolveDoubt(@Param('id') id:string){
        try {
            const result = await this.doubtService.resolveDoubt(id);
        } catch (error) {
            throw new InternalServerErrorException("Something went wrong");
        }
    }

    // getAll doubts
    @Get('/doubts/all')
    async allDoubts(){
        try {
            const result = await this.doubtService.getall();
            return {
                success:true,
                doubts:result
            }
        } catch (error) {
            throw new InternalServerErrorException("Something went wrong");
        }
    }

    //Get all user doubts
    @Get('/me/')
    @UseGuards(AuthGaurd)
    async userDoubts(@Req() req:any){
        const userId = req.user._id;
        try {
            const result = await this.doubtService.getUserDoubts(userId);
            return {
                success:true,
                doubts:result
            }
        } catch (error) {
            throw new InternalServerErrorException("Something went wrong");            
        }
    }
}
