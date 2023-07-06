import { IsNumberString, IsOptional } from 'class-validator';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

export class UserDto implements IPaginationOptions {
  @IsNumberString()
  @IsOptional()
  limit: string | number;

  @IsNumberString()
  @IsOptional()
  page: string | number;
}
