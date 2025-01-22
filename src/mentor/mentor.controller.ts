import { BadRequestException, Body, Controller, Delete, Get, HttpException, InternalServerErrorException, NotFoundException, Param, Post, Put, Req, Res, UnauthorizedException, UseGuards, ValidationPipe } from '@nestjs/common';
import { id, mentorDTO, passDTO, time, UpdateMentorDTO } from './mentor.validation';
import { MentorService } from './mentor.service';
import { AuthGaurd, emailGaurd, MentorAuthGaurd } from 'src/auth/auth.service';
import { loginDTO, otpDTO, passdto } from 'src/user/user.validation';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Controller('mentor')
export class MentorController {

    constructor(private mentorService:MentorService,
        private jwtservice:JwtService
    ){}

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
            if(error instanceof InternalServerErrorException){
                throw new BadRequestException("User already exists");
            }
            throw new InternalServerErrorException("Something went wrong");
        }
    }

    //update mentor
    @Put('/')
    @UseGuards(MentorAuthGaurd)
    async updateMentor(@Body(new ValidationPipe({whitelist:true})) data:UpdateMentorDTO,@Req() req:any){
        try {
            console.log(req.user);
            const result = await this.mentorService.updateMentor(req.user.kerbros,data);
            return {
                success:true,
                user:result
            }
        } catch (error) {
            throw new InternalServerErrorException("Something went wrong");
        }
    }

    @Post('/login')
    async login(@Body(new ValidationPipe({whitelist:true})) data:loginDTO,@Res() res:any){
        try {
            const result = await this.mentorService.loginUser(data.kerbrosId,data.password);
            
            if(!result){
                throw new UnauthorizedException("Invalid Credentials");
            }

            //create token
            //User is verified
            const token = this.jwtservice.sign({
                kerbros:data.kerbrosId
            },{
                secret:process.env.SECRET_KEY
            });
          
            //Add token to user list
            await this.mentorService.addToken(token,data.kerbrosId);
                
            // Embed token in HTTP-only cookie
            res.cookie('loginToken', token, {
                httpOnly: true,   // Corrected to lowercase
                secure: false,    // Set to `true` in production with HTTPS
                maxAge: 3600000,  // 1 hour
                sameSite: 'strict'
            });
        
            return res.status(200).json({ message: 'Login successfully' });
        } catch (error) {
            if(error instanceof NotFoundException || error instanceof UnauthorizedException){
                throw error;
            }

            throw new InternalServerErrorException("Something went wrong");
        }
    }

    //logout from a device
    @Post('/logout/')
    @UseGuards(MentorAuthGaurd)
    async logout(@Req() req: any, @Res() res: any) {
        const token = req.cookies['loginToken'];
        
        if(!token){
        res.status(200).send("Logged out successfully");
        }
        try {
            //check delete this token
        const result = await this.mentorService.removeToken(req.user.kerbros,token);
        
        
        res.clearCookie('loginToken', {
            httpOnly: true,  // Corrected capitalization
            secure: false,   // Set to `true` in production with HTTPS
            sameSite: 'strict',
        });
        
        return res.status(200).json({ message: 'Logout successful' });
        } catch (error) {
        console.log(error);
        throw new InternalServerErrorException("Something went wrong");
        }
    }

    //Logout from all device 
    @Post('/logoutall')
    @UseGuards(MentorAuthGaurd)
    async logoutall(@Res() res:any,@Req() req:any){

        try {
        await this.mentorService.removeallTokens(req.user.kerbros);
        res.clearCookie('loginToken', {
            httpOnly: true,  // Corrected capitalization
            secure: false,   // Set to `true` in production with HTTPS
            sameSite: 'strict',
        });
    
        return res.status(200).json({ message: 'Logout successful' });
        } catch (error) {
        console.log(error);
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
            console.log("Yaha tak to pahunch gaya");
            if(error instanceof PrismaClientKnownRequestError){
                console.log(error.code);
                return error;
            }
            return error;
            throw new InternalServerErrorException("Something went wrong");
        }
    }
    
    //add time for mentor
    @Put('/time/:id')
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

    @Post('/forgotPassword')
    async getOTP(@Body(new ValidationPipe()) data:passDTO){
        const email = data.kerbros+"@iitd.ac.in";

        try {
            const otp = await this.mentorService.sendOTP(email);
            return {
                success:true,
                message:"OTP sent successfully"
            }
        } catch (error) {
            throw new InternalServerErrorException("Something went wrong");
        }
    }

    //Verify otp
    @Post('/verifyOTP')
    async verifyOTP(
        @Body(new ValidationPipe({ whitelist: true })) data: otpDTO,
        @Res() res: any
    ) {
        const email = data.kerbros + "@iitd.ac.in";
        const otp = Number(data.otp);
    
        try {
        const result = await this.mentorService.verifyOTP(email, otp);
    
        if (!result) {
            throw new UnauthorizedException('Incorrect or expired OTP');
        }
    
        const token = this.jwtservice.sign(
            { email: data.kerbros },
            {
            secret: process.env.SECRET_KEY,
            expiresIn: '1h'  // Optional: Set expiration for the token
            }
        );
    
        // Embed token in HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,   // Corrected to lowercase
            secure: false,    // Set to `true` in production with HTTPS
            maxAge: 3600000,  // 1 hour
            sameSite: 'strict'
        });
    
        return res.status(200).json({ message: 'OTP verified successfully' });
    
        } catch (error) {
        if (error instanceof HttpException) {
            throw error;
        }
        throw new InternalServerErrorException('Something went wrong');
        }
    }

    //Update the password
    @Post('/setNew')
    @UseGuards(emailGaurd,AuthGaurd)
    async setNew(@Body(new ValidationPipe({whitelist:true})) password:passdto,@Req() req:any){
        try { 
        await this.mentorService.setNewPassword(req.user.kerbrosId,password.password);
        return {
            success:true,
            message:"Password updated successfully"
        }
        } catch (error) {
        console.log(error);

        throw new InternalServerErrorException(error);
        }
    }

}
