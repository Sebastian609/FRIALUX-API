import { IsInt, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

class BasePaginationDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  items: number;
}

export class PaginationDto extends BasePaginationDto {}

export class PaginationConfigurationDto extends BasePaginationDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id: number;
}

export class PaginationNotificationDto extends BasePaginationDto {
  @IsString()
  room: string;
}