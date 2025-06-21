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

export class CreateModuleDto {
  @IsString()
  name: string;
}

export class UpdateModuleDto {
  @IsNotEmpty()
  @IsNumber()
  @Expose()
  id: number;

  @IsOptional()
  @IsString()
  @Expose()
  name?: string;

  @IsOptional()
  @IsString()
  @Expose()
  @Length(10, 10, { message: "⚠️ Debe tener exactamente 10 caracteres" })
  webSocketRoom?: string;

  @IsOptional()
  @IsBoolean()
  @Expose()
  isActive?: boolean;
}
