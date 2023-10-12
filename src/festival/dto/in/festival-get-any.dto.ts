import { IsEmail, IsOptional, IsPositive } from 'class-validator';

export class FestivalGetAnyDto {
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
