import { IsString, IsEmail, MinLength, Matches } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, {
    message: 'Password is too short. It should be at least 8 characters long.',
  })
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/, {
    message:
      'Password too weak. It should contain at least one uppercase letter, one lowercase letter, and one number.',
  })
  password: string;
}
