import { IsNotEmpty, IsNumber, Length, Matches, Min, MinLength } from 'class-validator';

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
  @Length(4,4)
  @Min(0)
  otp:number
}

export type Responsewithcookie={
  cookie:any
  ,Response
};