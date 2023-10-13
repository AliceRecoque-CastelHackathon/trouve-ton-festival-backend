import { IsNotEmpty, MinLength } from "class-validator";

export class FestivalNameDto {
  @IsNotEmpty()
  @MinLength(5)
  name: string;
}
