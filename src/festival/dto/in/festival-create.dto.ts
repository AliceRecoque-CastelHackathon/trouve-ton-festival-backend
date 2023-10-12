import { IsArray, IsEmail, IsNumber, IsOptional, IsPositive, IsPostalCode, IsString, Length, Min, MinLength } from "class-validator";

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

  @IsNumber()
  @Length(5, 5)
  zipcode: number;

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
}
