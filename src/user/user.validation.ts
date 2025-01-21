import { Hostels } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Matches, Min, MinLength } from 'class-validator';
import { Response } from 'supertest';

export class emailDTO {
  @IsNotEmpty()
  @Length(9, 9)
  @Matches(/^[a-z]{2}\d{7}$/, {
    message: 'Kerberos should be of the form aa000000',
  })
  kerbros: string; // Specify 'string' as the type
}

export class otpDTO{
  @IsNotEmpty()
  @Length(9, 9)
  @Matches(/^[a-z]{2}\d{7}$/, {
    message: 'Kerberos should be of the form aa000000',
  })
  kerbros: string; // Specify 'string' as the type

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  otp:number
}

export class userDTO{

  @IsNotEmpty()
  @IsString()
  @Length(3)
  name:string

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{12,64}$/,{
    message:"Password should be atleast 12 character string with one upperCase ,one lowerCase,one Digit and one specialCharacter"
  })
  password:string

  @IsString()
  @IsNotEmpty()
  @IsEnum(Hostels)
  hostel:Hostels

}

export class updateDTO{
  @IsOptional()
  @IsString()
  @Length(3)
  name:string
  
  @IsOptional()
  @IsEnum(Hostels)
  hostel:string
}

export class passdto{
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{12,64}$/,{
    message:"Password should be atleast 12 character string with one upperCase ,one lowerCase,one Digit and one specialCharacter"
  })
  password:string

}

export type Responsewithcookie={
  cookie:any
  ,Response:Response
};


export class loginDTO{
  @IsNotEmpty()
  @Length(9, 9)
  @Matches(/^[a-z]{2}\d{7}$/, {
    message: 'Kerberos should be of the form aa000000',
  })
  kerbrosId:string

  @IsNotEmpty()
  password:string
}