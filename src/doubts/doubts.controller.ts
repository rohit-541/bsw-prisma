import { Body, Controller, Delete, Get, HttpException, InternalServerErrorException, NotFoundException, Param, Post, Put, Req, UnauthorizedException, UseGuards, ValidationPipe } from '@nestjs/common';
import { doubtDTO, updateDoubtDTO } from './doubtsValidation';
import { AuthGaurd, MentorAuthGaurd } from 'src/auth/auth.service';
import { DoubtsService } from './doubts.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { RolesGuard } from 'src/auth/role.gaurd';

@Controller('doubts')
export class DoubtsController {
    
    constructor(private doubtService:DoubtsService){}

    //create a doubt
    @Post('/')
    @UseGuards(AuthGaurd)
    async createDoubt(@Body(new ValidationPipe({whitelist:true})) data:doubtDTO,@Req() req:any){
        try {
            if(data.userId != req.user.id){
                throw new UnauthorizedException("You can not post doubts on other's behalf");
            }
            const result = await this.doubtService.createDoubt(data);
            return{
                success:true,
                doubt:result
            }
        } catch (error) {
            console.log(error);
            if(error instanceof HttpException){
                throw error;
            }
            throw new InternalServerErrorException("Something went wrong");
        }
    }

    //delete a doubt
    @Delete('/:id')
    @UseGuards(AuthGaurd)
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
    @UseGuards(AuthGaurd)
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
    @UseGuards(MentorAuthGaurd)
    async resolveDoubt(@Param('id') id:string,@Req() req:any){
        try {
            const result = await this.doubtService.resolveDoubt(id,req.user.kerbros);

            return {
                success:true,
                user:result
            }
        } catch (error) {
            throw new InternalServerErrorException("Something went wrong");
        }
    }

    // getAll doubts
    @Get('/doubt/all')
    async allDoubts(){
        try {
            const result = await this.doubtService.getall();
            return {
                success:true,
                doubts:result
            }
        } catch (error) {
            console.log(error);
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
