import { IsArray, IsDate, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsPostalCode, IsString, Length, Max, Min, MinLength } from "class-validator";

export class FestivalCreateDto {
  @IsNumber()
  @IsPositive()
  idCategory: number;

  @IsNumber(undefined, {each: true})
  idSubCategory: number[];

  @IsString()
  @MinLength(5)
  name: string;

  @IsString()
  region: string;

  @IsString()
  department: string;

  @Length(5,5)
  @IsNotEmpty()
  zipcode: string;

  @IsString()
  @MinLength(10)
  address: string;

  @IsOptional()
  website?: string | null;

  @IsEmail()
  email: string;

  @IsOptional()
  creationDate?: string | null;

  @IsNumber()
  geoPosX: number;

  @IsNumber()
  geoPosY: number;

  @IsDate()
  dateStart: Date;

  @IsDate()
  dateEnd: Date;
}
