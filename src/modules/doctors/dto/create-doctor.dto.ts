import {
  IsString,
  IsEmail,
  MinLength,
  IsInt,
  IsNumber,
  Min,
  IsOptional,
} from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  specialty: string;

  @IsInt()
  @Min(0)
  experienceYears: number;

  @IsNumber()
  @Min(0)
  fee: number;

  @IsOptional()
  @IsString()
  pmdcNumber?: string;
}
