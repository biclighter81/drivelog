import { IsEmail, IsPhoneNumber, IsString, Length } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @Length(2, 16)
  prename: string;
  @IsString()
  @Length(2, 16)
  name: string;
  @IsPhoneNumber()
  phone: string;
  @IsEmail()
  email: string;
  @IsString()
  @Length(8, 32)
  password?: string;
}
