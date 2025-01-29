import { BadRequestException, Body, Controller, Delete, Get, HttpException, InternalServerErrorException, NotFoundException, Param, Post, Put, Req, Res, UnauthorizedException, UseGuards, ValidationPipe } from '@nestjs/common';
import { emailDTO, loginDTO, otpDTO, passdto, updateDTO, userDTO } from './user.validation';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGaurd, emailGaurd } from 'src/auth/auth.service';
import { Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { MailService } from 'src/mail/mail.service';

@Controller('user')
export class UserController {

    constructor(private userService:UserService,
        private jwtService:JwtService,
        private mailService:MailService
    ){}

    //sendOTP
    @Post('/verifyEmail')
    @Post('/resetPassword')
    async sendOTP(@Body(new ValidationPipe({whitelist:true})) data:emailDTO,@Req() req:any){
        const email = data.kerbros+"@iitd.ac.in";
        try {
            console.log(req.cookies);
            this.userService.sendOTP(email);
            return {
                success:true,
                message:"OTP Sent successfully"
            }
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException("Something went wrong");
        }
    }
    
    //Verify otp
    @Post('/verifyOTP')
    async verifyOTP(
      @Body(new ValidationPipe({ whitelist: true })) data: otpDTO,
      @Res() res:any) {
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
        });
        return res.status(200).json({ message: 'OTP verified successfully',token:token });
    
      } catch (error) {
        console.log(error);
        if (error instanceof HttpException) {
          throw error;
        }

        throw new InternalServerErrorException('Something went wrong');
      }
    }

    //Update the password
    @Post('/setNew')
    @UseGuards(emailGaurd)
    async setNew(@Body(new ValidationPipe({whitelist:true})) password:passdto,@Req() req:any){
      try { 
        await this.userService.setNewPassword(req.email,password.password);
        await this.mailService.sendMail(`${req.email}@iitd.ac.in`,"BSW:AcadmentorShip","Your password has been reset.If not you please update your password and revoke any email access.");
        return {
          success:true,
          message:"Password updated successfully"
        }
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException(error);
      }
    }

    //Register User
    @Post('/register')
    @UseGuards(emailGaurd)
    async registerUser(@Body(new ValidationPipe({whitelist:true})) data:userDTO,@Req() req:any,@Res() res:any){
        try {
            const email = req.email;
            const result = await this.userService.registerUser(data,email);
                    //User is verified
            const token = this.jwtService.sign({
              kerbros:email
            },{
              secret:process.env.SECRET_KEY,
              expiresIn:'1h'
            });
            await this.userService.addToken(token,email);
            
            return res.status(200).json({ message: 'Login successfully', user:result ,token:token });

        } catch (error) {
          console.log(error);
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
    async loginUser(@Body(new ValidationPipe()) data:loginDTO,@Res() res:Response){
      try {
        const result = await this.userService.loginUser(data.kerbrosId,data.password);
        if(!result){
          throw new UnauthorizedException("Invalid Credentials");
        }
      // User is verified
      const token = this.jwtService.sign(
        {
          kerbros: data.kerbrosId,
        },
        {
          secret: process.env.SECRET_KEY,
          expiresIn: '1h', // Corrected typo
        }
      );
        
        //Add token to user list
        await this.userService.addToken(token,data.kerbrosId);
            
      console.log(res.cookie);
        return res.status(200).json({ message: 'Login successfully', user:result,token:token });
      
      } catch (error) {
        console.log(error);

        if(error instanceof HttpException){
          throw error;
        }

        throw new InternalServerErrorException("Something went wrong!");
      }
    }
    
    //delete user
    @Delete('/')
    @UseGuards(AuthGaurd)
    async deleteUser(@Req() req:any){
      try {
        const result = await this.userService.deleteUser(req.user.kerbrosId);
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
    
    //logout from a device
    @Post('/logout/')
    @UseGuards(AuthGaurd)
    async logout(@Req() req: any, @Res() res: any) {
      const token = req.headers['authorization'];
      
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
    
    //Logout from all device 
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
    @Get('/:id')
    async userDetails(@Param('id') id:string){
      try {
        const result = await this.userService.userDetails(id);
        return{
          success:true,
          user:result
        }
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException("Something went wrong");
      }
    }

    //Update user details
    @Put('/')
    @UseGuards(AuthGaurd)
    async updateDetails(@Body(new ValidationPipe({whitelist:true})) data:updateDTO,@Req() req:any){
      try {
        console.log(req.user.kerbrosId);
        const result = await this.userService.updateUser(req.user.kerbrosId,data);
        return {
          success:true,
          message:"Updated Successfully",
          user:result
        }
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException("Something went wrong");
      }
    }


}
