import { IsNumberString, IsOptional } from 'class-validator';

export class UserDto {
  @IsNumberString()
  @IsOptional()
  page?: string;
}
