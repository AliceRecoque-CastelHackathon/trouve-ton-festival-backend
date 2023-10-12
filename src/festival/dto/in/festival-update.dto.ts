import { IsEmail, IsNumber, IsOptional, IsPositive, IsPostalCode, IsString, Length, MinLength } from "class-validator";

export class FestivalUpdateDto {
  @IsNumber()
  @IsPositive()
  id: number;

  @IsNumber()
  @IsPositive()
  idCategory: number;

  @IsNumber(undefined, {each: true})
  idSubCategory: number[];

  @IsString()
  region: string;

  @IsString()
  department: string;

  @IsNumber()
  @IsPostalCode()
  zipcode: number;

  @IsString()
  @MinLength(10)
  address: string;

  @IsOptional()
  website?: string | null;

  @IsEmail()
  email: string;

  @IsNumber()
  geoPosX: number;

  @IsNumber()
  geoPosY: number;
}
