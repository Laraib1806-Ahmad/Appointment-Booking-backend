import { IsString, IsUUID } from 'class-validator';

export class CreateClinicDto {
  @IsUUID()
  doctorId: string;

  @IsString()
  clinicName: string;

  @IsString()
  address: string;

  @IsString()
  city: string;
}
