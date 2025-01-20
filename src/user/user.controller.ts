import { BadRequestException, Body, Controller, Get, Post, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { emailDTO, otpDTO, Responsewithcookie } from './user.validation';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
@UsePipes(new ValidationPipe())
export class UserController {

    constructor(private userService:UserService,
        private jwtService:JwtService
    ){}

    //sendOTP

    //delete expired

    //Verify otp

    //Register User

    //login user

    //update user details

    //delete user

    //get user details

}
