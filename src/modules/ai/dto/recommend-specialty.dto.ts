import { IsString, MinLength } from 'class-validator';

export class RecommendSpecialtyDto {
  @IsString()
  @MinLength(5)
  symptoms: string;
}
