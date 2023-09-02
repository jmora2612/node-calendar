import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { calendarDTO } from 'src/shared/dtos/libs/calendarDTO';

/**
 * @method CalendarValidation()
 * Este Dto, es el encargado de validar el registro o creacion de la aplicacion
 */

export class CalendarValidation extends PartialType(calendarDTO) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(2)
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(500)
  @MinLength(2)
  @IsString()
  notes: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  start: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  end: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  user: string;
}

export class CalendarUpdateValidation extends PartialType(calendarDTO) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(2)
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(500)
  @MinLength(2)
  @IsString()
  notes: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  start: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  end: Date;
}
