import { IsUUID, IsString, IsEmail, IsDateString } from 'class-validator';

export class CreateAppointmentDto {
  @IsUUID()
  clinicId: string;

  @IsString()
  patientName: string;

  @IsEmail()
  patientEmail: string;

  @IsDateString()
  startsAt: string;
}
