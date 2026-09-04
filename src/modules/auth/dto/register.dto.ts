import {
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { RoleType } from '../../../constants/role-type';

export class RegisterDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  firstName: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  password: string;

  @IsString()
  @MinLength(11)
  @MaxLength(14)
  phone: string;

  @IsOptional()
  @IsEnum(RoleType)
  role?: RoleType;
}
