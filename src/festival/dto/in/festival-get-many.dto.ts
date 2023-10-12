import { IsEmail, IsOptional, IsPositive } from 'class-validator';

export class FestivalGetManyDto {
  @IsOptional()
  @IsPositive()
  limit?: number;

  @IsOptional()
  @IsPositive()
  offset?: number;

  @IsOptional()
  categoryId?: number;

  @IsOptional()
  region?: string;
}
