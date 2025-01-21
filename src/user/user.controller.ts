import { BadRequestException, Body, Controller, Delete, Get, HttpException, InternalServerErrorException, NotFoundException, Param, Post, Req, Res, UnauthorizedException, UseGuards, ValidationPipe } from '@nestjs/common';
import { emailDTO, loginDTO, otpDTO, userDTO } from './user.validation';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGaurd, emailGaurd } from 'src/auth/auth.service';
import { Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Controller('user')
export class UserController {

    constructor(private userService:UserService,
        private jwtService:JwtService
    ){}

    //sendOTP
    @Post('/verifyEmail')
    async sendOTP(@Body(new ValidationPipe({whitelist:true})) data:emailDTO){
        console.log("Reached here");
        const email = data.kerbros+"@iitd.ac.in";
        try {
            this.userService.sendOTP(email);
            return {
                success:true,
                message:"OTP Sent successfully"
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    @Post('/verifyOTP')
    async verifyOTP(
      @Body(new ValidationPipe({ whitelist: true })) data: otpDTO,
      @Res() res: Response
    ) {
      const email = data.kerbros + "@iitd.ac.in";
      const otp = Number(data.otp);
    
      try {
        const result = await this.userService.verifyOTP(email, otp);
    
        if (!result) {
          throw new UnauthorizedException('Incorrect or expired OTP');
        }
    
        const token = this.jwtService.sign(
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
    

    //Register User
    @Post('/register')
    @UseGuards(emailGaurd)
    async registerUser(@Body(new ValidationPipe({whitelist:true})) data:userDTO,@Req() req:any){
        try {
            const email = req.email;
            console.log(email);
            const result = await this.userService.registerUser(data,email);
            return {
                success:true,
                user:result
            }
        } catch (error) {

            if(error instanceof PrismaClientKnownRequestError){
                if(error.code == "P2002"){
                    throw new BadRequestException("User already exists");
                }
            }

            throw new InternalServerErrorException("Something went wrong!");
        }
    }

    //login user
    @Post('/login')
    async loginUser(@Body(new ValidationPipe()) data:loginDTO,@Res() res:any){
      try {
        const result = await this.userService.loginUser(data.kerbrosId,data.password);
        if(!result){
          throw new UnauthorizedException("Invalid Credentials");
        }

        //User is verified
        const token = this.jwtService.sign({
          kerbros:data.kerbrosId
        },{
          secret:process.env.SECRET_KEY
        });
        
        //Add token to user list
        await this.userService.addToken(token,data.kerbrosId);
            
        // Embed token in HTTP-only cookie
        res.cookie('loginToken', token, {
          httpOnly: true,   // Corrected to lowercase
          secure: false,    // Set to `true` in production with HTTPS
          maxAge: 3600000,  // 1 hour
          sameSite: 'strict'
        });
    
        return res.status(200).json({ message: 'Login successfully' });
      
      } catch (error) {
        if(error instanceof UnauthorizedException){
          throw error;
        }
        throw new InternalServerErrorException("Something went wrong!");
      }
    }

    //update user details
    
    //delete user
    @Delete('/:id')
    @UseGuards(AuthGaurd)
    async deleteUser(@Param('id') id:string,@Req() req:any){
      try {
        const result = await this.userService.deleteUser(id,req.user.kerbrosId);
        return{
          success:true,
          message:"User deleted Successfully"
        }
      } catch (error) {
        if(error instanceof PrismaClientKnownRequestError){
          if(error.code == "P2025"){
            throw new NotFoundException("No User found");
          }

          if(error.code == "P2023"){
            throw new BadRequestException("Invalid Id Provided");
          }
        }

        throw new InternalServerErrorException("Something went wrong");
      }
    }
   
    @Post('/logout/')
    @UseGuards(AuthGaurd)
    async logout(@Req() req: any, @Res() res: any) {
      const token = req.cookies['loginToken'];
      
      if(!token){
        res.status(200).send("Logged out successfully");
      }
      try {
         //check delete this token
        const result = await this.userService.removeToken(req.user.kerbrosId,token);
      
      
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
    
    @Post('/logoutall')
    @UseGuards(AuthGaurd)
    async logoutall(@Res() res:any,@Req() req:any){

      try {
        await this.userService.removeallTokens(req.user.kerbrosId);
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
    
    //get user details

}
