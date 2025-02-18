import { IsDataURI, IsDateString, isNotEmpty, IsNotEmpty, IsOptional, IsString, IsUrl, Length, Matches } from "class-validator"

export class sessionDTO{
    @IsString()
    @Matches(/^[a-z]{3}\d{3}$/,{
        message:"Course code should be of the form aaa000"
    })
    @IsNotEmpty()
    course:string

    @IsNotEmpty()
    @IsString()
    @Length(24)
    mentorId1:string
    
    @IsNotEmpty()
    @IsString()
    @Length(24)
    mentorId2:string

    @IsDateString()
    @IsNotEmpty()
    startTime:string

    @IsDateString()
    @IsNotEmpty()
    endTime:string

    @IsOptional()
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

    @IsOptional()
    @IsString()
    @Length(24)
    mentorId1:string
    
    @IsOptional()
    @IsString()
    @Length(24)
    mentorId2:string

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
