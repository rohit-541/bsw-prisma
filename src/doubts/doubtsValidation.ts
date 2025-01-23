import { IsNotEmpty, IsOptional, IsString, IsUrl, Length, Matches } from "class-validator"

export class doubtDTO{
    @IsNotEmpty()
    @Length(24)
    @IsString()
    userId:string

    @IsNotEmpty()
    @IsString()
    @Matches(/^[a-z]{3}\d{3}$/,{
        message:"course structure must be of form aaa000!"
    })
    course:string

    @IsNotEmpty()
    @IsString()
    @Length(15)
    text:string

    @IsOptional()
    @IsUrl()
    imageUrl:string
}