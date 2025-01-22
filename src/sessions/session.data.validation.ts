import { IsDataURI, IsDateString, IsNotEmpty, IsOptional, IsString, IsUrl, Length, Matches } from "class-validator"

export class sessionDTO{
    @IsString()
    @Matches(/^[a-z]{3}\d{3}$/,{
        message:"Course code should be of the form aaa000"
    })
    @IsNotEmpty()
    course:string

    @IsString()
    @Length(24)
    mentorId:string

    @IsDateString()
    @IsNotEmpty()
    startTime:string

    @IsDateString()
    @IsNotEmpty()
    endTime:string

    @IsNotEmpty()
    @IsUrl()
    joinLink:string

    @IsOptional()
    @IsUrl()
    assets:string
}

export class updateData{
    @IsString()
    @Matches(/^[a-z]{3}\d{3}$/,{
        message:"Course code should be of the form aaa000"
    })
    @IsOptional()
    course:string

    @IsString()
    @Length(24)
    mentorId:string

    @IsDateString()
    @IsOptional()
    startTime:string

    @IsDateString()
    @IsOptional()
    endTime:string

    @IsOptional()
    @IsUrl()
    joinLink:string

    @IsOptional()
    @IsUrl()
    assets:string
}

//Filter by time
//filter by mentor
//filter by course
export class filter{

    @IsOptional()
    course:string

    @IsString()
    @Length(24)
    @IsOptional()
    mentorId:string
}
