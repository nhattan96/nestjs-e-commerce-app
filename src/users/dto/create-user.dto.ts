import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';
import { IsStrongPasswordCustom } from '../../common/custom-validators/password-strength.validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty({
    description: 'The username of login user',
    example: 'user1',
  })
  username: string;

  @IsString()
  @Length(8, 20, {
    message: 'Password must be between 8 and 20 characters long',
  })
  @IsStrongPasswordCustom()
  // @IsStrongPassword(
  //   {
  //     minLength: 8,
  //     minLowercase: 1,
  //     minUppercase: 1,
  //     minNumbers: 1,
  //     minSymbols: 1,
  //   },
  //   {
  //     message:
  //       'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol',
  //   },
  // )
  @ApiProperty({
    description: 'The password of login user',
    example: 'Password1@',
  })
  password: string;

  @IsEmail()
  @ApiProperty({
    description: 'The email of login user',
    example: 'email1@gmail.com',
  })
  email: string;
}
