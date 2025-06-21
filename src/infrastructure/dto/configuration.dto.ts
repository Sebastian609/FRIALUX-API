import { IsNumber, IsBoolean, IsNotEmpty, Min, Max, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateConfigurationDto {
  @IsNumber({}, { message: 'minValue must be a valid number' })
  @Expose()
  minValue: number;

  @IsNumber({}, { message: 'maxValue must be a valid number' })
  @Expose()
  maxValue: number;

  @IsNumber({}, { message: 'readingTypeId must be a valid number' })
  @IsNotEmpty({ message: 'readingTypeId should not be empty' })
  @Expose()
  readingTypeId: number;

  @IsNumber({}, { message: 'moduleId must be a valid number' })
  @IsNotEmpty({ message: 'moduleId should not be empty' })
  @Expose()
  moduleId: number;
}

export class UpdateConfigurationDto {
  @IsNumber()
  @Expose()
  id: number;

  @IsOptional()
  @IsNumber()
  @Expose({ name: 'min_value' })
  minValue?: number;

  @IsOptional()
  @IsNumber()
  @Expose({ name: 'max_value' })
  maxValue?: number;

  @IsOptional()
  @IsNumber()
  @Expose({ name: 'reading_type_id' })
  readingTypeId?: number;

  @IsOptional()
  @IsNumber()
  @Expose({ name: 'module_id' })
  moduleId?: number;

  @IsOptional()
  @IsBoolean()
  @Expose({ name: 'is_active' })
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  deleted?: boolean;
}