import { IsNotEmpty, Length, Matches } from 'class-validator';

export class EmailVerify {
  @IsNotEmpty()
  @Length(9, 9)
  @Matches(/^[a-z]{2}\d{7}$/, {
    message: 'Kerberos ID should be of the form aa000000',
  })
  kerberosId: string; // Specify 'string' as the type
}
