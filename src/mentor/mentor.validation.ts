import { Gender, Hostels } from "@prisma/client";
import { IsEmail, IsEnum, isHexadecimal, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Matches, Max, Min } from "class-validator"

export class mentorDTO{
    @IsNotEmpty()
    @Length(3)
    @IsString()
    name:string

    @IsNumber()
    @Min(0)
    contact:number

    @IsNumber()
    @Min(0)
    @IsOptional()
    hours:number

    @IsNotEmpty()
    @Length(9, 9)
    @Matches(/^[a-z]{2}\d{7}$/, {
    message: 'Kerberos should be of the form aa000000',
    })
    kerbros: string; // Specify 'string' as the type

    @IsEmail()
    @IsString()
    email:string
    
    @IsNotEmpty()
    @IsString()
    @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,64}$/,{
      message:"Password should be atleast 8 character string with one upperCase ,one lowerCase,one Digit and one specialCharacter"
    })
    password:string

    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-z]{3}\d{3}$/,{
      message:"course code must be of form aaa000"
    })
    course:string

    @IsString()
    @IsNotEmpty()
    @IsEnum(Gender)
    Gender:string

    @IsString()
    @IsEnum(Hostels)
    @IsNotEmpty()
    hostel:string

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(4)
    cluster:number

}

export class UpdateMentorDTO{
  @IsOptional()
  @IsString()
  @Length(3)
  name:string

  @IsEmail()
  @IsOptional()
  @IsString()
  email:string


  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(4)
  cluster:number

  @IsNumber()
  @IsOptional()
  contact:number

  @IsEnum(Hostels)
  @IsOptional()
  hostel:string

  @IsOptional()
  @IsEnum(Gender)
  Gender:string

}

export class time{
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  time:number
}

export class id{
  id:string
}

export class passDTO{
  @IsNotEmpty()
  @Length(9, 9)
  @Matches(/^[a-z]{2}\d{7}$/, {
  message: 'Kerberos should be of the form aa000000',
  })
  kerbros: string; // Specify 'string' as the type
}