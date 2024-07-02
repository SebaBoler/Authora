import { IsString, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsArray()
  @ArrayNotEmpty()
  permissions: string[];
}
