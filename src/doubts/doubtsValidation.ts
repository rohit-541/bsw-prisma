import { IsNotEmpty, IsOptional, IsString, IsUrl, Length, Matches } from "class-validator"

export class doubtDTO{
    @IsNotEmpty()
    @Length(24)
    @IsString()
    userId:string

    @IsNotEmpty()
    @IsString()
    heading:string

    @IsNotEmpty()
    @IsString()
    @Matches(/^[a-z]{3}\d{3}$/,{
        message:"course structure must be of form aaa000!"
    })
    course:string

    @IsOptional()
    @IsString()
    @Length(15)
    text:string

    @IsOptional()
    @IsUrl()
    imageUrl:string
}

export class updateDoubtDTO{
    @IsOptional()
    @IsString()
    @Matches(/^[a-z]{3}\d{3}$/,{
        message:"course structure must be of form aaa000!"
    })
    course:string

    @IsOptional()
    @IsString()
    @Length(15)
    text:string

    @IsString()
    @IsOptional()
    heading:string

    @IsOptional()
    @IsUrl()
    imageUrl:string
}

export class courseCode{
    @IsNotEmpty()
    @IsString()
    @Matches(/^[a-z]{3}\d{3}$/,{
        message:"Course code should be of the form aaa000"
    })
    courseCode:string
}