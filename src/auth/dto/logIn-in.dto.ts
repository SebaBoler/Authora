import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class LogInDto {
  @ApiProperty({
    description: 'User email address used for logging in',
    example: 'user@example.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password for the user account',
    example: 'securePassword123!',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
