import { BadRequestException, Body, Controller, Delete, FileTypeValidator, Get, HttpException, InternalServerErrorException, MaxFileSizeValidator, NotFoundException, Param, ParseFilePipe, Post, Put, Req, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { doubtDTO, updateDoubtDTO } from './doubtsValidation';
import { AuthGaurd, MentorAuthGaurd } from 'src/auth/auth.service';
import { DoubtsService } from './doubts.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskOptions } from 'src/mentor/multer.config';
import {unlink} from 'fs'

@Controller('doubts')
export class DoubtsController {
    
    constructor(private doubtService:DoubtsService){}

    //create a doubt
    @Post('/')
    @UseGuards(AuthGaurd)
    @UseInterceptors(FileInterceptor('image',diskOptions))
    async createDoubt(@UploadedFile() image:Express.Multer.File,@Body(new ValidationPipe({whitelist:true})) data:doubtDTO,@Req() req:any){

        if(image && image.size >= 10000000){
            this.doubtService.deleteFile(`uploads/${image.filename}`);
            throw new BadRequestException("File size cannot be greater than 10mb");
        }

        if(image  && !image?.mimetype.startsWith('image/')){
            this.doubtService.deleteFile(`uploads/${image.filename}`);
            throw new BadRequestException("File should be of Image type");
        }

        if(image){
            data.imageUrl = `uploads/${image.filename}`;
        }

        try {
            if(data.userId != req.user.id){
                this.doubtService.deleteFile(data.imageUrl);
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
                if(error.code =="P2023"){
                    throw new BadRequestException("Invalid Id format");
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
                if(error.code =="P2023"){
                    throw new BadRequestException("Invalid Id Provided");
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

            if(error instanceof PrismaClientKnownRequestError){
                if(error.code =="P2025"){
                    throw new NotFoundException("Doubt not found!");
                }

                if(error.code == "P2023"){
                    throw new BadRequestException("Invalid Id Provided");
                }
            }

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
        const userId = req.user.id;
    
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

    //Add Image
    @Post('/updateImage/:id')
    @UseGuards(AuthGaurd)
    @UseInterceptors(FileInterceptor('image',diskOptions))
    async updateImage(@UploadedFile() image:Express.Multer.File,@Param('id') id:string,@Req() req:any){
        const userId = req.user.id;
        if(image==null){
            throw new BadRequestException("Image is required");
        }
        
        const imageUrl = `uploads/${image.filename}`;

        if(image.size >= 10000000){
            this.doubtService.deleteFile(imageUrl);
            throw new BadRequestException("File size cannot be greater than 10mb");
        }

        if(!image.mimetype.startsWith('image/')){
            this.doubtService.deleteFile(imageUrl);
            throw new BadRequestException("File should be of Image type");
        }



        try {
            const result = await this.doubtService.updateImage(id,userId,imageUrl);
            return{
                success:true,
                doubt:result
            }
        } catch (error) {
            if(error instanceof HttpException){
                throw error;
            }

            if(error instanceof PrismaClientKnownRequestError){
                if(error.code == "P2023"){
                    this.doubtService.deleteFile(imageUrl);
                    throw new BadRequestException("Invalid Doubt Id provided");
                }
            }

            throw new InternalServerErrorException("Something went wrong");
        }
    }
}
