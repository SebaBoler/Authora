import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'The user ID for whom the refresh token is issued',
    example: '12345',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'The actual refresh token string',
    example: 'abcd1234efgh5678',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
