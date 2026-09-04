import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class FaqDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  question: string;
}
