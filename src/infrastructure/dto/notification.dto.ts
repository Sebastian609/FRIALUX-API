// src/application/dto/module.dto.ts
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  Length,
} from "class-validator";
import { Expose, Type } from "class-transformer";

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsNumber()
  @Expose()
  id: number;

  @IsNotEmpty()
  @IsString()
  @Expose()
  message: string;

  @IsNotEmpty()
  @IsNumber()
  @Expose()
  readingId: number;
}

export class UpdateNotificationDto {
  @IsNotEmpty()
  @IsNumber()
  @Expose()
  id: number;
  
  @IsOptional()
  @IsString()
  @Expose()
  message?: string;

  @IsOptional()
  @IsNumber()
  @Expose()
  readingId?: number;
}
