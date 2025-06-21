// src/application/dto/module.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDecimal,
  Length,
} from "class-validator";
import { Expose, Type } from "class-transformer";
import { ReadingType } from "../entity/readingType.entity";
import { CreateReadingTypeDto } from "./readingType.dto";

export class CreateReadingDto {
  @IsDecimal()
  @IsNotEmpty({ message: "el valor de lectura no puede ser varcio" })
  @Expose()
  value: number;

  @IsNumber()
  @IsNotEmpty({ message: "el valor de tipo de lectura no puede ser varcio" })
  @Expose()
  readingTypeId: number;
}

export class SendReadingDto {
  @IsDecimal()
  @IsNotEmpty({ message: "el valor de lectura no puede ser varcio" })
  @Expose()
  value: number;

  @IsNumber()
  @IsNotEmpty({ message: "el valor de tipo de lectura no puede ser varcio" })
  @Expose()
  readingTypeId: number;

  @Expose()
  @Type(() => ReadingType)
  reading: CreateReadingTypeDto;
}

export class CreateRaingsBatchDto {
  @Expose()
  @Type(() => CreateReadingDto) // ← esto es clave para transformar objetos internos
  readings: CreateReadingDto[];

  @IsString()
  @Expose()
  @Length(10, 10, { message: "⚠️ Debe tener exactamente 10 caracteres" })
  webSocketRoom: string;
}

export class UpdateReadingDto {
  @IsNotEmpty()
  @IsNumber()
  @Expose()
  id: number;

  @IsDecimal()
  @IsNotEmpty({ message: "el valor de lectura no puede ser varcio" })
  @Expose()
  value: number;
}
