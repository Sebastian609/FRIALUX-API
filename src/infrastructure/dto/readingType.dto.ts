// src/application/dto/module.dto.ts
import { IsString, IsOptional, IsNotEmpty, IsNumber, IsBoolean } from "class-validator";
import { Expose } from "class-transformer";

export class CreateReadingTypeDto {
  @IsString()
  name: string;

  @IsString()
  @Expose()
  simbol: string;
}

export class UpdateReadingTypeDto {
  @IsNotEmpty()
  @IsNumber()
  @Expose()
  id: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @Expose()
  simbol?: string;

  @IsOptional()
  @IsBoolean()
  @Expose({name: "is_active"})
  isActive?: string;
}
